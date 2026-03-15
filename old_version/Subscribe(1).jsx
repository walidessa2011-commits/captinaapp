function Subscribe() {
  _s();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [createdSubscription, setCreatedSubscription] = useState(null);
  const [formData, setFormData] = useState({
    sport_type: "",
    trainer_id: "",
    training_location_type: "home",
    gym_id: "",
    home_location: "",
    home_phone: "",
    payment_method: "credit_card"
  });
  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin(window.location.href);
        return;
      }
      const userData = await base44.auth.me();
      setUser(userData);
    };
    loadUser();
    const urlParams = new URLSearchParams(window.location.search);
    const planId = urlParams.get("plan");
    if (planId) setSelectedPlanId(planId);
  }, []);
  const { data: subscriptions = [] } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: () => base44.entities.Subscription.filter({ is_active: true })
  });
  const { data: trainers = [] } = useQuery({
    queryKey: ["trainers", formData.sport_type],
    queryFn: () => base44.entities.Trainer.list(),
    enabled: !!formData.sport_type
  });
  const { data: gyms = [] } = useQuery({
    queryKey: ["gyms"],
    queryFn: () => base44.entities.Gym.filter({ is_active: true }),
    enabled: formData.training_location_type === "gym"
  });
  const createSubscriptionMutation = useMutation({
    mutationFn: (data) => base44.entities.UserSubscription.create(data),
    onSuccess: (data) => {
      toast.success(language === "ar" ? "تم الاشتراك بنجاح! 🎉" : "Subscription successful! 🎉");
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
      setCreatedSubscription(data);
      setShowCard(true);
    },
    onError: () => {
      toast.error(language === "ar" ? "حدث خطأ أثناء الاشتراك" : "Subscription failed");
    }
  });
  const selectedPlan = subscriptions.find((s) => s.id === selectedPlanId);
  const selectedTrainer = trainers.find((t2) => t2.id === formData.trainer_id);
  const selectedGym = gyms.find((g) => g.id === formData.gym_id);
  const filteredTrainers = trainers.filter(
    (t2) => t2.specializations?.includes(formData.sport_type)
  );
  const handleSubmit = async () => {
    if (!selectedPlan || !formData.sport_type || !formData.trainer_id) {
      toast.error(language === "ar" ? "يرجى إكمال جميع الحقول" : "Please complete all fields");
      return;
    }
    if (formData.training_location_type === "home" && (!formData.home_location || !formData.home_phone)) {
      toast.error(language === "ar" ? "يرجى إدخال عنوان المنزل ورقم التواصل" : "Please enter home address and phone");
      return;
    }
    if (formData.training_location_type === "gym" && !formData.gym_id) {
      toast.error(language === "ar" ? "يرجى اختيار النادي" : "Please select a gym");
      return;
    }
    const startDate = /* @__PURE__ */ new Date();
    const endDate = /* @__PURE__ */ new Date();
    endDate.setMonth(endDate.getMonth() + selectedPlan.duration_months);
    const subscriptionData = {
      user_email: user.email,
      user_name: user.full_name,
      subscription_id: selectedPlan.id,
      subscription_title_ar: selectedPlan.title_ar,
      subscription_title_en: selectedPlan.title_en,
      trainer_id: formData.trainer_id,
      trainer_name: selectedTrainer ? language === "ar" ? selectedTrainer.name_ar : selectedTrainer.name_en : "",
      sport_type: formData.sport_type,
      training_location_type: formData.training_location_type,
      gym_id: formData.gym_id || void 0,
      home_location: formData.home_location || void 0,
      home_phone: formData.home_phone || void 0,
      duration_months: selectedPlan.duration_months,
      price: selectedPlan.price,
      sessions_count: selectedPlan.sessions_count,
      remaining_sessions: selectedPlan.sessions_count,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      payment_method: formData.payment_method,
      payment_status: "completed",
      status: "active"
    };
    createSubscriptionMutation.mutate(subscriptionData);
  };
  const sports = [
    { value: "boxing", label_ar: "الملاكمة", label_en: "Boxing" },
    { value: "karate", label_ar: "الكاراتيه", label_en: "Karate" },
    { value: "taekwondo", label_ar: "التايكوندو", label_en: "Taekwondo" },
    { value: "judo", label_ar: "الجودو", label_en: "Judo" },
    { value: "muay_thai", label_ar: "المواي تاي", label_en: "Muay Thai" },
    { value: "mma", label_ar: "MMA", label_en: "MMA" },
    { value: "wrestling", label_ar: "المصارعة", label_en: "Wrestling" },
    { value: "jiu_jitsu", label_ar: "الجيو جيتسو", label_en: "Jiu-Jitsu" },
    { value: "kickboxing", label_ar: "الكيك بوكسينغ", label_en: "Kickboxing" }
  ];
  if (!user) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-gray-50", children: /* @__PURE__ */ jsxDEV("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" }, void 0, false, {
      fileName: "/app/src/pages/Subscribe.jsx?raw=",
      lineNumber: 172,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/Subscribe.jsx?raw=",
      lineNumber: 171,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50 py-20", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 max-w-6xl", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center gap-4", children: [1, 2, 3].map(
        (s) => /* @__PURE__ */ jsxDEV("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsxDEV("div", { className: `w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`, children: s }, void 0, false, {
            fileName: "/app/src/pages/Subscribe.jsx?raw=",
            lineNumber: 185,
            columnNumber: 17
          }, this),
          s < 3 && /* @__PURE__ */ jsxDEV("div", { className: `w-16 h-1 mx-2 transition-all ${step > s ? "bg-emerald-600" : "bg-gray-200"}` }, void 0, false, {
            fileName: "/app/src/pages/Subscribe.jsx?raw=",
            lineNumber: 191,
            columnNumber: 15
          }, this)
        ] }, s, true, {
          fileName: "/app/src/pages/Subscribe.jsx?raw=",
          lineNumber: 184,
          columnNumber: 13
        }, this)
      ) }, void 0, false, {
        fileName: "/app/src/pages/Subscribe.jsx?raw=",
        lineNumber: 182,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "text-center mt-4", children: /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900", children: [
        step === 1 && (language === "ar" ? "اختر الباقة والرياضة" : "Choose Plan & Sport"),
        step === 2 && (language === "ar" ? "اختر المدرب والموقع" : "Choose Trainer & Location"),
        step === 3 && (language === "ar" ? "الدفع والتأكيد" : "Payment & Confirmation")
      ] }, void 0, true, {
        fileName: "/app/src/pages/Subscribe.jsx?raw=",
        lineNumber: 199,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/Subscribe.jsx?raw=",
        lineNumber: 198,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/Subscribe.jsx?raw=",
      lineNumber: 181,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", children: [
        step === 1 && /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
            children: /* @__PURE__ */ jsxDEV(Card, { children: [
              /* @__PURE__ */ jsxDEV(CardHeader, { children: /* @__PURE__ */ jsxDEV(CardTitle, { children: t("selectPlan") }, void 0, false, {
                fileName: "/app/src/pages/Subscribe.jsx?raw=",
                lineNumber: 221,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/Subscribe.jsx?raw=",
                lineNumber: 220,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(CardContent, { className: "space-y-6", children: [
                /* @__PURE__ */ jsxDEV(RadioGroup, { value: selectedPlanId, onValueChange: setSelectedPlanId, children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: subscriptions.map(
                  (plan) => /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxDEV(RadioGroupItem, { value: plan.id, id: plan.id, className: "peer sr-only" }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 228,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      Label,
                      {
                        htmlFor: plan.id,
                        className: "flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all peer-checked:border-emerald-600 peer-checked:bg-emerald-50 hover:border-emerald-300",
                        children: [
                          /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
                            /* @__PURE__ */ jsxDEV("div", { className: "font-bold text-lg", children: language === "ar" ? plan.title_ar : plan.title_en }, void 0, false, {
                              fileName: "/app/src/pages/Subscribe.jsx?raw=",
                              lineNumber: 234,
                              columnNumber: 35
                            }, this),
                            /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-600", children: [
                              plan.duration_months,
                              " ",
                              language === "ar" ? "أشهر" : "months",
                              " • ",
                              plan.sessions_count,
                              " ",
                              language === "ar" ? "جلسة" : "sessions"
                            ] }, void 0, true, {
                              fileName: "/app/src/pages/Subscribe.jsx?raw=",
                              lineNumber: 237,
                              columnNumber: 35
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/src/pages/Subscribe.jsx?raw=",
                            lineNumber: 233,
                            columnNumber: 33
                          }, this),
                          /* @__PURE__ */ jsxDEV("div", { className: "text-right", children: [
                            /* @__PURE__ */ jsxDEV("div", { className: "text-2xl font-bold text-emerald-600", children: plan.price }, void 0, false, {
                              fileName: "/app/src/pages/Subscribe.jsx?raw=",
                              lineNumber: 242,
                              columnNumber: 35
                            }, this),
                            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-500", children: t("sar") }, void 0, false, {
                              fileName: "/app/src/pages/Subscribe.jsx?raw=",
                              lineNumber: 243,
                              columnNumber: 35
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/src/pages/Subscribe.jsx?raw=",
                            lineNumber: 241,
                            columnNumber: 33
                          }, this)
                        ]
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 229,
                        columnNumber: 31
                      },
                      this
                    )
                  ] }, plan.id, true, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 227,
                    columnNumber: 25
                  }, this)
                ) }, void 0, false, {
                  fileName: "/app/src/pages/Subscribe.jsx?raw=",
                  lineNumber: 225,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/Subscribe.jsx?raw=",
                  lineNumber: 224,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: t("selectSport") }, void 0, false, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 252,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(Select, { value: formData.sport_type, onValueChange: (value) => setFormData({ ...formData, sport_type: value, trainer_id: "" }), children: [
                    /* @__PURE__ */ jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDEV(SelectValue, { placeholder: language === "ar" ? "اختر الرياضة" : "Select Sport" }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 255,
                      columnNumber: 29
                    }, this) }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 254,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV(SelectContent, { children: sports.map(
                      (sport) => /* @__PURE__ */ jsxDEV(SelectItem, { value: sport.value, children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxDEV(SportIcon, { sport: sport.value, size: "small" }, void 0, false, {
                          fileName: "/app/src/pages/Subscribe.jsx?raw=",
                          lineNumber: 261,
                          columnNumber: 35
                        }, this),
                        language === "ar" ? sport.label_ar : sport.label_en
                      ] }, void 0, true, {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 260,
                        columnNumber: 33
                      }, this) }, sport.value, false, {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 259,
                        columnNumber: 27
                      }, this)
                    ) }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 257,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 253,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Subscribe.jsx?raw=",
                  lineNumber: 251,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Button,
                  {
                    onClick: () => setStep(2),
                    disabled: !selectedPlanId || !formData.sport_type,
                    className: "w-full bg-emerald-600 hover:bg-emerald-700",
                    children: [
                      language === "ar" ? "التالي" : "Next",
                      /* @__PURE__ */ jsxDEV(ArrowRight, { className: `w-4 h-4 ${language === "ar" ? "mr-2" : "ml-2"}` }, void 0, false, {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 276,
                        columnNumber: 25
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 270,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/Subscribe.jsx?raw=",
                lineNumber: 223,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Subscribe.jsx?raw=",
              lineNumber: 219,
              columnNumber: 19
            }, this)
          },
          "step1",
          false,
          {
            fileName: "/app/src/pages/Subscribe.jsx?raw=",
            lineNumber: 213,
            columnNumber: 15
          },
          this
        ),
        step === 2 && /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
            children: /* @__PURE__ */ jsxDEV(Card, { children: [
              /* @__PURE__ */ jsxDEV(CardHeader, { children: /* @__PURE__ */ jsxDEV(CardTitle, { children: t("selectTrainer") }, void 0, false, {
                fileName: "/app/src/pages/Subscribe.jsx?raw=",
                lineNumber: 293,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/Subscribe.jsx?raw=",
                lineNumber: 292,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(CardContent, { className: "space-y-6", children: [
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: t("selectTrainer") }, void 0, false, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 297,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(Select, { value: formData.trainer_id, onValueChange: (value) => setFormData({ ...formData, trainer_id: value }), children: [
                    /* @__PURE__ */ jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDEV(SelectValue, { placeholder: language === "ar" ? "اختر المدرب" : "Select Trainer" }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 300,
                      columnNumber: 29
                    }, this) }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 299,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV(SelectContent, { children: filteredTrainers.map(
                      (trainer) => /* @__PURE__ */ jsxDEV(SelectItem, { value: trainer.id, children: language === "ar" ? trainer.name_ar : trainer.name_en }, trainer.id, false, {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 304,
                        columnNumber: 27
                      }, this)
                    ) }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 302,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 298,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Subscribe.jsx?raw=",
                  lineNumber: 296,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: t("trainingLocation") }, void 0, false, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 313,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(RadioGroup, { value: formData.training_location_type, onValueChange: (value) => setFormData({ ...formData, training_location_type: value }), children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      /* @__PURE__ */ jsxDEV(RadioGroupItem, { value: "home", id: "home", className: "peer sr-only" }, void 0, false, {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 317,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV(Label, { htmlFor: "home", className: "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer peer-checked:border-emerald-600 peer-checked:bg-emerald-50", children: [
                        /* @__PURE__ */ jsxDEV(Home, { className: "w-5 h-5" }, void 0, false, {
                          fileName: "/app/src/pages/Subscribe.jsx?raw=",
                          lineNumber: 319,
                          columnNumber: 33
                        }, this),
                        t("homeTraining")
                      ] }, void 0, true, {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 318,
                        columnNumber: 31
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 316,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      /* @__PURE__ */ jsxDEV(RadioGroupItem, { value: "gym", id: "gym", className: "peer sr-only" }, void 0, false, {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 324,
                        columnNumber: 31
                      }, this),
                      /* @__PURE__ */ jsxDEV(Label, { htmlFor: "gym", className: "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer peer-checked:border-emerald-600 peer-checked:bg-emerald-50", children: [
                        /* @__PURE__ */ jsxDEV(MapPin, { className: "w-5 h-5" }, void 0, false, {
                          fileName: "/app/src/pages/Subscribe.jsx?raw=",
                          lineNumber: 326,
                          columnNumber: 33
                        }, this),
                        t("gymTraining")
                      ] }, void 0, true, {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 325,
                        columnNumber: 31
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 323,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 315,
                    columnNumber: 27
                  }, this) }, void 0, false, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 314,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Subscribe.jsx?raw=",
                  lineNumber: 312,
                  columnNumber: 23
                }, this),
                formData.training_location_type === "home" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV(Label, { children: t("homeAddress") }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 337,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      Input,
                      {
                        value: formData.home_location,
                        onChange: (e) => setFormData({ ...formData, home_location: e.target.value }),
                        placeholder: language === "ar" ? "أدخل عنوان المنزل" : "Enter home address"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 338,
                        columnNumber: 29
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 336,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV(Label, { children: t("phoneNumber") }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 345,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      Input,
                      {
                        value: formData.home_phone,
                        onChange: (e) => setFormData({ ...formData, home_phone: e.target.value }),
                        placeholder: language === "ar" ? "أدخل رقم التواصل" : "Enter phone number"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 346,
                        columnNumber: 29
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 344,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Subscribe.jsx?raw=",
                  lineNumber: 335,
                  columnNumber: 21
                }, this),
                formData.training_location_type === "gym" && /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: t("selectGym") }, void 0, false, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 357,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV(Select, { value: formData.gym_id, onValueChange: (value) => setFormData({ ...formData, gym_id: value }), children: [
                    /* @__PURE__ */ jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDEV(SelectValue, { placeholder: language === "ar" ? "اختر النادي" : "Select Gym" }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 360,
                      columnNumber: 31
                    }, this) }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 359,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV(SelectContent, { children: gyms.map(
                      (gym) => /* @__PURE__ */ jsxDEV(SelectItem, { value: gym.id, children: language === "ar" ? gym.name_ar : gym.name_en }, gym.id, false, {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 364,
                        columnNumber: 27
                      }, this)
                    ) }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 362,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 358,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Subscribe.jsx?raw=",
                  lineNumber: 356,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxDEV(Button, { onClick: () => setStep(1), variant: "outline", className: "flex-1", children: [
                    /* @__PURE__ */ jsxDEV(ArrowLeft, { className: `w-4 h-4 ${language === "ar" ? "ml-2" : "mr-2"}` }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 375,
                      columnNumber: 27
                    }, this),
                    language === "ar" ? "السابق" : "Previous"
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 374,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(Button, { onClick: () => setStep(3), disabled: !formData.trainer_id, className: "flex-1 bg-emerald-600 hover:bg-emerald-700", children: [
                    language === "ar" ? "التالي" : "Next",
                    /* @__PURE__ */ jsxDEV(ArrowRight, { className: `w-4 h-4 ${language === "ar" ? "mr-2" : "ml-2"}` }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 380,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 378,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Subscribe.jsx?raw=",
                  lineNumber: 373,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Subscribe.jsx?raw=",
                lineNumber: 295,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Subscribe.jsx?raw=",
              lineNumber: 291,
              columnNumber: 19
            }, this)
          },
          "step2",
          false,
          {
            fileName: "/app/src/pages/Subscribe.jsx?raw=",
            lineNumber: 285,
            columnNumber: 15
          },
          this
        ),
        step === 3 && /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
            children: /* @__PURE__ */ jsxDEV(Card, { children: [
              /* @__PURE__ */ jsxDEV(CardHeader, { children: /* @__PURE__ */ jsxDEV(CardTitle, { children: t("paymentMethod") }, void 0, false, {
                fileName: "/app/src/pages/Subscribe.jsx?raw=",
                lineNumber: 398,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/Subscribe.jsx?raw=",
                lineNumber: 397,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(CardContent, { className: "space-y-6", children: [
                /* @__PURE__ */ jsxDEV(RadioGroup, { value: formData.payment_method, onValueChange: (value) => setFormData({ ...formData, payment_method: value }), children: /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [
                  { value: "credit_card", label: t("creditCard"), icon: CreditCard },
                  { value: "mada", label: t("mada"), icon: CreditCard },
                  { value: "apple_pay", label: t("applePay"), icon: CreditCard },
                  { value: "stc_pay", label: t("stcPay"), icon: Phone },
                  { value: "bank_transfer", label: t("bankTransfer"), icon: CreditCard }
                ].map(
                  (method) => /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV(RadioGroupItem, { value: method.value, id: method.value, className: "peer sr-only" }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 411,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV(Label, { htmlFor: method.value, className: "flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer peer-checked:border-emerald-600 peer-checked:bg-emerald-50", children: [
                      /* @__PURE__ */ jsxDEV(method.icon, { className: "w-5 h-5" }, void 0, false, {
                        fileName: "/app/src/pages/Subscribe.jsx?raw=",
                        lineNumber: 413,
                        columnNumber: 33
                      }, this),
                      method.label
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 412,
                      columnNumber: 31
                    }, this)
                  ] }, method.value, true, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 410,
                    columnNumber: 25
                  }, this)
                ) }, void 0, false, {
                  fileName: "/app/src/pages/Subscribe.jsx?raw=",
                  lineNumber: 402,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/Subscribe.jsx?raw=",
                  lineNumber: 401,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3", children: [
                  /* @__PURE__ */ jsxDEV(Button, { onClick: () => setStep(2), variant: "outline", className: "flex-1", children: [
                    /* @__PURE__ */ jsxDEV(ArrowLeft, { className: `w-4 h-4 ${language === "ar" ? "ml-2" : "mr-2"}` }, void 0, false, {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 423,
                      columnNumber: 27
                    }, this),
                    language === "ar" ? "السابق" : "Previous"
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Subscribe.jsx?raw=",
                    lineNumber: 422,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Button,
                    {
                      onClick: handleSubmit,
                      disabled: createSubscriptionMutation.isPending,
                      className: "flex-1 bg-emerald-600 hover:bg-emerald-700",
                      children: createSubscriptionMutation.isPending ? language === "ar" ? "جاري المعالجة..." : "Processing..." : t("confirmSubscription")
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/Subscribe.jsx?raw=",
                      lineNumber: 426,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Subscribe.jsx?raw=",
                  lineNumber: 421,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Subscribe.jsx?raw=",
                lineNumber: 400,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Subscribe.jsx?raw=",
              lineNumber: 396,
              columnNumber: 19
            }, this)
          },
          "step3",
          false,
          {
            fileName: "/app/src/pages/Subscribe.jsx?raw=",
            lineNumber: 390,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/src/pages/Subscribe.jsx?raw=",
        lineNumber: 210,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/Subscribe.jsx?raw=",
        lineNumber: 209,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxDEV(Card, { className: "sticky top-24", children: [
        /* @__PURE__ */ jsxDEV(CardHeader, { children: /* @__PURE__ */ jsxDEV(CardTitle, { children: t("subscriptionSummary") }, void 0, false, {
          fileName: "/app/src/pages/Subscribe.jsx?raw=",
          lineNumber: 445,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/Subscribe.jsx?raw=",
          lineNumber: 444,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV(CardContent, { className: "space-y-4", children: [
          selectedPlan && /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-emerald-50 rounded-lg", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-600 mb-1", children: t("selectedPlan") }, void 0, false, {
              fileName: "/app/src/pages/Subscribe.jsx?raw=",
              lineNumber: 450,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "font-bold", children: language === "ar" ? selectedPlan.title_ar : selectedPlan.title_en }, void 0, false, {
              fileName: "/app/src/pages/Subscribe.jsx?raw=",
              lineNumber: 451,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-600", children: [
              selectedPlan.duration_months,
              " ",
              language === "ar" ? "أشهر" : "months"
            ] }, void 0, true, {
              fileName: "/app/src/pages/Subscribe.jsx?raw=",
              lineNumber: 452,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/Subscribe.jsx?raw=",
            lineNumber: 449,
            columnNumber: 17
          }, this),
          formData.sport_type && /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-gray-50 rounded-lg", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-600 mb-1", children: t("selectedSport") }, void 0, false, {
              fileName: "/app/src/pages/Subscribe.jsx?raw=",
              lineNumber: 458,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDEV(SportIcon, { sport: formData.sport_type, size: "small" }, void 0, false, {
                fileName: "/app/src/pages/Subscribe.jsx?raw=",
                lineNumber: 460,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-bold", children: t(`sports.${formData.sport_type}`) }, void 0, false, {
                fileName: "/app/src/pages/Subscribe.jsx?raw=",
                lineNumber: 461,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Subscribe.jsx?raw=",
              lineNumber: 459,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/Subscribe.jsx?raw=",
            lineNumber: 457,
            columnNumber: 17
          }, this),
          selectedTrainer && /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-gray-50 rounded-lg", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-600 mb-1", children: t("selectedTrainer") }, void 0, false, {
              fileName: "/app/src/pages/Subscribe.jsx?raw=",
              lineNumber: 468,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "font-bold", children: language === "ar" ? selectedTrainer.name_ar : selectedTrainer.name_en }, void 0, false, {
              fileName: "/app/src/pages/Subscribe.jsx?raw=",
              lineNumber: 469,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/Subscribe.jsx?raw=",
            lineNumber: 467,
            columnNumber: 17
          }, this),
          selectedPlan && /* @__PURE__ */ jsxDEV("div", { className: "pt-4 border-t", children: /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-2", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "text-gray-600", children: t("totalAmount") }, void 0, false, {
              fileName: "/app/src/pages/Subscribe.jsx?raw=",
              lineNumber: 476,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-2xl font-bold text-emerald-600", children: [
              selectedPlan.price,
              " ",
              t("sar")
            ] }, void 0, true, {
              fileName: "/app/src/pages/Subscribe.jsx?raw=",
              lineNumber: 477,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/Subscribe.jsx?raw=",
            lineNumber: 475,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/Subscribe.jsx?raw=",
            lineNumber: 474,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/Subscribe.jsx?raw=",
          lineNumber: 447,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/Subscribe.jsx?raw=",
        lineNumber: 443,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/Subscribe.jsx?raw=",
        lineNumber: 442,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/Subscribe.jsx?raw=",
      lineNumber: 207,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(Dialog, { open: showCard, onOpenChange: setShowCard, children: /* @__PURE__ */ jsxDEV(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxDEV(DialogHeader, { children: /* @__PURE__ */ jsxDEV(DialogTitle, { children: language === "ar" ? "بطاقة الاشتراك" : "Subscription Card" }, void 0, false, {
        fileName: "/app/src/pages/Subscribe.jsx?raw=",
        lineNumber: 490,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/Subscribe.jsx?raw=",
        lineNumber: 489,
        columnNumber: 13
      }, this),
      createdSubscription && /* @__PURE__ */ jsxDEV(
        PrintableBookingCard,
        {
          type: "subscription",
          data: {
            name: user.full_name,
            phone: formData.home_phone || user.phone || "",
            sport: t(`sports.${formData.sport_type}`),
            trainer: selectedTrainer ? language === "ar" ? selectedTrainer.name_ar : selectedTrainer.name_en : "",
            location_type: formData.training_location_type,
            location: formData.training_location_type === "home" ? formData.home_location : selectedGym ? language === "ar" ? selectedGym.name_ar : selectedGym.name_en : "",
            plan: language === "ar" ? selectedPlan.title_ar : selectedPlan.title_en,
            sessions: selectedPlan.sessions_count,
            price: selectedPlan.price,
            duration: `${selectedPlan.duration_months} ${language === "ar" ? "أشهر" : "months"}`,
            date: new Date(createdSubscription.start_date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US"),
            booking_id: createdSubscription.id
          }
        },
        void 0,
        false,
        {
          fileName: "/app/src/pages/Subscribe.jsx?raw=",
          lineNumber: 495,
          columnNumber: 13
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          onClick: () => window.location.href = "/Profile",
          className: "w-full bg-emerald-600 hover:bg-emerald-700 mt-4",
          children: language === "ar" ? "الذهاب إلى الملف الشخصي" : "Go to Profile"
        },
        void 0,
        false,
        {
          fileName: "/app/src/pages/Subscribe.jsx?raw=",
          lineNumber: 515,
          columnNumber: 13
        },
        this
      )
    ] }, void 0, true, {
      fileName: "/app/src/pages/Subscribe.jsx?raw=",
      lineNumber: 488,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/Subscribe.jsx?raw=",
      lineNumber: 487,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/Subscribe.jsx?raw=",
    lineNumber: 179,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/pages/Subscribe.jsx?raw=",
    lineNumber: 178,
    columnNumber: 5
  }, this);
}