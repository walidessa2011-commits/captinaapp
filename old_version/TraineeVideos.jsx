function TraineeVideos() {
  _s();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
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
    queryKey: ["trainee-videos"],
    queryFn: () => base44.entities.TraineeVideo.filter({ status: "approved" }, "-created_date", 50)
  });
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = search === "" || video.title?.toLowerCase().includes(search.toLowerCase()) || video.trainee_name?.toLowerCase().includes(search.toLowerCase());
    const matchesSport = sportFilter === "all" || video.sport_type === sportFilter;
    return matchesSearch && matchesSport;
  });
  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["trainee-videos"] });
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen pt-24 pb-16", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-purple-900 to-purple-800 py-16 mb-8", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 text-center", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxDEV(Users, { className: "w-8 h-8 text-purple-950" }, void 0, false, {
            fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
            lineNumber: 83,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
            lineNumber: 82,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: t("traineeVideos") }, void 0, false, {
            fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
            lineNumber: 85,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-purple-200/80 max-w-2xl mx-auto mb-6", children: language === "ar" ? "شاهد إنجازات متدربينا المميزين وشارك فيديوهاتك الخاصة" : "Watch our outstanding trainees achievements and share your own videos" }, void 0, false, {
            fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
            lineNumber: 88,
            columnNumber: 13
          }, this),
          user && /* @__PURE__ */ jsxDEV(
            Button,
            {
              onClick: () => setShowUploadForm(true),
              className: "bg-amber-500 hover:bg-amber-600 text-purple-950",
              children: [
                /* @__PURE__ */ jsxDEV(Plus, { className: "w-5 h-5 me-2" }, void 0, false, {
                  fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
                  lineNumber: 99,
                  columnNumber: 17
                }, this),
                t("uploadVideo")
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
              lineNumber: 95,
              columnNumber: 13
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
        lineNumber: 78,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
      lineNumber: 77,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
      lineNumber: 76,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxDEV(Search, { className: "absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }, void 0, false, {
            fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
            lineNumber: 113,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            Input,
            {
              placeholder: language === "ar" ? "ابحث عن متدرب أو فيديو..." : "Search trainee or video...",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "ps-10"
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
              lineNumber: 114,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
          lineNumber: 112,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Select, { value: sportFilter, onValueChange: setSportFilter, children: [
          /* @__PURE__ */ jsxDEV(SelectTrigger, { className: "w-full md:w-48", children: /* @__PURE__ */ jsxDEV(SelectValue, { placeholder: t("selectSport") }, void 0, false, {
            fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
            lineNumber: 125,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
            lineNumber: 124,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(SelectContent, { children: sports.map(
            (sport) => /* @__PURE__ */ jsxDEV(SelectItem, { value: sport, children: sport === "all" ? language === "ar" ? "جميع الرياضات" : "All Sports" : t(`sports.${sport}`) }, sport, false, {
              fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
              lineNumber: 129,
              columnNumber: 17
            }, this)
          ) }, void 0, false, {
            fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
            lineNumber: 127,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
          lineNumber: 123,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
        lineNumber: 110,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
        lineNumber: 109,
        columnNumber: 9
      }, this),
      isLoading ? /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map(
        (_, i) => /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl overflow-hidden", children: [
          /* @__PURE__ */ jsxDEV(Skeleton, { className: "aspect-video" }, void 0, false, {
            fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
            lineNumber: 145,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 space-y-3", children: [
            /* @__PURE__ */ jsxDEV(Skeleton, { className: "h-5 w-3/4" }, void 0, false, {
              fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
              lineNumber: 147,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(Skeleton, { className: "h-4 w-full" }, void 0, false, {
              fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
              lineNumber: 148,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(Skeleton, { className: "h-4 w-1/2" }, void 0, false, {
              fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
              lineNumber: 149,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
            lineNumber: 146,
            columnNumber: 17
          }, this)
        ] }, i, true, {
          fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
          lineNumber: 144,
          columnNumber: 11
        }, this)
      ) }, void 0, false, {
        fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
        lineNumber: 142,
        columnNumber: 9
      }, this) : filteredVideos.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredVideos.map(
        (video) => /* @__PURE__ */ jsxDEV(
          VideoCard,
          {
            video,
            type: "trainee",
            onClick: () => setSelectedVideo(video)
          },
          video.id,
          false,
          {
            fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
            lineNumber: 157,
            columnNumber: 11
          },
          this
        )
      ) }, void 0, false, {
        fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
        lineNumber: 155,
        columnNumber: 9
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxDEV(Users, { className: "w-10 h-10 text-gray-400" }, void 0, false, {
          fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
          lineNumber: 168,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
          lineNumber: 167,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-semibold text-gray-700 mb-2", children: language === "ar" ? "لا توجد فيديوهات" : "No videos found" }, void 0, false, {
          fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
          lineNumber: 170,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 mb-4", children: language === "ar" ? "كن أول من يشارك فيديو!" : "Be the first to share a video!" }, void 0, false, {
          fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
          lineNumber: 173,
          columnNumber: 13
        }, this),
        user && /* @__PURE__ */ jsxDEV(
          Button,
          {
            onClick: () => setShowUploadForm(true),
            className: "bg-emerald-600 hover:bg-emerald-700",
            children: [
              /* @__PURE__ */ jsxDEV(Plus, { className: "w-5 h-5 me-2" }, void 0, false, {
                fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
                lineNumber: 181,
                columnNumber: 17
              }, this),
              t("uploadVideo")
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
            lineNumber: 177,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
        lineNumber: 166,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
      lineNumber: 107,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      VideoPlayer,
      {
        video: selectedVideo,
        open: !!selectedVideo,
        onClose: () => setSelectedVideo(null),
        type: "trainee"
      },
      void 0,
      false,
      {
        fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
        lineNumber: 190,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      VideoUploadForm,
      {
        open: showUploadForm,
        onClose: () => setShowUploadForm(false),
        user,
        onSuccess: handleUploadSuccess
      },
      void 0,
      false,
      {
        fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
        lineNumber: 198,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/src/pages/TraineeVideos.jsx?raw=",
    lineNumber: 74,
    columnNumber: 5
  }, this);
}