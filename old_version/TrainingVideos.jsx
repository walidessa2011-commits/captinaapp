function TrainingVideos() {
  _s();
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["training-videos"],
    queryFn: () => base44.entities.TrainingVideo.list("-created_date", 50)
  });
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = search === "" || video.title_ar?.toLowerCase().includes(search.toLowerCase()) || video.title_en?.toLowerCase().includes(search.toLowerCase());
    const matchesSport = sportFilter === "all" || video.sport_type === sportFilter;
    const matchesLevel = levelFilter === "all" || video.difficulty_level === levelFilter;
    return matchesSearch && matchesSport && matchesLevel;
  });
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen pt-24 pb-16", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-emerald-900 to-emerald-800 py-16 mb-8", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 text-center", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxDEV(Play, { className: "w-8 h-8 text-emerald-950" }, void 0, false, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 68,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 67,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: t("trainingVideos") }, void 0, false, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 70,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-emerald-200/80 max-w-2xl mx-auto", children: language === "ar" ? "اكتشف مكتبتنا الواسعة من فيديوهات التدريب المحترفة لجميع أنواع الفنون القتالية" : "Discover our extensive library of professional training videos for all martial arts" }, void 0, false, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 73,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
        lineNumber: 63,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
      lineNumber: 62,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
      lineNumber: 61,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxDEV(Search, { className: "absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }, void 0, false, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 88,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            Input,
            {
              placeholder: language === "ar" ? "ابحث عن فيديو..." : "Search videos...",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "ps-10"
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
              lineNumber: 89,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
          lineNumber: 87,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Select, { value: sportFilter, onValueChange: setSportFilter, children: [
          /* @__PURE__ */ jsxDEV(SelectTrigger, { className: "w-full md:w-48", children: /* @__PURE__ */ jsxDEV(SelectValue, { placeholder: t("selectSport") }, void 0, false, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 100,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 99,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(SelectContent, { children: sports.map(
            (sport) => /* @__PURE__ */ jsxDEV(SelectItem, { value: sport, children: sport === "all" ? language === "ar" ? "جميع الرياضات" : "All Sports" : t(`sports.${sport}`) }, sport, false, {
              fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
              lineNumber: 104,
              columnNumber: 17
            }, this)
          ) }, void 0, false, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 102,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
          lineNumber: 98,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(Select, { value: levelFilter, onValueChange: setLevelFilter, children: [
          /* @__PURE__ */ jsxDEV(SelectTrigger, { className: "w-full md:w-48", children: /* @__PURE__ */ jsxDEV(SelectValue, { placeholder: language === "ar" ? "المستوى" : "Level" }, void 0, false, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 116,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 115,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(SelectContent, { children: levels.map(
            (level) => /* @__PURE__ */ jsxDEV(SelectItem, { value: level, children: level === "all" ? language === "ar" ? "جميع المستويات" : "All Levels" : t(`levels.${level}`) }, level, false, {
              fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
              lineNumber: 120,
              columnNumber: 17
            }, this)
          ) }, void 0, false, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 118,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
          lineNumber: 114,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
        lineNumber: 85,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
        lineNumber: 84,
        columnNumber: 9
      }, this),
      isLoading ? /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map(
        (_, i) => /* @__PURE__ */ jsxDEV("div", { className: "bg-white rounded-2xl overflow-hidden", children: [
          /* @__PURE__ */ jsxDEV(Skeleton, { className: "aspect-video" }, void 0, false, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 136,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "p-4 space-y-3", children: [
            /* @__PURE__ */ jsxDEV(Skeleton, { className: "h-5 w-3/4" }, void 0, false, {
              fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
              lineNumber: 138,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(Skeleton, { className: "h-4 w-full" }, void 0, false, {
              fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
              lineNumber: 139,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(Skeleton, { className: "h-4 w-1/2" }, void 0, false, {
              fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
              lineNumber: 140,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 137,
            columnNumber: 17
          }, this)
        ] }, i, true, {
          fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
          lineNumber: 135,
          columnNumber: 11
        }, this)
      ) }, void 0, false, {
        fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
        lineNumber: 133,
        columnNumber: 9
      }, this) : filteredVideos.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredVideos.map(
        (video) => /* @__PURE__ */ jsxDEV(
          VideoCard,
          {
            video,
            type: "training",
            onClick: () => setSelectedVideo(video)
          },
          video.id,
          false,
          {
            fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
            lineNumber: 148,
            columnNumber: 11
          },
          this
        )
      ) }, void 0, false, {
        fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
        lineNumber: 146,
        columnNumber: 9
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxDEV(Play, { className: "w-10 h-10 text-gray-400" }, void 0, false, {
          fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
          lineNumber: 159,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
          lineNumber: 158,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-semibold text-gray-700 mb-2", children: language === "ar" ? "لا توجد فيديوهات" : "No videos found" }, void 0, false, {
          fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
          lineNumber: 161,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: language === "ar" ? "جرب تغيير معايير البحث" : "Try adjusting your filters" }, void 0, false, {
          fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
          lineNumber: 164,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
        lineNumber: 157,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
      lineNumber: 82,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      VideoPlayer,
      {
        video: selectedVideo,
        open: !!selectedVideo,
        onClose: () => setSelectedVideo(null),
        type: "training"
      },
      void 0,
      false,
      {
        fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
        lineNumber: 172,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/src/pages/TrainingVideos.jsx?raw=",
    lineNumber: 59,
    columnNumber: 5
  }, this);
}