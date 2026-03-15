function OnlineTraining() {
  _s();
  const { language, t } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedTrainer, setSelectedTrainer] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    sport_type: "boxing",
    category: "training",
    difficulty_level: "beginner",
    duration_minutes: 30,
    video_file: null,
    thumbnail_file: null
  });
  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    };
    loadUser();
  }, []);
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["onlineTrainingVideos"],
    queryFn: () => base44.entities.TrainingVideo.list("-created_date")
  });
  const { data: trainers = [] } = useQuery({
    queryKey: ["trainers"],
    queryFn: () => base44.entities.Trainer.list()
  });
  const sports = [
    { value: "boxing", label: language === "ar" ? "الملاكمة" : "Boxing" },
    { value: "karate", label: language === "ar" ? "الكاراتيه" : "Karate" },
    { value: "taekwondo", label: language === "ar" ? "التايكوندو" : "Taekwondo" },
    { value: "judo", label: language === "ar" ? "الجودو" : "Judo" },
    { value: "muay_thai", label: language === "ar" ? "المواي تاي" : "Muay Thai" },
    { value: "mma", label: language === "ar" ? "الفنون القتالية المختلطة" : "MMA" },
    { value: "wrestling", label: language === "ar" ? "المصارعة" : "Wrestling" },
    { value: "jiu_jitsu", label: language === "ar" ? "الجيو جيتسو" : "Jiu-Jitsu" },
    { value: "kickboxing", label: language === "ar" ? "الكيك بوكسينغ" : "Kickboxing" }
  ];
  const filteredVideos = videos.filter((video) => {
    const sportMatch = selectedSport === "all" || video.sport_type === selectedSport;
    const trainerMatch = selectedTrainer === "all" || trainers.find(
      (t2) => t2.specializations?.includes(video.sport_type) && t2.id === selectedTrainer
    );
    return sportMatch && trainerMatch;
  });
  const difficultyColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800"
  };
  const isTrainer = user?.user_type === "trainer" || user?.role === "admin";
  const saveVideoMutation = useMutation({
    mutationFn: async (data) => {
      let videoUrl = editingVideo?.video_url;
      let thumbnailUrl = editingVideo?.thumbnail_url;
      if (data.video_file) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: data.video_file });
        videoUrl = file_url;
      }
      if (data.thumbnail_file) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: data.thumbnail_file });
        thumbnailUrl = file_url;
      }
      const payload = {
        title_ar: data.title_ar,
        title_en: data.title_en,
        description_ar: data.description_ar,
        description_en: data.description_en,
        sport_type: data.sport_type,
        category: data.category,
        difficulty_level: data.difficulty_level,
        duration_minutes: data.duration_minutes,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl
      };
      if (editingVideo) {
        return base44.entities.TrainingVideo.update(editingVideo.id, payload);
      } else {
        return base44.entities.TrainingVideo.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onlineTrainingVideos"] });
      setDialogOpen(false);
      setEditingVideo(null);
      resetForm();
      toast.success(language === "ar" ? "تم حفظ الفيديو بنجاح" : "Video saved successfully");
    },
    onError: () => {
      toast.error(language === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving video");
    }
  });
  const deleteVideoMutation = useMutation({
    mutationFn: (videoId) => base44.entities.TrainingVideo.delete(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onlineTrainingVideos"] });
      toast.success(language === "ar" ? "تم حذف الفيديو بنجاح" : "Video deleted successfully");
    }
  });
  const resetForm = () => {
    setVideoForm({
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      sport_type: "boxing",
      category: "training",
      difficulty_level: "beginner",
      duration_minutes: 30,
      video_file: null,
      thumbnail_file: null
    });
  };
  const handleEdit = (video) => {
    setEditingVideo(video);
    setVideoForm({
      title_ar: video.title_ar || "",
      title_en: video.title_en || "",
      description_ar: video.description_ar || "",
      description_en: video.description_en || "",
      sport_type: video.sport_type || "boxing",
      category: video.category || "training",
      difficulty_level: video.difficulty_level || "beginner",
      duration_minutes: video.duration_minutes || 30,
      video_file: null,
      thumbnail_file: null
    });
    setDialogOpen(true);
  };
  const handleDelete = (video) => {
    if (confirm(language === "ar" ? "هل أنت متأكد من حذف هذا الفيديو؟" : "Are you sure you want to delete this video?")) {
      deleteVideoMutation.mutate(video.id);
    }
  };
  const handleSave = () => {
    if (!videoForm.title_ar || !videoForm.title_en) {
      toast.error(language === "ar" ? "الرجاء إدخال العنوان بالعربية والإنجليزية" : "Please enter title in both languages");
      return;
    }
    if (!editingVideo && !videoForm.video_file) {
      toast.error(language === "ar" ? "الرجاء اختيار ملف الفيديو" : "Please select video file");
      return;
    }
    saveVideoMutation.mutate(videoForm);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-r from-emerald-900 to-emerald-700 py-16", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "text-center",
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "inline-flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-full px-4 py-2 mb-6", children: [
            /* @__PURE__ */ jsxDEV(Monitor, { className: "w-5 h-5 text-amber-400" }, void 0, false, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 222,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-amber-200 text-sm font-medium", children: language === "ar" ? "تدرب من أي مكان" : "Train from Anywhere" }, void 0, false, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 223,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 221,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl md:text-5xl font-bold text-white mb-4", children: language === "ar" ? "التدريب الأونلاين مع أفضل المدربين" : "Online Training with Top Trainers" }, void 0, false, {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 228,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xl text-emerald-100 max-w-2xl mx-auto", children: language === "ar" ? "شاهد فيديوهات تدريبية احترافية وتعلم من أفضل المدربين في الفنون القتالية" : "Watch professional training videos and learn from the best martial arts trainers" }, void 0, false, {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 231,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
        lineNumber: 216,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
      lineNumber: 215,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
      lineNumber: 214,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 py-12", children: [
      /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "bg-white rounded-xl shadow-md p-6 mb-8",
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxDEV(Filter, { className: "w-5 h-5 text-emerald-600" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 248,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-bold text-gray-800", children: language === "ar" ? "تصفية النتائج" : "Filter Results" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 249,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 247,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-sm text-gray-600 mb-2 block", children: language === "ar" ? "الرياضة" : "Sport" }, void 0, false, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 256,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV(Select, { value: selectedSport, onValueChange: setSelectedSport, children: [
                  /* @__PURE__ */ jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDEV(SelectValue, {}, void 0, false, {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 261,
                    columnNumber: 19
                  }, this) }, void 0, false, {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 260,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV(SelectContent, { children: [
                    /* @__PURE__ */ jsxDEV(SelectItem, { value: "all", children: language === "ar" ? "جميع الرياضات" : "All Sports" }, void 0, false, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 264,
                      columnNumber: 19
                    }, this),
                    sports.map(
                      (sport) => /* @__PURE__ */ jsxDEV(SelectItem, { value: sport.value, children: sport.label }, sport.value, false, {
                        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                        lineNumber: 268,
                        columnNumber: 19
                      }, this)
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 263,
                    columnNumber: 17
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 259,
                  columnNumber: 15
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 255,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV("label", { className: "text-sm text-gray-600 mb-2 block", children: language === "ar" ? "المدرب" : "Trainer" }, void 0, false, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 277,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDEV(Select, { value: selectedTrainer, onValueChange: setSelectedTrainer, children: [
                  /* @__PURE__ */ jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDEV(SelectValue, {}, void 0, false, {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 282,
                    columnNumber: 19
                  }, this) }, void 0, false, {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 281,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV(SelectContent, { children: [
                    /* @__PURE__ */ jsxDEV(SelectItem, { value: "all", children: language === "ar" ? "جميع المدربين" : "All Trainers" }, void 0, false, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 285,
                      columnNumber: 19
                    }, this),
                    trainers.map(
                      (trainer) => /* @__PURE__ */ jsxDEV(SelectItem, { value: trainer.id, children: language === "ar" ? trainer.name_ar : trainer.name_en }, trainer.id, false, {
                        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                        lineNumber: 289,
                        columnNumber: 19
                      }, this)
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 284,
                    columnNumber: 17
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 280,
                  columnNumber: 15
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 276,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 254,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
          lineNumber: 242,
          columnNumber: 9
        },
        this
      ),
      isTrainer && /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end mb-6", children: /* @__PURE__ */ jsxDEV(
        Button,
        {
          onClick: () => {
            setEditingVideo(null);
            resetForm();
            setDialogOpen(true);
          },
          className: "bg-emerald-600 hover:bg-emerald-700",
          children: [
            /* @__PURE__ */ jsxDEV(Plus, { className: "w-4 h-4 me-2" }, void 0, false, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 310,
              columnNumber: 15
            }, this),
            language === "ar" ? "إضافة فيديو تدريبي" : "Add Training Video"
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
          lineNumber: 302,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
        lineNumber: 301,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-4 mb-8", children: [
        /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.1 },
            className: "bg-white rounded-xl shadow-md p-6 text-center",
            children: [
              /* @__PURE__ */ jsxDEV(Video, { className: "w-8 h-8 text-emerald-600 mx-auto mb-2" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 324,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-3xl font-bold text-gray-900", children: filteredVideos.length }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 325,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-600", children: language === "ar" ? "فيديو تدريبي" : "Training Videos" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 326,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 318,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.2 },
            className: "bg-white rounded-xl shadow-md p-6 text-center",
            children: [
              /* @__PURE__ */ jsxDEV(Users, { className: "w-8 h-8 text-amber-500 mx-auto mb-2" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 337,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-3xl font-bold text-gray-900", children: trainers.length }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 338,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-600", children: language === "ar" ? "مدرب محترف" : "Professional Trainers" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 339,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 331,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.3 },
            className: "bg-white rounded-xl shadow-md p-6 text-center",
            children: [
              /* @__PURE__ */ jsxDEV(Monitor, { className: "w-8 h-8 text-blue-600 mx-auto mb-2" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 350,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-3xl font-bold text-gray-900", children: "24/7" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 351,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-600", children: language === "ar" ? "متاح دائماً" : "Always Available" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 352,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 344,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
        lineNumber: 317,
        columnNumber: 9
      }, this),
      isLoading ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" }, void 0, false, {
          fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
          lineNumber: 361,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "mt-4 text-gray-600", children: t("loading") }, void 0, false, {
          fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
          lineNumber: 362,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
        lineNumber: 360,
        columnNumber: 9
      }, this) : filteredVideos.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-12", children: [
        /* @__PURE__ */ jsxDEV(Video, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }, void 0, false, {
          fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
          lineNumber: 366,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: language === "ar" ? "لا توجد فيديوهات متاحة" : "No videos available" }, void 0, false, {
          fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
          lineNumber: 367,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
        lineNumber: 365,
        columnNumber: 9
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredVideos.map(
        (video, index) => /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: index * 0.05 },
            children: /* @__PURE__ */ jsxDEV(Card, { className: "overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "relative aspect-video bg-gray-900 group cursor-pointer", children: [
                /* @__PURE__ */ jsxDEV(
                  "img",
                  {
                    src: video.thumbnail_url || "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600",
                    alt: language === "ar" ? video.title_ar : video.title_en,
                    className: "w-full h-full object-cover"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 382,
                    columnNumber: 21
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxDEV(Play, { className: "w-8 h-8 text-white ms-1" }, void 0, false, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 389,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 388,
                  columnNumber: 23
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 387,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "absolute top-3 left-3", children: /* @__PURE__ */ jsxDEV(SportIcon, { sport: video.sport_type, size: "small", showBg: true }, void 0, false, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 395,
                  columnNumber: 23
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 394,
                  columnNumber: 21
                }, this),
                video.duration_minutes && /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxDEV(Clock, { className: "w-3 h-3 text-white" }, void 0, false, {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 401,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-white font-medium", children: [
                    video.duration_minutes,
                    " ",
                    t("minutes")
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 402,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 400,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 381,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(CardContent, { className: "p-4", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-start justify-between gap-2 mb-3", children: /* @__PURE__ */ jsxDEV("h3", { className: "font-bold text-lg leading-tight line-clamp-2", children: language === "ar" ? video.title_ar : video.title_en }, void 0, false, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 411,
                  columnNumber: 23
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 410,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 line-clamp-2 mb-3", children: language === "ar" ? video.description_ar : video.description_en }, void 0, false, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 416,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 mb-3", children: [
                  video.difficulty_level && /* @__PURE__ */ jsxDEV(Badge, { className: difficultyColors[video.difficulty_level], children: language === "ar" ? video.difficulty_level === "beginner" ? "مبتدئ" : video.difficulty_level === "intermediate" ? "متوسط" : "متقدم" : video.difficulty_level }, void 0, false, {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 422,
                    columnNumber: 19
                  }, this),
                  video.category && /* @__PURE__ */ jsxDEV(Badge, { variant: "outline", children: language === "ar" ? video.category === "technique" ? "تقنية" : video.category === "training" ? "تدريب" : video.category === "match" ? "مباراة" : "درس" : video.category }, void 0, false, {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 431,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 420,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between text-xs text-gray-500 pt-3 border-t", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1", children: [
                      "👁️ ",
                      video.views_count || 0
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 443,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "flex items-center gap-1", children: [
                      "❤️ ",
                      video.likes_count || 0
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 446,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 442,
                    columnNumber: 23
                  }, this),
                  isTrainer && /* @__PURE__ */ jsxDEV("div", { className: "flex gap-1", children: [
                    /* @__PURE__ */ jsxDEV(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleEdit(video);
                        },
                        className: "h-7 w-7 p-0",
                        children: /* @__PURE__ */ jsxDEV(Edit, { className: "w-3 h-3" }, void 0, false, {
                          fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                          lineNumber: 462,
                          columnNumber: 29
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                        lineNumber: 453,
                        columnNumber: 27
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleDelete(video);
                        },
                        className: "h-7 w-7 p-0 text-red-600 hover:text-red-700",
                        children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-3 h-3" }, void 0, false, {
                          fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                          lineNumber: 473,
                          columnNumber: 29
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                        lineNumber: 464,
                        columnNumber: 27
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                    lineNumber: 452,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 441,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 409,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 380,
              columnNumber: 17
            }, this)
          },
          video.id,
          false,
          {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 374,
            columnNumber: 11
          },
          this
        )
      ) }, void 0, false, {
        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
        lineNumber: 372,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxDEV(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxDEV(DialogHeader, { children: /* @__PURE__ */ jsxDEV(DialogTitle, { children: editingVideo ? language === "ar" ? "تعديل الفيديو" : "Edit Video" : language === "ar" ? "إضافة فيديو جديد" : "Add New Video" }, void 0, false, {
          fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
          lineNumber: 489,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
          lineNumber: 488,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 mt-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "العنوان (عربي)" : "Title (Arabic)" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 499,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(
                Input,
                {
                  value: videoForm.title_ar,
                  onChange: (e) => setVideoForm({ ...videoForm, title_ar: e.target.value })
                },
                void 0,
                false,
                {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 500,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 498,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "العنوان (إنجليزي)" : "Title (English)" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 506,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(
                Input,
                {
                  value: videoForm.title_en,
                  onChange: (e) => setVideoForm({ ...videoForm, title_en: e.target.value })
                },
                void 0,
                false,
                {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 507,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 505,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 497,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الوصف (عربي)" : "Description (Arabic)" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 516,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(
                Textarea,
                {
                  value: videoForm.description_ar,
                  onChange: (e) => setVideoForm({ ...videoForm, description_ar: e.target.value }),
                  rows: 3
                },
                void 0,
                false,
                {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 517,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 515,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الوصف (إنجليزي)" : "Description (English)" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 524,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(
                Textarea,
                {
                  value: videoForm.description_en,
                  onChange: (e) => setVideoForm({ ...videoForm, description_en: e.target.value }),
                  rows: 3
                },
                void 0,
                false,
                {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 525,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 523,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 514,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الرياضة" : "Sport" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 535,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(
                Select,
                {
                  value: videoForm.sport_type,
                  onValueChange: (value) => setVideoForm({ ...videoForm, sport_type: value }),
                  children: [
                    /* @__PURE__ */ jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDEV(SelectValue, {}, void 0, false, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 541,
                      columnNumber: 23
                    }, this) }, void 0, false, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 540,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV(SelectContent, { children: sports.map(
                      (sport) => /* @__PURE__ */ jsxDEV(SelectItem, { value: sport.value, children: sport.label }, sport.value, false, {
                        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                        lineNumber: 545,
                        columnNumber: 23
                      }, this)
                    ) }, void 0, false, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 543,
                      columnNumber: 21
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 536,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 534,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الفئة" : "Category" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 554,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(
                Select,
                {
                  value: videoForm.category,
                  onValueChange: (value) => setVideoForm({ ...videoForm, category: value }),
                  children: [
                    /* @__PURE__ */ jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDEV(SelectValue, {}, void 0, false, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 560,
                      columnNumber: 23
                    }, this) }, void 0, false, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 559,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV(SelectContent, { children: [
                      /* @__PURE__ */ jsxDEV(SelectItem, { value: "technique", children: language === "ar" ? "تقنية" : "Technique" }, void 0, false, {
                        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                        lineNumber: 563,
                        columnNumber: 23
                      }, this),
                      /* @__PURE__ */ jsxDEV(SelectItem, { value: "training", children: language === "ar" ? "تدريب" : "Training" }, void 0, false, {
                        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                        lineNumber: 564,
                        columnNumber: 23
                      }, this),
                      /* @__PURE__ */ jsxDEV(SelectItem, { value: "match", children: language === "ar" ? "مباراة" : "Match" }, void 0, false, {
                        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                        lineNumber: 565,
                        columnNumber: 23
                      }, this),
                      /* @__PURE__ */ jsxDEV(SelectItem, { value: "tutorial", children: language === "ar" ? "درس" : "Tutorial" }, void 0, false, {
                        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                        lineNumber: 566,
                        columnNumber: 23
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 562,
                      columnNumber: 21
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 555,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 553,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "المستوى" : "Level" }, void 0, false, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 572,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(
                Select,
                {
                  value: videoForm.difficulty_level,
                  onValueChange: (value) => setVideoForm({ ...videoForm, difficulty_level: value }),
                  children: [
                    /* @__PURE__ */ jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDEV(SelectValue, {}, void 0, false, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 578,
                      columnNumber: 23
                    }, this) }, void 0, false, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 577,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDEV(SelectContent, { children: [
                      /* @__PURE__ */ jsxDEV(SelectItem, { value: "beginner", children: language === "ar" ? "مبتدئ" : "Beginner" }, void 0, false, {
                        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                        lineNumber: 581,
                        columnNumber: 23
                      }, this),
                      /* @__PURE__ */ jsxDEV(SelectItem, { value: "intermediate", children: language === "ar" ? "متوسط" : "Intermediate" }, void 0, false, {
                        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                        lineNumber: 582,
                        columnNumber: 23
                      }, this),
                      /* @__PURE__ */ jsxDEV(SelectItem, { value: "advanced", children: language === "ar" ? "متقدم" : "Advanced" }, void 0, false, {
                        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                        lineNumber: 583,
                        columnNumber: 23
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                      lineNumber: 580,
                      columnNumber: 21
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                  lineNumber: 573,
                  columnNumber: 19
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 571,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 533,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "المدة (بالدقائق)" : "Duration (minutes)" }, void 0, false, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 590,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                type: "number",
                value: videoForm.duration_minutes,
                onChange: (e) => setVideoForm({ ...videoForm, duration_minutes: parseInt(e.target.value) })
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 591,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 589,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: [
              language === "ar" ? "ملف الفيديو" : "Video File",
              editingVideo && /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-gray-500 ms-2", children: [
                "(",
                language === "ar" ? "اختياري - اترك فارغاً للإبقاء على الفيديو الحالي" : "Optional - leave empty to keep current",
                ")"
              ] }, void 0, true, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 601,
                columnNumber: 36
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 599,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                type: "file",
                accept: "video/*",
                onChange: (e) => setVideoForm({ ...videoForm, video_file: e.target.files[0] })
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 603,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 598,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: [
              language === "ar" ? "صورة مصغرة" : "Thumbnail Image",
              editingVideo && /* @__PURE__ */ jsxDEV("span", { className: "text-xs text-gray-500 ms-2", children: [
                "(",
                language === "ar" ? "اختياري" : "Optional",
                ")"
              ] }, void 0, true, {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 613,
                columnNumber: 36
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
              lineNumber: 611,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                type: "file",
                accept: "image/*",
                onChange: (e) => setVideoForm({ ...videoForm, thumbnail_file: e.target.files[0] })
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 615,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 610,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3 pt-4", children: [
            /* @__PURE__ */ jsxDEV(
              Button,
              {
                onClick: handleSave,
                disabled: saveVideoMutation.isPending,
                className: "flex-1 bg-emerald-600 hover:bg-emerald-700",
                children: saveVideoMutation.isPending ? language === "ar" ? "جاري الحفظ..." : "Saving..." : language === "ar" ? "حفظ" : "Save"
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 623,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button,
              {
                variant: "outline",
                onClick: () => {
                  setDialogOpen(false);
                  setEditingVideo(null);
                  resetForm();
                },
                disabled: saveVideoMutation.isPending,
                children: language === "ar" ? "إلغاء" : "Cancel"
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
                lineNumber: 632,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
            lineNumber: 622,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
          lineNumber: 496,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
        lineNumber: 487,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
        lineNumber: 486,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
      lineNumber: 240,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/OnlineTraining.jsx?raw=",
    lineNumber: 212,
    columnNumber: 5
  }, this);
}