function TrainerProfile() {
  _s();
  const { t, language } = useLanguage();
  const urlParams = new URLSearchParams(window.location.search);
  const trainerId = urlParams.get("id");
  const { data: trainer, isLoading } = useQuery({
    queryKey: ["trainer", trainerId],
    queryFn: async () => {
      const allTrainers = await base44.entities.Trainer.list();
      return allTrainers.find((t2) => t2.id === trainerId);
    },
    enabled: !!trainerId
  });
  const { data: programs = [] } = useQuery({
    queryKey: ["trainer-programs", trainer?.email],
    queryFn: () => base44.entities.TrainingProgram.filter({ created_by: trainer?.email }),
    enabled: !!trainer?.email
  });
  const { data: videos = [] } = useQuery({
    queryKey: ["trainer-videos", trainer?.specializations],
    queryFn: async () => {
      if (!trainer?.specializations?.length) return [];
      const allVideos = await base44.entities.TrainingVideo.list();
      return allVideos.filter((v) => trainer.specializations.includes(v.sport_type));
    },
    enabled: !!trainer?.specializations?.length
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: t("loading") }, void 0, false, {
      fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
      lineNumber: 71,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
      lineNumber: 70,
      columnNumber: 7
    }, this);
  }
  if (!trainer) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: language === "ar" ? "المدرب غير موجود" : "Trainer not found" }, void 0, false, {
      fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
      lineNumber: 79,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
      lineNumber: 78,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-emerald-900 to-emerald-700 py-20", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "flex flex-col md:flex-row items-center gap-8",
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-40 h-40 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl overflow-hidden", children: trainer.photo_url ? /* @__PURE__ */ jsxDEV("img", { src: trainer.photo_url, alt: trainer.name_ar, className: "w-full h-full object-cover" }, void 0, false, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 97,
            columnNumber: 15
          }, this) : /* @__PURE__ */ jsxDEV(User, { className: "w-20 h-20 text-white" }, void 0, false, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 99,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 95,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex-1 text-center md:text-start", children: [
            /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl md:text-5xl font-bold text-white mb-3", children: language === "ar" ? trainer.name_ar : trainer.name_en }, void 0, false, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 105,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("p", { className: "text-xl text-emerald-100 mb-4", children: language === "ar" ? trainer.bio_ar : trainer.bio_en }, void 0, false, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 108,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 justify-center md:justify-start mb-6", children: trainer.specializations?.map(
              (sport) => /* @__PURE__ */ jsxDEV(Badge, { className: "bg-amber-500 text-emerald-950 px-3 py-1", children: t(`sports.${sport}`) }, sport, false, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 115,
                columnNumber: 17
              }, this)
            ) }, void 0, false, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 113,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-4 justify-center md:justify-start text-emerald-100", children: [
              trainer.experience_years && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxDEV(Award, { className: "w-5 h-5 text-amber-400" }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 125,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: [
                  trainer.experience_years,
                  " ",
                  language === "ar" ? "سنوات خبرة" : "years experience"
                ] }, void 0, true, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 126,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 124,
                columnNumber: 17
              }, this),
              trainer.email && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxDEV(Mail, { className: "w-5 h-5 text-amber-400" }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 131,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: trainer.email }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 132,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 130,
                columnNumber: 17
              }, this),
              trainer.phone && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxDEV(Phone, { className: "w-5 h-5 text-amber-400" }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 137,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("span", { children: trainer.phone }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 138,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 136,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 122,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "mt-6", children: /* @__PURE__ */ jsxDEV(Link, { to: createPageUrl("BookSession"), children: /* @__PURE__ */ jsxDEV(Button, { size: "lg", className: "bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold", children: [
              language === "ar" ? "احجز جلسة تدريبية" : "Book Training Session",
              /* @__PURE__ */ jsxDEV(Calendar, { className: "w-5 h-5 ms-2" }, void 0, false, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 148,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 146,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 145,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 144,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 104,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
        lineNumber: 89,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
      lineNumber: 88,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
      lineNumber: 87,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxDEV(Tabs, { defaultValue: "about", className: "space-y-8", children: [
      /* @__PURE__ */ jsxDEV(TabsList, { className: "grid w-full grid-cols-3 max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsxDEV(TabsTrigger, { value: "about", children: language === "ar" ? "نبذة" : "About" }, void 0, false, {
          fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
          lineNumber: 161,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(TabsTrigger, { value: "programs", children: [
          language === "ar" ? "البرامج" : "Programs",
          " (",
          programs.length,
          ")"
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
          lineNumber: 164,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(TabsTrigger, { value: "videos", children: [
          language === "ar" ? "الفيديوهات" : "Videos",
          " (",
          videos.length,
          ")"
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
          lineNumber: 167,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
        lineNumber: 160,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(TabsContent, { value: "about", children: /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-8", children: [
        trainer.certifications && /* @__PURE__ */ jsxDEV(Card, { children: [
          /* @__PURE__ */ jsxDEV(CardHeader, { children: /* @__PURE__ */ jsxDEV(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(Star, { className: "w-5 h-5 text-amber-500" }, void 0, false, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 180,
              columnNumber: 23
            }, this),
            language === "ar" ? "الشهادات والإنجازات" : "Certifications & Achievements"
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 179,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 178,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(CardContent, { children: /* @__PURE__ */ jsxDEV("p", { className: "text-gray-700 leading-relaxed whitespace-pre-line", children: trainer.certifications }, void 0, false, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 185,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 184,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
          lineNumber: 177,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(Card, { children: [
          /* @__PURE__ */ jsxDEV(CardHeader, { children: /* @__PURE__ */ jsxDEV(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDEV(Dumbbell, { className: "w-5 h-5 text-emerald-600" }, void 0, false, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 196,
              columnNumber: 21
            }, this),
            language === "ar" ? "التخصصات" : "Specializations"
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 195,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 194,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV(CardContent, { children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: trainer.specializations?.map(
            (sport) => /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 p-3 bg-gray-50 rounded-lg", children: [
              /* @__PURE__ */ jsxDEV(SportIcon, { sport, size: "small" }, void 0, false, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 204,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-medium text-gray-700", children: t(`sports.${sport}`) }, void 0, false, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 205,
                columnNumber: 25
              }, this)
            ] }, sport, true, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 203,
              columnNumber: 21
            }, this)
          ) }, void 0, false, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 201,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 200,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
          lineNumber: 193,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
        lineNumber: 174,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
        lineNumber: 173,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(TabsContent, { value: "programs", children: programs.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6", children: programs.map(
        (program) => /* @__PURE__ */ jsxDEV(Card, { className: "shadow-sm hover:shadow-lg transition-shadow", children: [
          /* @__PURE__ */ jsxDEV(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxDEV(CardTitle, { className: "text-xl mb-2", children: language === "ar" ? program.name_ar : program.name_en }, void 0, false, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 225,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxDEV(SportIcon, { sport: program.sport_type, size: "small" }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 229,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV(Badge, { variant: "outline", children: t(`sports.${program.sport_type}`) }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 230,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV(Badge, { className: "bg-blue-100 text-blue-700", children: t(`levels.${program.target_level}`) }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 233,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 228,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 224,
              columnNumber: 25
            }, this),
            program.is_active && /* @__PURE__ */ jsxDEV(Badge, { className: "bg-green-100 text-green-700", children: language === "ar" ? "متاح" : "Available" }, void 0, false, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 239,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 223,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 222,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 text-sm", children: language === "ar" ? program.description_ar : program.description_en }, void 0, false, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 246,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "text-center p-3 bg-emerald-50 rounded-lg", children: [
                /* @__PURE__ */ jsxDEV(Clock, { className: "w-5 h-5 text-emerald-600 mx-auto mb-1" }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 252,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500", children: language === "ar" ? "المدة" : "Duration" }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 253,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-emerald-700", children: [
                  program.duration_weeks,
                  " ",
                  language === "ar" ? "أسبوع" : "weeks"
                ] }, void 0, true, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 256,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 251,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-center p-3 bg-amber-50 rounded-lg", children: [
                /* @__PURE__ */ jsxDEV(Target, { className: "w-5 h-5 text-amber-600 mx-auto mb-1" }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 262,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500", children: language === "ar" ? "الجلسات" : "Sessions" }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 263,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-amber-700", children: [
                  program.sessions_per_week,
                  "/",
                  language === "ar" ? "أسبوع" : "week"
                ] }, void 0, true, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 266,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 261,
                columnNumber: 25
              }, this),
              program.price && /* @__PURE__ */ jsxDEV("div", { className: "text-center p-3 bg-blue-50 rounded-lg", children: [
                /* @__PURE__ */ jsxDEV(Award, { className: "w-5 h-5 text-blue-600 mx-auto mb-1" }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 273,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500", children: language === "ar" ? "السعر" : "Price" }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 274,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-blue-700", children: [
                  program.price,
                  " ",
                  language === "ar" ? "ر.س" : "SAR"
                ] }, void 0, true, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 277,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 272,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 250,
              columnNumber: 23
            }, this),
            program.modules && program.modules.length > 0 && /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("p", { className: "text-sm font-semibold text-gray-700 mb-2", children: language === "ar" ? "الوحدات التدريبية:" : "Training Modules:" }, void 0, false, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 286,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
                program.modules.slice(0, 3).map(
                  (module, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-2 text-sm", children: [
                    /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" }, void 0, false, {
                      fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                      lineNumber: 292,
                      columnNumber: 33
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-gray-600", children: [
                      /* @__PURE__ */ jsxDEV("span", { className: "font-medium", children: [
                        language === "ar" ? "الأسبوع" : "Week",
                        " ",
                        module.week,
                        ":"
                      ] }, void 0, true, {
                        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                        lineNumber: 294,
                        columnNumber: 35
                      }, this),
                      " ",
                      language === "ar" ? module.title_ar : module.title_en
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                      lineNumber: 293,
                      columnNumber: 33
                    }, this)
                  ] }, idx, true, {
                    fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                    lineNumber: 291,
                    columnNumber: 23
                  }, this)
                ),
                program.modules.length > 3 && /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500", children: language === "ar" ? `+${program.modules.length - 3} وحدات أخرى` : `+${program.modules.length - 3} more modules` }, void 0, false, {
                  fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                  lineNumber: 300,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 289,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 285,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(Link, { to: createPageUrl("BookSession"), children: /* @__PURE__ */ jsxDEV(Button, { className: "w-full bg-emerald-600 hover:bg-emerald-700", children: [
              language === "ar" ? "احجز هذا البرنامج" : "Book This Program",
              /* @__PURE__ */ jsxDEV(ArrowRight, { className: "w-4 h-4 ms-2" }, void 0, false, {
                fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
                lineNumber: 311,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 309,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
              lineNumber: 308,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
            lineNumber: 245,
            columnNumber: 21
          }, this)
        ] }, program.id, true, {
          fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
          lineNumber: 221,
          columnNumber: 15
        }, this)
      ) }, void 0, false, {
        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
        lineNumber: 219,
        columnNumber: 13
      }, this) : /* @__PURE__ */ jsxDEV(Card, { children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }, void 0, false, {
          fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
          lineNumber: 321,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: language === "ar" ? "لا توجد برامج تدريبية حالياً" : "No training programs available" }, void 0, false, {
          fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
          lineNumber: 322,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
        lineNumber: 320,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
        lineNumber: 319,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
        lineNumber: 217,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(TabsContent, { value: "videos", children: videos.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-3 gap-6", children: videos.slice(0, 6).map(
        (video) => /* @__PURE__ */ jsxDEV(VideoCard, { video }, video.id, false, {
          fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
          lineNumber: 335,
          columnNumber: 15
        }, this)
      ) }, void 0, false, {
        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
        lineNumber: 333,
        columnNumber: 13
      }, this) : /* @__PURE__ */ jsxDEV(Card, { children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsxDEV(BookOpen, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }, void 0, false, {
          fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
          lineNumber: 341,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: language === "ar" ? "لا توجد فيديوهات حالياً" : "No videos available" }, void 0, false, {
          fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
          lineNumber: 342,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
        lineNumber: 340,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
        lineNumber: 339,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
        lineNumber: 331,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
      lineNumber: 159,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
      lineNumber: 158,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/TrainerProfile.jsx?raw=",
    lineNumber: 85,
    columnNumber: 5
  }, this);
}