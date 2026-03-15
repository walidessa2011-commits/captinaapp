function Profile() {
  _s();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
        setFormData({
          phone: userData.phone || "",
          bio_ar: userData.bio_ar || "",
          bio_en: userData.bio_en || "",
          city: userData.city || "",
          specializations: userData.specializations || [],
          experience_years: userData.experience_years || 0
        });
      } else {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);
  const { data: myVideos = [], refetch: refetchVideos } = useQuery({
    queryKey: ["my-videos", user?.email],
    queryFn: () => base44.entities.TraineeVideo.filter({ trainee_email: user?.email }, "-created_date", 20),
    enabled: !!user
  });
  const { data: myBookings = [], refetch: refetchBookings } = useQuery({
    queryKey: ["my-bookings-profile", user?.email],
    queryFn: () => base44.entities.Booking.filter({ trainee_email: user?.email }, "-created_date", 20),
    enabled: !!user
  });
  const { data: myPrograms = [] } = useQuery({
    queryKey: ["my-programs", user?.email],
    queryFn: () => base44.entities.TrainingProgram.filter({ created_by: user?.email }, "-created_date", 20),
    enabled: !!user && (user.user_type === "trainer" || user.role === "admin")
  });
  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: async () => {
      const updatedUser = await base44.auth.me();
      setUser(updatedUser);
      setEditing(false);
      toast.success(language === "ar" ? "تم حفظ التغييرات" : "Changes saved");
    }
  });
  const handleSave = () => {
    updateMutation.mutate(formData);
  };
  const handleDeleteAccount = async () => {
    toast.error(language === "ar" ? "تم طلب حذف الحساب. سيتم التواصل معك قريباً." : "Account deletion requested. We will contact you soon.");
    setShowDeleteDialog(false);
    base44.auth.logout();
  };
  const toggleSpecialization = (sport) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations?.includes(sport) ? prev.specializations.filter((s) => s !== sport) : [...prev.specializations || [], sport]
    }));
  };
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700"
  };
  if (!user) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen pt-24 flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(Loader2, { className: "w-8 h-8 animate-spin text-emerald-600" }, void 0, false, {
      fileName: "/app/src/pages/Profile.jsx?raw=",
      lineNumber: 132,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/Profile.jsx?raw=",
      lineNumber: 131,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen pt-24 pb-16 bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          children: /* @__PURE__ */ jsxDEV(Card, { className: "shadow-lg border-0 mb-6 overflow-hidden", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "h-32 bg-gradient-to-r from-emerald-600 to-emerald-800" }, void 0, false, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 147,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(CardContent, { className: "relative pt-0", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row md:items-end gap-4 -mt-12", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white", children: user.avatar_url ? /* @__PURE__ */ jsxDEV("img", { src: user.avatar_url, alt: "", className: "w-full h-full object-cover rounded-xl" }, void 0, false, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 152,
                columnNumber: 21
              }, this) : /* @__PURE__ */ jsxDEV(User, { className: "w-12 h-12 text-emerald-600" }, void 0, false, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 154,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 150,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex-1 pb-4", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 mb-1", children: [
                  /* @__PURE__ */ jsxDEV("h1", { className: "text-2xl font-bold text-gray-900", children: user.full_name }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 160,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV(Badge, { className: user.user_type === "trainer" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700", children: user.user_type === "trainer" ? t("trainer") : t("trainee") }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 161,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 159,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV(Mail, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 166,
                    columnNumber: 23
                  }, this),
                  user.email
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 165,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 158,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxDEV(
                  Button,
                  {
                    onClick: () => editing ? handleSave() : setEditing(true),
                    disabled: updateMutation.isPending,
                    className: editing ? "bg-emerald-600 hover:bg-emerald-700" : "",
                    variant: editing ? "default" : "outline",
                    children: updateMutation.isPending ? /* @__PURE__ */ jsxDEV(Loader2, { className: "w-4 h-4 animate-spin" }, void 0, false, {
                      fileName: "/app/src/pages/Profile.jsx?raw=",
                      lineNumber: 179,
                      columnNumber: 23
                    }, this) : editing ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                      /* @__PURE__ */ jsxDEV(Save, { className: "w-4 h-4 me-2" }, void 0, false, {
                        fileName: "/app/src/pages/Profile.jsx?raw=",
                        lineNumber: 182,
                        columnNumber: 27
                      }, this),
                      language === "ar" ? "حفظ" : "Save"
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/Profile.jsx?raw=",
                      lineNumber: 181,
                      columnNumber: 23
                    }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                      /* @__PURE__ */ jsxDEV(Edit2, { className: "w-4 h-4 me-2" }, void 0, false, {
                        fileName: "/app/src/pages/Profile.jsx?raw=",
                        lineNumber: 187,
                        columnNumber: 27
                      }, this),
                      language === "ar" ? "تعديل" : "Edit"
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/Profile.jsx?raw=",
                      lineNumber: 186,
                      columnNumber: 23
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 172,
                    columnNumber: 21
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV(
                  Button,
                  {
                    variant: "outline",
                    className: "text-red-600 border-red-200 hover:bg-red-50",
                    onClick: () => setShowDeleteDialog(true),
                    children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-4 h-4" }, void 0, false, {
                      fileName: "/app/src/pages/Profile.jsx?raw=",
                      lineNumber: 197,
                      columnNumber: 23
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 192,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 171,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 149,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 148,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 146,
            columnNumber: 13
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 142,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(Tabs, { defaultValue: "info", className: "space-y-6", children: [
        /* @__PURE__ */ jsxDEV(TabsList, { className: "bg-white shadow-sm border p-1", children: [
          /* @__PURE__ */ jsxDEV(TabsTrigger, { value: "info", children: language === "ar" ? "المعلومات الشخصية" : "Personal Info" }, void 0, false, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 208,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(TabsTrigger, { value: "videos", children: [
            t("myVideos"),
            " (",
            myVideos.length,
            ")"
          ] }, void 0, true, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 211,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(TabsTrigger, { value: "bookings", children: [
            t("myBookings"),
            " (",
            myBookings.length,
            ")"
          ] }, void 0, true, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 214,
            columnNumber: 15
          }, this),
          (user.user_type === "trainer" || user.role === "admin") && /* @__PURE__ */ jsxDEV(TabsTrigger, { value: "programs", children: [
            language === "ar" ? "برامجي التدريبية" : "My Programs",
            " (",
            myPrograms.length,
            ")"
          ] }, void 0, true, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 218,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 207,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(TabsContent, { value: "info", children: /* @__PURE__ */ jsxDEV(Card, { className: "shadow-sm border-0", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-6 space-y-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "رقم الجوال" : "Phone" }, void 0, false, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 230,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV(
                Input,
                {
                  value: formData.phone,
                  onChange: (e) => setFormData((prev) => ({ ...prev, phone: e.target.value })),
                  disabled: !editing,
                  placeholder: "+966 5X XXX XXXX",
                  className: "mt-2"
                },
                void 0,
                false,
                {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 231,
                  columnNumber: 23
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 229,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "المدينة" : "City" }, void 0, false, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 241,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV(
                Select,
                {
                  value: formData.city,
                  onValueChange: (value) => setFormData((prev) => ({ ...prev, city: value })),
                  disabled: !editing,
                  children: [
                    /* @__PURE__ */ jsxDEV(SelectTrigger, { className: "mt-2", children: /* @__PURE__ */ jsxDEV(SelectValue, { placeholder: language === "ar" ? "اختر المدينة" : "Select city" }, void 0, false, {
                      fileName: "/app/src/pages/Profile.jsx?raw=",
                      lineNumber: 248,
                      columnNumber: 27
                    }, this) }, void 0, false, {
                      fileName: "/app/src/pages/Profile.jsx?raw=",
                      lineNumber: 247,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV(SelectContent, { children: cities.map(
                      (city) => /* @__PURE__ */ jsxDEV(SelectItem, { value: city, children: city }, city, false, {
                        fileName: "/app/src/pages/Profile.jsx?raw=",
                        lineNumber: 252,
                        columnNumber: 27
                      }, this)
                    ) }, void 0, false, {
                      fileName: "/app/src/pages/Profile.jsx?raw=",
                      lineNumber: 250,
                      columnNumber: 25
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 242,
                  columnNumber: 23
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 240,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 228,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "نبذة عنك (عربي)" : "About You (Arabic)" }, void 0, false, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 260,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(
              Textarea,
              {
                value: formData.bio_ar,
                onChange: (e) => setFormData((prev) => ({ ...prev, bio_ar: e.target.value })),
                disabled: !editing,
                rows: 3,
                placeholder: language === "ar" ? "اكتب نبذة عنك..." : "Write about yourself...",
                className: "mt-2"
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 261,
                columnNumber: 21
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 259,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "نبذة عنك (إنجليزي)" : "About You (English)" }, void 0, false, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 272,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(
              Textarea,
              {
                value: formData.bio_en,
                onChange: (e) => setFormData((prev) => ({ ...prev, bio_en: e.target.value })),
                disabled: !editing,
                rows: 3,
                placeholder: "Write about yourself...",
                className: "mt-2"
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 273,
                columnNumber: 21
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 271,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { className: "mb-3 block", children: language === "ar" ? "الرياضات المفضلة" : "Favorite Sports" }, void 0, false, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 284,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2", children: sports.map(
              (sport) => /* @__PURE__ */ jsxDEV(
                "button",
                {
                  onClick: () => editing && toggleSpecialization(sport),
                  disabled: !editing,
                  className: `flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${formData.specializations?.includes(sport) ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"} ${!editing && "cursor-default"}`,
                  children: [
                    /* @__PURE__ */ jsxDEV(SportIcon, { sport, size: "small", showBg: false }, void 0, false, {
                      fileName: "/app/src/pages/Profile.jsx?raw=",
                      lineNumber: 299,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-sm", children: t(`sports.${sport}`) }, void 0, false, {
                      fileName: "/app/src/pages/Profile.jsx?raw=",
                      lineNumber: 300,
                      columnNumber: 27
                    }, this)
                  ]
                },
                sport,
                true,
                {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 289,
                  columnNumber: 23
                },
                this
              )
            ) }, void 0, false, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 287,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 283,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 227,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 226,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 225,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(TabsContent, { value: "videos", children: /* @__PURE__ */ jsxDEV(PullToRefresh, { onRefresh: refetchVideos, children: myVideos.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6", children: myVideos.map(
          (video) => /* @__PURE__ */ jsxDEV(VideoCard, { video, type: "trainee" }, video.id, false, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 315,
            columnNumber: 19
          }, this)
        ) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 313,
          columnNumber: 17
        }, this) : /* @__PURE__ */ jsxDEV(Card, { className: "shadow-sm border-0", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsxDEV(Video, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }, void 0, false, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 321,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: language === "ar" ? "لم تقم برفع أي فيديو بعد" : "You haven't uploaded any videos yet" }, void 0, false, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 322,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 320,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 319,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 311,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 310,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(TabsContent, { value: "bookings", children: /* @__PURE__ */ jsxDEV(PullToRefresh, { onRefresh: refetchBookings, children: myBookings.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: myBookings.map(
          (booking) => /* @__PURE__ */ jsxDEV(Card, { className: "shadow-sm border-0", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-4 flex items-center gap-4", children: [
            /* @__PURE__ */ jsxDEV(SportIcon, { sport: booking.sport_type }, void 0, false, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 339,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold", children: t(`sports.${booking.sport_type}`) }, void 0, false, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 341,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 text-sm text-gray-500 mt-1", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxDEV(Calendar, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 344,
                    columnNumber: 33
                  }, this),
                  booking.session_date
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 343,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: booking.session_time }, void 0, false, {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 347,
                  columnNumber: 31
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 342,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 340,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDEV(Badge, { className: statusColors[booking.status], children: t(`status.${booking.status}`) }, void 0, false, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 350,
              columnNumber: 27
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 338,
            columnNumber: 25
          }, this) }, booking.id, false, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 337,
            columnNumber: 19
          }, this)
        ) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 335,
          columnNumber: 17
        }, this) : /* @__PURE__ */ jsxDEV(Card, { className: "shadow-sm border-0", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsxDEV(Calendar, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }, void 0, false, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 360,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: language === "ar" ? "لا توجد حجوزات بعد" : "No bookings yet" }, void 0, false, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 361,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 359,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 358,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 333,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 332,
          columnNumber: 13
        }, this),
        (user.user_type === "trainer" || user.role === "admin") && /* @__PURE__ */ jsxDEV(TabsContent, { value: "programs", children: myPrograms.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6", children: myPrograms.map(
          (program) => /* @__PURE__ */ jsxDEV(Card, { className: "shadow-sm border-0 hover:shadow-lg transition-shadow", children: [
            /* @__PURE__ */ jsxDEV(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxDEV(CardTitle, { className: "text-xl mb-1", children: language === "ar" ? program.name_ar : program.name_en }, void 0, false, {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 380,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 mt-2", children: [
                  /* @__PURE__ */ jsxDEV(SportIcon, { sport: program.sport_type, size: "small" }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 384,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV(Badge, { variant: "outline", children: t(`sports.${program.sport_type}`) }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 385,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV(Badge, { className: "bg-blue-100 text-blue-700", children: t(`levels.${program.target_level}`) }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 388,
                    columnNumber: 33
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 383,
                  columnNumber: 31
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 379,
                columnNumber: 29
              }, this),
              !program.is_active && /* @__PURE__ */ jsxDEV(Badge, { variant: "outline", className: "text-gray-500", children: language === "ar" ? "غير متاح" : "Inactive" }, void 0, false, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 394,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 378,
              columnNumber: 27
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 377,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 text-sm", children: language === "ar" ? program.description_ar : program.description_en }, void 0, false, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 401,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-3", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "text-center p-3 bg-emerald-50 rounded-lg", children: [
                  /* @__PURE__ */ jsxDEV(Clock, { className: "w-5 h-5 text-emerald-600 mx-auto mb-1" }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 407,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500", children: language === "ar" ? "المدة" : "Duration" }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 408,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-emerald-700", children: [
                    program.duration_weeks,
                    " ",
                    language === "ar" ? "أسبوع" : "weeks"
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 411,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 406,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "text-center p-3 bg-amber-50 rounded-lg", children: [
                  /* @__PURE__ */ jsxDEV(Target, { className: "w-5 h-5 text-amber-600 mx-auto mb-1" }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 417,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500", children: language === "ar" ? "الجلسات" : "Sessions" }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 418,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-amber-700", children: [
                    program.sessions_per_week,
                    "/",
                    language === "ar" ? "أسبوع" : "week"
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 421,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 416,
                  columnNumber: 29
                }, this),
                program.price && /* @__PURE__ */ jsxDEV("div", { className: "text-center p-3 bg-blue-50 rounded-lg", children: [
                  /* @__PURE__ */ jsxDEV(Award, { className: "w-5 h-5 text-blue-600 mx-auto mb-1" }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 428,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500", children: language === "ar" ? "السعر" : "Price" }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 429,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-blue-700", children: [
                    program.price,
                    " ",
                    language === "ar" ? "ر.س" : "SAR"
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 432,
                    columnNumber: 33
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 427,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 405,
                columnNumber: 27
              }, this),
              program.modules && program.modules.length > 0 && /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-semibold text-gray-700 mb-2", children: language === "ar" ? "الوحدات التدريبية:" : "Training Modules:" }, void 0, false, {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 441,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
                  program.modules.slice(0, 3).map(
                    (module, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-2 text-sm", children: [
                      /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" }, void 0, false, {
                        fileName: "/app/src/pages/Profile.jsx?raw=",
                        lineNumber: 447,
                        columnNumber: 37
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-gray-600", children: [
                        /* @__PURE__ */ jsxDEV("span", { className: "font-medium", children: [
                          language === "ar" ? "الأسبوع" : "Week",
                          " ",
                          module.week,
                          ":"
                        ] }, void 0, true, {
                          fileName: "/app/src/pages/Profile.jsx?raw=",
                          lineNumber: 449,
                          columnNumber: 39
                        }, this),
                        " ",
                        language === "ar" ? module.title_ar : module.title_en
                      ] }, void 0, true, {
                        fileName: "/app/src/pages/Profile.jsx?raw=",
                        lineNumber: 448,
                        columnNumber: 37
                      }, this)
                    ] }, idx, true, {
                      fileName: "/app/src/pages/Profile.jsx?raw=",
                      lineNumber: 446,
                      columnNumber: 25
                    }, this)
                  ),
                  program.modules.length > 3 && /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500", children: language === "ar" ? `+${program.modules.length - 3} وحدات أخرى` : `+${program.modules.length - 3} more modules` }, void 0, false, {
                    fileName: "/app/src/pages/Profile.jsx?raw=",
                    lineNumber: 455,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Profile.jsx?raw=",
                  lineNumber: 444,
                  columnNumber: 31
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Profile.jsx?raw=",
                lineNumber: 440,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 400,
              columnNumber: 25
            }, this)
          ] }, program.id, true, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 376,
            columnNumber: 17
          }, this)
        ) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 374,
          columnNumber: 15
        }, this) : /* @__PURE__ */ jsxDEV(Card, { className: "shadow-sm border-0", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }, void 0, false, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 469,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: language === "ar" ? "لم تقم بإنشاء برامج تدريبية بعد" : "You haven't created any training programs yet" }, void 0, false, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 470,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 468,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 467,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 372,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/Profile.jsx?raw=",
        lineNumber: 206,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/Profile.jsx?raw=",
      lineNumber: 140,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/Profile.jsx?raw=",
      lineNumber: 139,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Dialog, { open: showDeleteDialog, onOpenChange: setShowDeleteDialog, children: /* @__PURE__ */ jsxDEV(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxDEV(DialogHeader, { children: /* @__PURE__ */ jsxDEV(DialogTitle, { className: "text-red-600 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDEV(Trash2, { className: "w-5 h-5" }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 487,
          columnNumber: 15
        }, this),
        language === "ar" ? "حذف الحساب" : "Delete Account"
      ] }, void 0, true, {
        fileName: "/app/src/pages/Profile.jsx?raw=",
        lineNumber: 486,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/Profile.jsx?raw=",
        lineNumber: 485,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 text-sm", children: language === "ar" ? "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بياناتك نهائياً." : "This action cannot be undone. All your data will be permanently deleted." }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 492,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV(Label, { className: "text-sm mb-1 block text-gray-700", children: language === "ar" ? 'اكتب "حذف" للتأكيد' : 'Type "DELETE" to confirm' }, void 0, false, {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 498,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            Input,
            {
              value: deleteConfirmText,
              onChange: (e) => setDeleteConfirmText(e.target.value),
              placeholder: language === "ar" ? "حذف" : "DELETE",
              className: "mt-1"
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/Profile.jsx?raw=",
              lineNumber: 501,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 497,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/Profile.jsx?raw=",
        lineNumber: 491,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxDEV(Button, { variant: "outline", onClick: () => {
          setShowDeleteDialog(false);
          setDeleteConfirmText("");
        }, children: language === "ar" ? "إلغاء" : "Cancel" }, void 0, false, {
          fileName: "/app/src/pages/Profile.jsx?raw=",
          lineNumber: 510,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            className: "bg-red-600 hover:bg-red-700 text-white",
            disabled: deleteConfirmText !== (language === "ar" ? "حذف" : "DELETE"),
            onClick: handleDeleteAccount,
            children: language === "ar" ? "حذف الحساب" : "Delete Account"
          },
          void 0,
          false,
          {
            fileName: "/app/src/pages/Profile.jsx?raw=",
            lineNumber: 513,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/src/pages/Profile.jsx?raw=",
        lineNumber: 509,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/Profile.jsx?raw=",
      lineNumber: 484,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/Profile.jsx?raw=",
      lineNumber: 483,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/Profile.jsx?raw=",
    lineNumber: 138,
    columnNumber: 5
  }, this);
}