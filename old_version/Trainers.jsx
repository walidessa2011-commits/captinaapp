function Trainers() {
  _s();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    bio_ar: "",
    bio_en: "",
    photo_url: "",
    specializations: [],
    experience_years: 0,
    certifications: "",
    email: "",
    phone: ""
  });
  React.useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    };
    loadUser();
  }, []);
  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ["trainers"],
    queryFn: () => base44.entities.Trainer.list("-created_date")
  });
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Trainer.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainers"] });
      setEditDialogOpen(false);
      resetForm();
      toast.success(language === "ar" ? "تم إضافة المدرب بنجاح" : "Trainer added successfully");
    }
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Trainer.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainers"] });
      setEditDialogOpen(false);
      setEditingTrainer(null);
      resetForm();
      toast.success(language === "ar" ? "تم تحديث المدرب بنجاح" : "Trainer updated successfully");
    }
  });
  const resetForm = () => {
    setFormData({
      name_ar: "",
      name_en: "",
      bio_ar: "",
      bio_en: "",
      photo_url: "",
      specializations: [],
      experience_years: 0,
      certifications: "",
      email: "",
      phone: ""
    });
  };
  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name_ar: trainer.name_ar || "",
      name_en: trainer.name_en || "",
      bio_ar: trainer.bio_ar || "",
      bio_en: trainer.bio_en || "",
      photo_url: trainer.photo_url || "",
      specializations: trainer.specializations || [],
      experience_years: trainer.experience_years || 0,
      certifications: trainer.certifications || "",
      email: trainer.email || "",
      phone: trainer.phone || ""
    });
    setEditDialogOpen(true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTrainer) {
      updateMutation.mutate({ id: editingTrainer.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };
  const isTrainer = user?.user_type === "trainer" || user?.role === "admin";
  const sportsOptions = ["boxing", "karate", "taekwondo", "judo", "muay_thai", "mma", "wrestling", "jiu_jitsu", "kickboxing"];
  const toggleSpecialization = (sport) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(sport) ? prev.specializations.filter((s) => s !== sport) : [...prev.specializations, sport]
    }));
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-emerald-900 to-emerald-700 py-20", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "text-center",
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-6 shadow-xl", children: /* @__PURE__ */ jsxDEV(Users, { className: "w-10 h-10 text-white" }, void 0, false, {
            fileName: "/app/src/pages/Trainers.jsx?raw=",
            lineNumber: 161,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/Trainers.jsx?raw=",
            lineNumber: 160,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl md:text-5xl font-bold text-white mb-4", children: language === "ar" ? "مدربونا المحترفون" : "Our Professional Trainers" }, void 0, false, {
            fileName: "/app/src/pages/Trainers.jsx?raw=",
            lineNumber: 163,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xl text-emerald-100 max-w-2xl mx-auto", children: language === "ar" ? "نخبة من أفضل المدربين المحترفين في الفنون القتالية بالمملكة" : "Elite professional martial arts trainers in the Kingdom" }, void 0, false, {
            fileName: "/app/src/pages/Trainers.jsx?raw=",
            lineNumber: 166,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/pages/Trainers.jsx?raw=",
        lineNumber: 155,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/pages/Trainers.jsx?raw=",
      lineNumber: 154,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/Trainers.jsx?raw=",
      lineNumber: 153,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 py-12", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-8", children: [
        /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900", children: [
          language === "ar" ? "جميع المدربين" : "All Trainers",
          " (",
          trainers.length,
          ")"
        ] }, void 0, true, {
          fileName: "/app/src/pages/Trainers.jsx?raw=",
          lineNumber: 178,
          columnNumber: 11
        }, this),
        isTrainer && /* @__PURE__ */ jsxDEV(Dialog, { open: editDialogOpen, onOpenChange: setEditDialogOpen, children: [
          /* @__PURE__ */ jsxDEV(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxDEV(Button, { className: "bg-emerald-600 hover:bg-emerald-700", onClick: () => {
            resetForm();
            setEditingTrainer(null);
          }, children: [
            /* @__PURE__ */ jsxDEV(Plus, { className: "w-4 h-4 me-2" }, void 0, false, {
              fileName: "/app/src/pages/Trainers.jsx?raw=",
              lineNumber: 185,
              columnNumber: 19
            }, this),
            language === "ar" ? "إضافة مدرب" : "Add Trainer"
          ] }, void 0, true, {
            fileName: "/app/src/pages/Trainers.jsx?raw=",
            lineNumber: 184,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/Trainers.jsx?raw=",
            lineNumber: 183,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
            /* @__PURE__ */ jsxDEV(DialogHeader, { children: /* @__PURE__ */ jsxDEV(DialogTitle, { children: editingTrainer ? language === "ar" ? "تعديل بيانات المدرب" : "Edit Trainer" : language === "ar" ? "إضافة مدرب جديد" : "Add New Trainer" }, void 0, false, {
              fileName: "/app/src/pages/Trainers.jsx?raw=",
              lineNumber: 191,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/Trainers.jsx?raw=",
              lineNumber: 190,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-4 mt-4", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الاسم (عربي)" : "Name (Arabic)" }, void 0, false, {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 200,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Input,
                    {
                      value: formData.name_ar,
                      onChange: (e) => setFormData({ ...formData, name_ar: e.target.value }),
                      required: true
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/Trainers.jsx?raw=",
                      lineNumber: 201,
                      columnNumber: 23
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 199,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الاسم (إنجليزي)" : "Name (English)" }, void 0, false, {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 208,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Input,
                    {
                      value: formData.name_en,
                      onChange: (e) => setFormData({ ...formData, name_en: e.target.value }),
                      required: true
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/Trainers.jsx?raw=",
                      lineNumber: 209,
                      columnNumber: 23
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 207,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 198,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "النبذة (عربي)" : "Bio (Arabic)" }, void 0, false, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 218,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Textarea,
                  {
                    value: formData.bio_ar,
                    onChange: (e) => setFormData({ ...formData, bio_ar: e.target.value }),
                    rows: 3
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 219,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 217,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "النبذة (إنجليزي)" : "Bio (English)" }, void 0, false, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 227,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Textarea,
                  {
                    value: formData.bio_en,
                    onChange: (e) => setFormData({ ...formData, bio_en: e.target.value }),
                    rows: 3
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 228,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 226,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "رابط الصورة" : "Photo URL" }, void 0, false, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 236,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Input,
                  {
                    value: formData.photo_url,
                    onChange: (e) => setFormData({ ...formData, photo_url: e.target.value }),
                    placeholder: "https://..."
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 237,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 235,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "التخصصات" : "Specializations" }, void 0, false, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 245,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-2 mt-2", children: sportsOptions.map(
                  (sport) => /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      type: "button",
                      onClick: () => toggleSpecialization(sport),
                      className: `p-2 rounded-lg border-2 transition-all ${formData.specializations.includes(sport) ? "border-emerald-600 bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`,
                      children: [
                        /* @__PURE__ */ jsxDEV(SportIcon, { sport, size: "small" }, void 0, false, {
                          fileName: "/app/src/pages/Trainers.jsx?raw=",
                          lineNumber: 258,
                          columnNumber: 27
                        }, this),
                        /* @__PURE__ */ jsxDEV("span", { className: "text-xs mt-1 block", children: t(`sports.${sport}`) }, void 0, false, {
                          fileName: "/app/src/pages/Trainers.jsx?raw=",
                          lineNumber: 259,
                          columnNumber: 27
                        }, this)
                      ]
                    },
                    sport,
                    true,
                    {
                      fileName: "/app/src/pages/Trainers.jsx?raw=",
                      lineNumber: 248,
                      columnNumber: 21
                    },
                    this
                  )
                ) }, void 0, false, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 246,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 244,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "سنوات الخبرة" : "Experience Years" }, void 0, false, {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 267,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Input,
                    {
                      type: "number",
                      value: formData.experience_years,
                      onChange: (e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/Trainers.jsx?raw=",
                      lineNumber: 268,
                      columnNumber: 23
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 266,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "البريد الإلكتروني" : "Email" }, void 0, false, {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 275,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Input,
                    {
                      type: "email",
                      value: formData.email,
                      onChange: (e) => setFormData({ ...formData, email: e.target.value })
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/Trainers.jsx?raw=",
                      lineNumber: 276,
                      columnNumber: 23
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 274,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 265,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "رقم الهاتف" : "Phone" }, void 0, false, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 285,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Input,
                  {
                    value: formData.phone,
                    onChange: (e) => setFormData({ ...formData, phone: e.target.value })
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 286,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 284,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الشهادات والإنجازات" : "Certifications" }, void 0, false, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 293,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Textarea,
                  {
                    value: formData.certifications,
                    onChange: (e) => setFormData({ ...formData, certifications: e.target.value }),
                    rows: 4,
                    placeholder: language === "ar" ? "أدخل كل شهادة في سطر منفصل" : "Enter each certification on a new line"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 294,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 292,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-end gap-3 pt-4", children: [
                /* @__PURE__ */ jsxDEV(Button, { type: "button", variant: "outline", onClick: () => setEditDialogOpen(false), children: language === "ar" ? "إلغاء" : "Cancel" }, void 0, false, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 303,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Button,
                  {
                    type: "submit",
                    className: "bg-emerald-600 hover:bg-emerald-700",
                    disabled: createMutation.isPending || updateMutation.isPending,
                    children: editingTrainer ? language === "ar" ? "تحديث" : "Update" : language === "ar" ? "إضافة" : "Add"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 306,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 302,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Trainers.jsx?raw=",
              lineNumber: 197,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/Trainers.jsx?raw=",
            lineNumber: 189,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/Trainers.jsx?raw=",
          lineNumber: 182,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/Trainers.jsx?raw=",
        lineNumber: 177,
        columnNumber: 9
      }, this),
      isLoading ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-12", children: /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: t("loading") }, void 0, false, {
        fileName: "/app/src/pages/Trainers.jsx?raw=",
        lineNumber: 325,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/Trainers.jsx?raw=",
        lineNumber: 324,
        columnNumber: 9
      }, this) : trainers.length === 0 ? /* @__PURE__ */ jsxDEV(Card, { children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsxDEV(Users, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }, void 0, false, {
          fileName: "/app/src/pages/Trainers.jsx?raw=",
          lineNumber: 330,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: language === "ar" ? "لا يوجد مدربون حالياً" : "No trainers available" }, void 0, false, {
          fileName: "/app/src/pages/Trainers.jsx?raw=",
          lineNumber: 331,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/Trainers.jsx?raw=",
        lineNumber: 329,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/Trainers.jsx?raw=",
        lineNumber: 328,
        columnNumber: 9
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: trainers.map(
        (trainer) => /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            children: /* @__PURE__ */ jsxDEV(Card, { className: "h-full hover:shadow-xl transition-all", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center text-center", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 overflow-hidden shadow-lg", children: trainer.photo_url ? /* @__PURE__ */ jsxDEV("img", { src: trainer.photo_url, alt: trainer.name_ar, className: "w-full h-full object-cover" }, void 0, false, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 350,
                columnNumber: 21
              }, this) : /* @__PURE__ */ jsxDEV(User, { className: "w-14 h-14 text-white" }, void 0, false, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 352,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 348,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: language === "ar" ? trainer.name_ar : trainer.name_en }, void 0, false, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 357,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 mb-4 text-sm line-clamp-2 min-h-[2.5rem]", children: language === "ar" ? trainer.bio_ar : trainer.bio_en }, void 0, false, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 362,
                columnNumber: 23
              }, this),
              trainer.experience_years && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-emerald-600 mb-4", children: [
                /* @__PURE__ */ jsxDEV(Award, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 369,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-medium", children: [
                  trainer.experience_years,
                  " ",
                  language === "ar" ? "سنوات خبرة" : "years experience"
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 370,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 368,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-1 justify-center mb-4", children: [
                trainer.specializations?.slice(0, 3).map(
                  (sport) => /* @__PURE__ */ jsxDEV(Badge, { variant: "outline", className: "text-xs", children: t(`sports.${sport}`) }, sport, false, {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 379,
                    columnNumber: 21
                  }, this)
                ),
                trainer.specializations?.length > 3 && /* @__PURE__ */ jsxDEV(Badge, { variant: "outline", className: "text-xs", children: [
                  "+",
                  trainer.specializations.length - 3
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 384,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 377,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-1 mb-4 w-full text-sm text-gray-500", children: [
                trainer.email && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV(Mail, { className: "w-3 h-3" }, void 0, false, {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 394,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "truncate", children: trainer.email }, void 0, false, {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 395,
                    columnNumber: 29
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 393,
                  columnNumber: 21
                }, this),
                trainer.phone && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV(Phone, { className: "w-3 h-3" }, void 0, false, {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 400,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: trainer.phone }, void 0, false, {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 401,
                    columnNumber: 29
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 399,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 391,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 w-full", children: [
                /* @__PURE__ */ jsxDEV(Link, { to: createPageUrl("TrainerProfile") + "?id=" + trainer.id, className: "flex-1", children: /* @__PURE__ */ jsxDEV(Button, { className: "w-full bg-emerald-600 hover:bg-emerald-700", size: "sm", children: [
                  language === "ar" ? "عرض البروفايل" : "View Profile",
                  /* @__PURE__ */ jsxDEV(ExternalLink, { className: "w-3 h-3 ms-2" }, void 0, false, {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 411,
                    columnNumber: 29
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 409,
                  columnNumber: 27
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/Trainers.jsx?raw=",
                  lineNumber: 408,
                  columnNumber: 25
                }, this),
                isTrainer && /* @__PURE__ */ jsxDEV(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => handleEdit(trainer),
                    children: /* @__PURE__ */ jsxDEV(Edit2, { className: "w-3 h-3" }, void 0, false, {
                      fileName: "/app/src/pages/Trainers.jsx?raw=",
                      lineNumber: 420,
                      columnNumber: 29
                    }, this)
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/Trainers.jsx?raw=",
                    lineNumber: 415,
                    columnNumber: 21
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/Trainers.jsx?raw=",
                lineNumber: 407,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Trainers.jsx?raw=",
              lineNumber: 346,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/Trainers.jsx?raw=",
              lineNumber: 345,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/Trainers.jsx?raw=",
              lineNumber: 344,
              columnNumber: 17
            }, this)
          },
          trainer.id,
          false,
          {
            fileName: "/app/src/pages/Trainers.jsx?raw=",
            lineNumber: 339,
            columnNumber: 11
          },
          this
        )
      ) }, void 0, false, {
        fileName: "/app/src/pages/Trainers.jsx?raw=",
        lineNumber: 337,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/Trainers.jsx?raw=",
      lineNumber: 176,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/Trainers.jsx?raw=",
    lineNumber: 151,
    columnNumber: 5
  }, this);
}