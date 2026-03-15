function TrainerDashboard() {
  _s();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [videoForm, setVideoForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    video_url: "",
    thumbnail_url: "",
    sport_type: "",
    category: "",
    difficulty_level: "",
    duration_minutes: 0
  });
  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        if (userData.user_type !== "trainer" && userData.role !== "admin") {
          window.location.href = "/";
          return;
        }
        setUser(userData);
      } else {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);
  const { data: trainingVideos = [] } = useQuery({
    queryKey: ["trainer-videos"],
    queryFn: () => base44.entities.TrainingVideo.list("-created_date", 100)
  });
  const { data: traineeVideos = [] } = useQuery({
    queryKey: ["trainee-videos-pending"],
    queryFn: () => base44.entities.TraineeVideo.list("-created_date", 100)
  });
  const { data: bookings = [] } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: () => base44.entities.Booking.list("-created_date", 100)
  });
  const { data: messages = [] } = useQuery({
    queryKey: ["messages"],
    queryFn: () => base44.entities.ContactMessage.list("-created_date", 50)
  });
  const createVideoMutation = useMutation({
    mutationFn: (data) => base44.entities.TrainingVideo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-videos"] });
      setShowVideoForm(false);
      setVideoForm({
        title_ar: "",
        title_en: "",
        description_ar: "",
        description_en: "",
        video_url: "",
        thumbnail_url: "",
        sport_type: "",
        category: "",
        difficulty_level: "",
        duration_minutes: 0
      });
      toast.success(language === "ar" ? "تم إضافة الفيديو" : "Video added");
    }
  });
  const updateTraineeVideoMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const video = await base44.entities.TraineeVideo.update(id, data);
      if (data.status === "approved") {
        await base44.entities.Notification.create({
          user_email: video.trainee_email,
          type: "video_approved",
          title_ar: "تمت الموافقة على الفيديو",
          title_en: "Video Approved",
          message_ar: `تمت الموافقة على فيديو "${video.title}" من قبل المدرب`,
          message_en: `Your video "${video.title}" has been approved by the trainer`,
          related_id: video.id,
          related_type: "video"
        });
      } else if (data.status === "rejected") {
        await base44.entities.Notification.create({
          user_email: video.trainee_email,
          type: "video_rejected",
          title_ar: "تم رفض الفيديو",
          title_en: "Video Rejected",
          message_ar: `تم رفض فيديو "${video.title}"`,
          message_en: `Your video "${video.title}" has been rejected`,
          related_id: video.id,
          related_type: "video"
        });
      }
      return video;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainee-videos-pending"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
      toast.success(language === "ar" ? "تم التحديث" : "Updated");
    }
  });
  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const booking = await base44.entities.Booking.update(id, data);
      if (data.status === "confirmed") {
        await base44.entities.Notification.create({
          user_email: booking.trainee_email,
          type: "booking_confirmed",
          title_ar: "تم تأكيد الحجز من قبل المدرب",
          title_en: "Booking Confirmed by Trainer",
          message_ar: `تم تأكيد حجزك من قبل المدرب`,
          message_en: `Your booking has been confirmed by the trainer`,
          related_id: booking.id,
          related_type: "booking"
        });
      } else if (data.status === "cancelled") {
        await base44.entities.Notification.create({
          user_email: booking.trainee_email,
          type: "booking_cancelled",
          title_ar: "تم إلغاء الحجز",
          title_en: "Booking Cancelled",
          message_ar: `تم إلغاء حجزك. يرجى التواصل مع المدرب لمزيد من المعلومات`,
          message_en: `Your booking has been cancelled. Please contact the trainer for more information`,
          related_id: booking.id,
          related_type: "booking"
        });
      }
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
      toast.success(language === "ar" ? "تم التحديث" : "Updated");
    }
  });
  const updateMessageMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContactMessage.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setSelectedMessage(null);
      setReplyText("");
      toast.success(language === "ar" ? "تم الرد" : "Reply sent");
    }
  });
  const pendingVideos = traineeVideos.filter((v) => v.status === "pending");
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const newMessages = messages.filter((m) => m.status === "new");
  const stats = [
    { label: language === "ar" ? "فيديوهات التدريب" : "Training Videos", value: trainingVideos.length, icon: Video, color: "bg-emerald-500" },
    { label: language === "ar" ? "فيديوهات معلقة" : "Pending Videos", value: pendingVideos.length, icon: Clock, color: "bg-yellow-500" },
    { label: language === "ar" ? "حجوزات جديدة" : "New Bookings", value: pendingBookings.length, icon: Calendar, color: "bg-blue-500" },
    { label: language === "ar" ? "رسائل جديدة" : "New Messages", value: newMessages.length, icon: Mail, color: "bg-purple-500" }
  ];
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-gray-100 text-gray-700",
    new: "bg-blue-100 text-blue-700",
    read: "bg-gray-100 text-gray-700",
    replied: "bg-green-100 text-green-700"
  };
  if (!user) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen pt-24 flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(Loader2, { className: "w-8 h-8 animate-spin text-emerald-600" }, void 0, false, {
      fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
      lineNumber: 220,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
      lineNumber: 219,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen pt-24 pb-16 bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between mb-8", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV("h1", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(LayoutDashboard, { className: "w-7 h-7 text-emerald-600" }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 232,
              columnNumber: 15
            }, this),
            t("dashboard")
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 231,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 mt-1", children: language === "ar" ? `مرحباً ${user.full_name}` : `Welcome ${user.full_name}` }, void 0, false, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 235,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 230,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Button, { onClick: () => setShowVideoForm(true), className: "bg-emerald-600 hover:bg-emerald-700", children: [
          /* @__PURE__ */ jsxDEV(Plus, { className: "w-5 h-5 me-2" }, void 0, false, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 240,
            columnNumber: 13
          }, this),
          language === "ar" ? "إضافة فيديو تدريب" : "Add Training Video"
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 239,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
        lineNumber: 229,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: stats.map(
        (stat, index) => /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: index * 0.1 },
            children: /* @__PURE__ */ jsxDEV(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: `w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`, children: /* @__PURE__ */ jsxDEV(stat.icon, { className: "w-6 h-6 text-white" }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 258,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 257,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("div", { className: "text-2xl font-bold", children: stat.value }, void 0, false, {
                  fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                  lineNumber: 261,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-500", children: stat.label }, void 0, false, {
                  fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                  lineNumber: 262,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 260,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 256,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 255,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 254,
              columnNumber: 15
            }, this)
          },
          index,
          false,
          {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 248,
            columnNumber: 11
          },
          this
        )
      ) }, void 0, false, {
        fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
        lineNumber: 246,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Tabs, { defaultValue: "videos", className: "space-y-6", children: [
        /* @__PURE__ */ jsxDEV(TabsList, { className: "bg-white shadow-sm border p-1", children: [
          /* @__PURE__ */ jsxDEV(TabsTrigger, { value: "videos", className: "gap-2", children: [
            /* @__PURE__ */ jsxDEV(Video, { className: "w-4 h-4" }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 275,
              columnNumber: 15
            }, this),
            language === "ar" ? "فيديوهات المتدربين" : "Trainee Videos",
            pendingVideos.length > 0 && /* @__PURE__ */ jsxDEV(Badge, { className: "bg-yellow-500 text-white ms-1", children: pendingVideos.length }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 278,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 274,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(TabsTrigger, { value: "bookings", className: "gap-2", children: [
            /* @__PURE__ */ jsxDEV(Calendar, { className: "w-4 h-4" }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 282,
              columnNumber: 15
            }, this),
            language === "ar" ? "الحجوزات" : "Bookings",
            pendingBookings.length > 0 && /* @__PURE__ */ jsxDEV(Badge, { className: "bg-blue-500 text-white ms-1", children: pendingBookings.length }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 285,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 281,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(TabsTrigger, { value: "messages", className: "gap-2", children: [
            /* @__PURE__ */ jsxDEV(Mail, { className: "w-4 h-4" }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 289,
              columnNumber: 15
            }, this),
            t("messages"),
            newMessages.length > 0 && /* @__PURE__ */ jsxDEV(Badge, { className: "bg-purple-500 text-white ms-1", children: newMessages.length }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 292,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 288,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 273,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(TabsContent, { value: "videos", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
          traineeVideos.map(
            (video) => /* @__PURE__ */ jsxDEV(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-4 flex items-center gap-4", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-32 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0", children: video.thumbnail_url ? /* @__PURE__ */ jsxDEV("img", { src: video.thumbnail_url, alt: "", className: "w-full h-full object-cover" }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 305,
                columnNumber: 21
              }, this) : /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(Play, { className: "w-8 h-8 text-gray-400" }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 308,
                columnNumber: 27
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 307,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 303,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold truncate", children: video.title }, void 0, false, {
                  fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                  lineNumber: 313,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500", children: video.trainee_name }, void 0, false, {
                  fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                  lineNumber: 314,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxDEV(SportIcon, { sport: video.sport_type, size: "small" }, void 0, false, {
                    fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                    lineNumber: 316,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(Badge, { className: statusColors[video.status], children: t(`status.${video.status}`) }, void 0, false, {
                    fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                    lineNumber: 317,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                  lineNumber: 315,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 312,
                columnNumber: 21
              }, this),
              video.status === "pending" && /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxDEV(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "text-green-600 hover:bg-green-50",
                    onClick: () => updateTraineeVideoMutation.mutate({ id: video.id, data: { status: "approved" } }),
                    children: /* @__PURE__ */ jsxDEV(Check, { className: "w-4 h-4" }, void 0, false, {
                      fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                      lineNumber: 330,
                      columnNumber: 27
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                    lineNumber: 324,
                    columnNumber: 25
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "text-red-600 hover:bg-red-50",
                    onClick: () => updateTraineeVideoMutation.mutate({ id: video.id, data: { status: "rejected" } }),
                    children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
                      fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                      lineNumber: 338,
                      columnNumber: 27
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                    lineNumber: 332,
                    columnNumber: 25
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 323,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 302,
              columnNumber: 19
            }, this) }, video.id, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 301,
              columnNumber: 15
            }, this)
          ),
          traineeVideos.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "text-center py-12 text-gray-500", children: language === "ar" ? "لا توجد فيديوهات" : "No videos" }, void 0, false, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 346,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 299,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 298,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(TabsContent, { value: "bookings", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: bookings.map(
          (booking) => /* @__PURE__ */ jsxDEV(Card, { className: "border-0 shadow-sm", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-4 flex items-center gap-4", children: [
            /* @__PURE__ */ jsxDEV(SportIcon, { sport: booking.sport_type }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 359,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold", children: booking.trainee_name }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 361,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500", children: booking.trainee_email }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 362,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 text-sm text-gray-500 mt-1", children: [
                /* @__PURE__ */ jsxDEV("span", { children: booking.session_date }, void 0, false, {
                  fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                  lineNumber: 364,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: booking.session_time }, void 0, false, {
                  fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                  lineNumber: 365,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 363,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 360,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(Badge, { className: statusColors[booking.status], children: t(`status.${booking.status}`) }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 368,
              columnNumber: 21
            }, this),
            booking.status === "pending" && /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxDEV(
                Button,
                {
                  size: "sm",
                  className: "bg-green-600 hover:bg-green-700",
                  onClick: () => updateBookingMutation.mutate({ id: booking.id, data: { status: "confirmed" } }),
                  children: language === "ar" ? "تأكيد" : "Confirm"
                },
                void 0,
                false,
                {
                  fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                  lineNumber: 373,
                  columnNumber: 25
                },
                this
              ),
              /* @__PURE__ */ jsxDEV(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "text-red-600",
                  onClick: () => updateBookingMutation.mutate({ id: booking.id, data: { status: "cancelled" } }),
                  children: language === "ar" ? "إلغاء" : "Cancel"
                },
                void 0,
                false,
                {
                  fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                  lineNumber: 380,
                  columnNumber: 25
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 372,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 358,
            columnNumber: 19
          }, this) }, booking.id, false, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 357,
            columnNumber: 15
          }, this)
        ) }, void 0, false, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 355,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 354,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(TabsContent, { value: "messages", children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: messages.map(
          (msg) => /* @__PURE__ */ jsxDEV(Card, { className: "border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow", onClick: () => setSelectedMessage(msg), children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold", children: msg.sender_name }, void 0, false, {
                  fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                  lineNumber: 405,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV(Badge, { className: statusColors[msg.status], children: t(`status.${msg.status}`) }, void 0, false, {
                  fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                  lineNumber: 406,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 404,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500 mb-2", children: msg.sender_email }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 410,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "font-medium", children: msg.subject }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 411,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 line-clamp-2 mt-1", children: msg.message }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 412,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 403,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV(ChevronRight, { className: "w-5 h-5 text-gray-400" }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 414,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 402,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 401,
            columnNumber: 19
          }, this) }, msg.id, false, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 400,
            columnNumber: 15
          }, this)
        ) }, void 0, false, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 398,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 397,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
        lineNumber: 272,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
      lineNumber: 227,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Dialog, { open: showVideoForm, onOpenChange: setShowVideoForm, children: /* @__PURE__ */ jsxDEV(DialogContent, { className: "max-w-lg max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxDEV(DialogHeader, { children: /* @__PURE__ */ jsxDEV(DialogTitle, { children: language === "ar" ? "إضافة فيديو تدريب" : "Add Training Video" }, void 0, false, {
        fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
        lineNumber: 428,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
        lineNumber: 427,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "العنوان (عربي)" : "Title (Arabic)" }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 433,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                value: videoForm.title_ar,
                onChange: (e) => setVideoForm((p) => ({ ...p, title_ar: e.target.value })),
                className: "mt-1"
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 434,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 432,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "العنوان (إنجليزي)" : "Title (English)" }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 441,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                value: videoForm.title_en,
                onChange: (e) => setVideoForm((p) => ({ ...p, title_en: e.target.value })),
                className: "mt-1"
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 442,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 440,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 431,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "رابط الفيديو" : "Video URL" }, void 0, false, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 450,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            Input,
            {
              value: videoForm.video_url,
              onChange: (e) => setVideoForm((p) => ({ ...p, video_url: e.target.value })),
              placeholder: "https://youtube.com/...",
              className: "mt-1"
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 451,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 449,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: t("selectSport") }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 460,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(Select, { value: videoForm.sport_type, onValueChange: (v) => setVideoForm((p) => ({ ...p, sport_type: v })), children: [
              /* @__PURE__ */ jsxDEV(SelectTrigger, { className: "mt-1", children: /* @__PURE__ */ jsxDEV(SelectValue, {}, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 462,
                columnNumber: 51
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 462,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(SelectContent, { children: sports.map((s) => /* @__PURE__ */ jsxDEV(SelectItem, { value: s, children: t(`sports.${s}`) }, s, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 464,
                columnNumber: 40
              }, this)) }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 463,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 461,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 459,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "المستوى" : "Level" }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 469,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(Select, { value: videoForm.difficulty_level, onValueChange: (v) => setVideoForm((p) => ({ ...p, difficulty_level: v })), children: [
              /* @__PURE__ */ jsxDEV(SelectTrigger, { className: "mt-1", children: /* @__PURE__ */ jsxDEV(SelectValue, {}, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 471,
                columnNumber: 51
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 471,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(SelectContent, { children: levels.map((l) => /* @__PURE__ */ jsxDEV(SelectItem, { value: l, children: t(`levels.${l}`) }, l, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 473,
                columnNumber: 40
              }, this)) }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 472,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 470,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 468,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 458,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            onClick: () => createVideoMutation.mutate(videoForm),
            disabled: createVideoMutation.isPending || !videoForm.title_ar || !videoForm.video_url || !videoForm.sport_type,
            className: "w-full bg-emerald-600 hover:bg-emerald-700",
            children: createVideoMutation.isPending ? /* @__PURE__ */ jsxDEV(Loader2, { className: "w-4 h-4 animate-spin" }, void 0, false, {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 483,
              columnNumber: 48
            }, this) : language === "ar" ? "إضافة" : "Add"
          },
          void 0,
          false,
          {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 478,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
        lineNumber: 430,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
      lineNumber: 426,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
      lineNumber: 425,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Dialog, { open: !!selectedMessage, onOpenChange: () => setSelectedMessage(null), children: /* @__PURE__ */ jsxDEV(DialogContent, { children: [
      /* @__PURE__ */ jsxDEV(DialogHeader, { children: /* @__PURE__ */ jsxDEV(DialogTitle, { children: selectedMessage?.subject }, void 0, false, {
        fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
        lineNumber: 493,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
        lineNumber: 492,
        columnNumber: 11
      }, this),
      selectedMessage && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-50 rounded-xl p-4", children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500 mb-2", children: [
            selectedMessage.sender_name,
            " (",
            selectedMessage.sender_email,
            ")"
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 498,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("p", { children: selectedMessage.message }, void 0, false, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 499,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 497,
          columnNumber: 15
        }, this),
        selectedMessage.reply && /* @__PURE__ */ jsxDEV("div", { className: "bg-emerald-50 rounded-xl p-4", children: [
          /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-emerald-600 mb-2", children: language === "ar" ? "ردك:" : "Your reply:" }, void 0, false, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 503,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("p", { children: selectedMessage.reply }, void 0, false, {
            fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
            lineNumber: 504,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 502,
          columnNumber: 13
        }, this),
        selectedMessage.status !== "replied" && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(
            Textarea,
            {
              value: replyText,
              onChange: (e) => setReplyText(e.target.value),
              placeholder: language === "ar" ? "اكتب ردك..." : "Write your reply...",
              rows: 4
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 509,
              columnNumber: 19
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            Button,
            {
              onClick: () => updateMessageMutation.mutate({
                id: selectedMessage.id,
                data: { status: "replied", reply: replyText }
              }),
              disabled: !replyText || updateMessageMutation.isPending,
              className: "w-full bg-emerald-600 hover:bg-emerald-700",
              children: updateMessageMutation.isPending ? /* @__PURE__ */ jsxDEV(Loader2, { className: "w-4 h-4 animate-spin" }, void 0, false, {
                fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
                lineNumber: 523,
                columnNumber: 56
              }, this) : t("reply")
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
              lineNumber: 515,
              columnNumber: 19
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
          lineNumber: 508,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
        lineNumber: 496,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
      lineNumber: 491,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
      lineNumber: 490,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/TrainerDashboard.jsx?raw=",
    lineNumber: 226,
    columnNumber: 5
  }, this);
}