function BookSession() {
  _s2();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [showCard, setShowCard] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [formData, setFormData] = useState({
    sport_type: "",
    trainer_id: "",
    session_date: null,
    session_time: "",
    notes: "",
    location_type: "home",
    gym_id: "",
    home_location: "",
    home_latitude: null,
    home_longitude: null
  });
  const [mapPosition, setMapPosition] = useState({ lat: 24.7136, lng: 46.6753 });
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
  const { data: myBookings = [], isLoading: loadingBookings } = useQuery({
    queryKey: ["my-bookings", user?.email],
    queryFn: () => base44.entities.Booking.filter({ trainee_email: user?.email }, "-created_date", 20),
    enabled: !!user
  });
  const { data: trainers = [] } = useQuery({
    queryKey: ["trainers", formData.sport_type],
    queryFn: async () => {
      const allTrainers = await base44.entities.Trainer.list();
      return allTrainers.filter((t2) => t2.specializations?.includes(formData.sport_type));
    },
    enabled: !!formData.sport_type
  });
  const { data: gyms = [] } = useQuery({
    queryKey: ["gyms", formData.sport_type],
    queryFn: async () => {
      const allGyms = await base44.entities.Gym.filter({ is_active: true });
      return allGyms.filter((g) => g.available_sports?.includes(formData.sport_type));
    },
    enabled: !!formData.sport_type && formData.location_type === "gym"
  });
  const bookingMutation = useMutation({
    mutationFn: async (data) => {
      const booking = await base44.entities.Booking.create(data);
      await base44.entities.Notification.create({
        user_email: data.trainee_email,
        type: "booking_confirmed",
        title_ar: "تم تأكيد الحجز",
        title_en: "Booking Confirmed",
        message_ar: `تم تأكيد حجزك لجلسة ${data.sport_type} في ${data.session_date} - ${data.session_time}`,
        message_en: `Your booking for ${data.sport_type} session on ${data.session_date} - ${data.session_time} has been confirmed`,
        related_id: booking.id,
        related_type: "booking"
      });
      return booking;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] });
      setCreatedBooking(data);
      setStep(5);
      setShowCard(true);
    }
  });
  const handleSubmit = () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    const selectedTrainer2 = trainers.find((t2) => t2.id === formData.trainer_id);
    bookingMutation.mutate({
      sport_type: formData.sport_type,
      trainer_id: formData.trainer_id,
      trainer_email: selectedTrainer2?.email,
      session_date: formData.session_date ? format(formData.session_date, "yyyy-MM-dd") : "",
      session_time: formData.session_time,
      location_type: formData.location_type,
      gym_id: formData.location_type === "gym" ? formData.gym_id : null,
      home_location: formData.location_type === "home" ? formData.home_location : null,
      home_latitude: formData.location_type === "home" ? mapPosition.lat : null,
      home_longitude: formData.location_type === "home" ? mapPosition.lng : null,
      notes: formData.notes,
      trainee_email: user.email,
      trainee_name: user.full_name,
      status: "pending"
    });
  };
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    confirmed: "bg-green-100 text-green-700 border-green-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    cancelled: "bg-red-100 text-red-700 border-red-200"
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen pt-24 pb-16", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-blue-900 to-blue-800 py-16 mb-8", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 text-center", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxDEV(Calendar, { className: "w-8 h-8 text-blue-950" }, void 0, false, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 189,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 188,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: t("bookSession") }, void 0, false, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 191,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-blue-200/80 max-w-2xl mx-auto", children: language === "ar" ? "احجز جلستك التدريبية مع أفضل المدربين المحترفين" : "Book your training session with the best professional trainers" }, void 0, false, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 194,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/pages/BookSession.jsx?raw=",
        lineNumber: 184,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/pages/BookSession.jsx?raw=",
      lineNumber: 183,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/BookSession.jsx?raw=",
      lineNumber: 182,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "grid lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxDEV(Card, { className: "shadow-lg border-0", children: [
          /* @__PURE__ */ jsxDEV(CardHeader, { className: "border-b bg-gray-50/50", children: /* @__PURE__ */ jsxDEV(CardTitle, { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2", children: [1, 2, 3, 4].map(
              (s) => /* @__PURE__ */ jsxDEV(
                "div",
                {
                  className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`,
                  children: step > s ? /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-5 h-5" }, void 0, false, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 220,
                    columnNumber: 37
                  }, this) : s
                },
                s,
                false,
                {
                  fileName: "/app/src/pages/BookSession.jsx?raw=",
                  lineNumber: 212,
                  columnNumber: 21
                },
                this
              )
            ) }, void 0, false, {
              fileName: "/app/src/pages/BookSession.jsx?raw=",
              lineNumber: 210,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-gray-700", children: [
              step === 1 && (language === "ar" ? "اختر الرياضة والمدرب" : "Select Sport & Trainer"),
              step === 2 && (language === "ar" ? "اختر الموعد" : "Select Date & Time"),
              step === 3 && (language === "ar" ? "موقع التدريب" : "Training Location"),
              step === 4 && (language === "ar" ? "تفاصيل إضافية" : "Additional Details"),
              step === 5 && (language === "ar" ? "تم الحجز!" : "Booking Complete!")
            ] }, void 0, true, {
              fileName: "/app/src/pages/BookSession.jsx?raw=",
              lineNumber: 224,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 209,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 208,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(CardContent, { className: "p-6", children: [
            step === 1 && /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                className: "space-y-6",
                children: [
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV(Label, { className: "mb-3 block text-base font-semibold", children: language === "ar" ? "اختر الرياضة" : "Select Sport" }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 242,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-4", children: sports.map(
                      (sport) => /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => setFormData((prev) => ({ ...prev, sport_type: sport, trainer_id: "" })),
                          className: `p-4 rounded-xl border-2 transition-all hover:border-emerald-500 hover:bg-emerald-50 ${formData.sport_type === sport ? "border-emerald-500 bg-emerald-50" : "border-gray-200"}`,
                          children: [
                            /* @__PURE__ */ jsxDEV(SportIcon, { sport }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 256,
                              columnNumber: 29
                            }, this),
                            /* @__PURE__ */ jsxDEV("p", { className: "mt-2 font-medium text-gray-700 text-sm", children: t(`sports.${sport}`) }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 257,
                              columnNumber: 29
                            }, this)
                          ]
                        },
                        sport,
                        true,
                        {
                          fileName: "/app/src/pages/BookSession.jsx?raw=",
                          lineNumber: 247,
                          columnNumber: 23
                        },
                        this
                      )
                    ) }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 245,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 241,
                    columnNumber: 21
                  }, this),
                  formData.sport_type && /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV(Label, { className: "mb-3 block text-base font-semibold", children: language === "ar" ? "اختر المدرب" : "Select Trainer" }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 267,
                      columnNumber: 25
                    }, this),
                    trainers.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 gap-3", children: trainers.map(
                      (trainer) => /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => setFormData((prev) => ({ ...prev, trainer_id: trainer.id })),
                          className: `p-4 rounded-xl border-2 transition-all text-start ${formData.trainer_id === trainer.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`,
                          children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
                            /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center overflow-hidden", children: trainer.photo_url ? /* @__PURE__ */ jsxDEV("img", { src: trainer.photo_url, alt: trainer.name_ar, className: "w-full h-full object-cover" }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 285,
                              columnNumber: 29
                            }, this) : /* @__PURE__ */ jsxDEV(User, { className: "w-6 h-6 text-white" }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 287,
                              columnNumber: 29
                            }, this) }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 283,
                              columnNumber: 35
                            }, this),
                            /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
                              /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900", children: language === "ar" ? trainer.name_ar : trainer.name_en }, void 0, false, {
                                fileName: "/app/src/pages/BookSession.jsx?raw=",
                                lineNumber: 291,
                                columnNumber: 37
                              }, this),
                              /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500", children: [
                                trainer.experience_years,
                                " ",
                                language === "ar" ? "سنوات خبرة" : "years exp"
                              ] }, void 0, true, {
                                fileName: "/app/src/pages/BookSession.jsx?raw=",
                                lineNumber: 294,
                                columnNumber: 37
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 290,
                              columnNumber: 35
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/src/pages/BookSession.jsx?raw=",
                            lineNumber: 282,
                            columnNumber: 33
                          }, this)
                        },
                        trainer.id,
                        false,
                        {
                          fileName: "/app/src/pages/BookSession.jsx?raw=",
                          lineNumber: 273,
                          columnNumber: 23
                        },
                        this
                      )
                    ) }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 271,
                      columnNumber: 21
                    }, this) : /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 text-center py-4", children: language === "ar" ? "لا يوجد مدربون متاحون لهذه الرياضة" : "No trainers available for this sport" }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 303,
                      columnNumber: 21
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 266,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Button,
                    {
                      onClick: () => setStep(2),
                      disabled: !formData.sport_type || !formData.trainer_id,
                      className: "w-full bg-emerald-600 hover:bg-emerald-700",
                      children: language === "ar" ? "التالي" : "Next"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 310,
                      columnNumber: 21
                    },
                    this
                  )
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/src/pages/BookSession.jsx?raw=",
                lineNumber: 236,
                columnNumber: 17
              },
              this
            ),
            step === 2 && /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                className: "space-y-6",
                children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col md:flex-row gap-6", children: [
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      /* @__PURE__ */ jsxDEV(Label, { className: "mb-2 block", children: t("selectDate") }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 329,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        CalendarComponent,
                        {
                          mode: "single",
                          selected: formData.session_date,
                          onSelect: (date) => setFormData((prev) => ({ ...prev, session_date: date })),
                          disabled: (date) => date < /* @__PURE__ */ new Date(),
                          locale: language === "ar" ? ar : enUS,
                          className: "rounded-xl border"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/src/pages/BookSession.jsx?raw=",
                          lineNumber: 330,
                          columnNumber: 25
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 328,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsxDEV(Label, { className: "mb-2 block", children: t("selectTime") }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 341,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: timeSlots.map(
                        (time) => /* @__PURE__ */ jsxDEV(
                          "button",
                          {
                            onClick: () => setFormData((prev) => ({ ...prev, session_time: time })),
                            className: `p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${formData.session_time === time ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 hover:border-emerald-300"}`,
                            children: [
                              /* @__PURE__ */ jsxDEV(Clock, { className: "w-4 h-4" }, void 0, false, {
                                fileName: "/app/src/pages/BookSession.jsx?raw=",
                                lineNumber: 353,
                                columnNumber: 31
                              }, this),
                              time
                            ]
                          },
                          time,
                          true,
                          {
                            fileName: "/app/src/pages/BookSession.jsx?raw=",
                            lineNumber: 344,
                            columnNumber: 25
                          },
                          this
                        )
                      ) }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 342,
                        columnNumber: 25
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 340,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 327,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxDEV(Button, { variant: "outline", onClick: () => setStep(1), children: language === "ar" ? "السابق" : "Back" }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 362,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      Button,
                      {
                        onClick: () => setStep(3),
                        disabled: !formData.session_date || !formData.session_time,
                        className: "bg-emerald-600 hover:bg-emerald-700",
                        children: language === "ar" ? "التالي" : "Next"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 365,
                        columnNumber: 23
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 361,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/src/pages/BookSession.jsx?raw=",
                lineNumber: 322,
                columnNumber: 17
              },
              this
            ),
            step === 3 && /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                className: "space-y-6",
                children: [
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV(Label, { className: "mb-3 block text-base font-semibold", children: language === "ar" ? "موقع التدريب" : "Training Location" }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 384,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => setFormData((prev) => ({ ...prev, location_type: "home", gym_id: "" })),
                          className: `p-4 rounded-xl border-2 transition-all ${formData.location_type === "home" ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`,
                          children: [
                            /* @__PURE__ */ jsxDEV(Home, { className: "w-8 h-8 mx-auto mb-2 text-emerald-600" }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 396,
                              columnNumber: 27
                            }, this),
                            /* @__PURE__ */ jsxDEV("p", { className: "font-medium", children: language === "ar" ? "المنزل" : "Home" }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 397,
                              columnNumber: 27
                            }, this)
                          ]
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/src/pages/BookSession.jsx?raw=",
                          lineNumber: 388,
                          columnNumber: 25
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => setFormData((prev) => ({ ...prev, location_type: "gym", home_location: "" })),
                          className: `p-4 rounded-xl border-2 transition-all ${formData.location_type === "gym" ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`,
                          children: [
                            /* @__PURE__ */ jsxDEV(Building2, { className: "w-8 h-8 mx-auto mb-2 text-emerald-600" }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 407,
                              columnNumber: 27
                            }, this),
                            /* @__PURE__ */ jsxDEV("p", { className: "font-medium", children: language === "ar" ? "النادي" : "Gym" }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 408,
                              columnNumber: 27
                            }, this)
                          ]
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/src/pages/BookSession.jsx?raw=",
                          lineNumber: 399,
                          columnNumber: 25
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 387,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 383,
                    columnNumber: 21
                  }, this),
                  formData.location_type === "home" && /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "عنوان المنزل" : "Home Address" }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 416,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV(
                        Input,
                        {
                          value: formData.home_location,
                          onChange: (e) => setFormData((prev) => ({ ...prev, home_location: e.target.value })),
                          placeholder: language === "ar" ? "أدخل عنوان منزلك" : "Enter your home address",
                          className: "mt-2"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/src/pages/BookSession.jsx?raw=",
                          lineNumber: 417,
                          columnNumber: 27
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 415,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { children: [
                      /* @__PURE__ */ jsxDEV(Label, { className: "mb-2 block", children: language === "ar" ? "حدد الموقع على الخريطة" : "Select Location on Map" }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 425,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "h-64 rounded-lg overflow-hidden border-2 border-gray-200", children: /* @__PURE__ */ jsxDEV(
                        MapContainer,
                        {
                          center: [mapPosition.lat, mapPosition.lng],
                          zoom: 13,
                          style: { height: "100%", width: "100%" },
                          children: [
                            /* @__PURE__ */ jsxDEV(
                              TileLayer,
                              {
                                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/src/pages/BookSession.jsx?raw=",
                                lineNumber: 434,
                                columnNumber: 31
                              },
                              this
                            ),
                            /* @__PURE__ */ jsxDEV(LocationMarker, { position: mapPosition, setPosition: setMapPosition }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 438,
                              columnNumber: 31
                            }, this)
                          ]
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/src/pages/BookSession.jsx?raw=",
                          lineNumber: 429,
                          columnNumber: 29
                        },
                        this
                      ) }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 428,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500 mt-2", children: language === "ar" ? "انقر على الخريطة لتحديد موقعك" : "Click on the map to set your location" }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 441,
                        columnNumber: 27
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 424,
                      columnNumber: 25
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 414,
                    columnNumber: 19
                  }, this),
                  formData.location_type === "gym" && /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV(Label, { className: "mb-3 block", children: language === "ar" ? "اختر النادي" : "Select Gym" }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 450,
                      columnNumber: 25
                    }, this),
                    gyms.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 gap-3", children: gyms.map(
                      (gym) => /* @__PURE__ */ jsxDEV(
                        "button",
                        {
                          onClick: () => setFormData((prev) => ({ ...prev, gym_id: gym.id })),
                          className: `p-4 rounded-xl border-2 transition-all text-start ${formData.gym_id === gym.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`,
                          children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
                            /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 rounded-lg bg-gray-200 overflow-hidden", children: gym.image ? /* @__PURE__ */ jsxDEV("img", { src: gym.image, alt: gym.name_ar, className: "w-full h-full object-cover" }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 468,
                              columnNumber: 29
                            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(Building2, { className: "w-8 h-8 text-gray-400" }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 471,
                              columnNumber: 41
                            }, this) }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 470,
                              columnNumber: 29
                            }, this) }, void 0, false, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 466,
                              columnNumber: 35
                            }, this),
                            /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
                              /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-900", children: language === "ar" ? gym.name_ar : gym.name_en }, void 0, false, {
                                fileName: "/app/src/pages/BookSession.jsx?raw=",
                                lineNumber: 476,
                                columnNumber: 37
                              }, this),
                              /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500 flex items-center gap-1", children: [
                                /* @__PURE__ */ jsxDEV(MapPin, { className: "w-3 h-3" }, void 0, false, {
                                  fileName: "/app/src/pages/BookSession.jsx?raw=",
                                  lineNumber: 480,
                                  columnNumber: 39
                                }, this),
                                gym.location
                              ] }, void 0, true, {
                                fileName: "/app/src/pages/BookSession.jsx?raw=",
                                lineNumber: 479,
                                columnNumber: 37
                              }, this),
                              gym.price_per_session && /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-emerald-600 font-medium mt-1", children: [
                                gym.price_per_session,
                                " ",
                                language === "ar" ? "ريال/جلسة" : "SAR/session"
                              ] }, void 0, true, {
                                fileName: "/app/src/pages/BookSession.jsx?raw=",
                                lineNumber: 484,
                                columnNumber: 29
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/src/pages/BookSession.jsx?raw=",
                              lineNumber: 475,
                              columnNumber: 35
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/src/pages/BookSession.jsx?raw=",
                            lineNumber: 465,
                            columnNumber: 33
                          }, this)
                        },
                        gym.id,
                        false,
                        {
                          fileName: "/app/src/pages/BookSession.jsx?raw=",
                          lineNumber: 456,
                          columnNumber: 23
                        },
                        this
                      )
                    ) }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 454,
                      columnNumber: 21
                    }, this) : /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 text-center py-4", children: language === "ar" ? "لا توجد نوادي متاحة لهذه الرياضة" : "No gyms available for this sport" }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 494,
                      columnNumber: 21
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 449,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxDEV(Button, { variant: "outline", onClick: () => setStep(2), children: language === "ar" ? "السابق" : "Back" }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 502,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      Button,
                      {
                        onClick: () => setStep(4),
                        disabled: formData.location_type === "home" ? !formData.home_location : !formData.gym_id,
                        className: "flex-1 bg-emerald-600 hover:bg-emerald-700",
                        children: language === "ar" ? "التالي" : "Next"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 505,
                        columnNumber: 23
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 501,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/src/pages/BookSession.jsx?raw=",
                lineNumber: 378,
                columnNumber: 17
              },
              this
            ),
            step === 4 && /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                className: "space-y-6",
                children: [
                  /* @__PURE__ */ jsxDEV("div", { children: [
                    /* @__PURE__ */ jsxDEV(Label, { children: t("notes") }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 528,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      Textarea,
                      {
                        value: formData.notes,
                        onChange: (e) => setFormData((prev) => ({ ...prev, notes: e.target.value })),
                        placeholder: language === "ar" ? "أي ملاحظات أو متطلبات خاصة..." : "Any notes or special requirements...",
                        rows: 4,
                        className: "mt-2"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 529,
                        columnNumber: 23
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 527,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "bg-gray-50 rounded-xl p-4 space-y-3", children: [
                    /* @__PURE__ */ jsxDEV("h4", { className: "font-semibold text-gray-700", children: language === "ar" ? "ملخص الحجز" : "Booking Summary" }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 540,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxDEV(SportIcon, { sport: formData.sport_type, size: "small" }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 544,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { children: t(`sports.${formData.sport_type}`) }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 545,
                        columnNumber: 25
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 543,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 text-gray-600", children: [
                      /* @__PURE__ */ jsxDEV(Calendar, { className: "w-5 h-5" }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 548,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { children: formData.session_date && format(formData.session_date, "PPP", { locale: language === "ar" ? ar : enUS }) }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 549,
                        columnNumber: 25
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 547,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 text-gray-600", children: [
                      /* @__PURE__ */ jsxDEV(Clock, { className: "w-5 h-5" }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 554,
                        columnNumber: 25
                      }, this),
                      /* @__PURE__ */ jsxDEV("span", { children: formData.session_time }, void 0, false, {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 555,
                        columnNumber: 25
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 553,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 539,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3", children: [
                    /* @__PURE__ */ jsxDEV(Button, { variant: "outline", onClick: () => setStep(3), children: language === "ar" ? "السابق" : "Back" }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 560,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      Button,
                      {
                        onClick: handleSubmit,
                        disabled: bookingMutation.isPending,
                        className: "flex-1 bg-emerald-600 hover:bg-emerald-700",
                        children: bookingMutation.isPending ? /* @__PURE__ */ jsxDEV(Loader2, { className: "w-5 h-5 animate-spin" }, void 0, false, {
                          fileName: "/app/src/pages/BookSession.jsx?raw=",
                          lineNumber: 569,
                          columnNumber: 23
                        }, this) : t("bookNow")
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 563,
                        columnNumber: 23
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 559,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/src/pages/BookSession.jsx?raw=",
                lineNumber: 522,
                columnNumber: 17
              },
              this
            ),
            step === 5 && /* @__PURE__ */ jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                className: "text-center py-8",
                children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-10 h-10 text-green-600" }, void 0, false, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 586,
                    columnNumber: 23
                  }, this) }, void 0, false, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 585,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: language === "ar" ? "تم الحجز بنجاح!" : "Booking Successful!" }, void 0, false, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 588,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 mb-6", children: language === "ar" ? "سيتم التواصل معك قريباً لتأكيد الموعد" : "We will contact you soon to confirm your session" }, void 0, false, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 591,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex gap-3 justify-center", children: [
                    /* @__PURE__ */ jsxDEV(Button, { onClick: () => setShowCard(true), variant: "outline", children: language === "ar" ? "عرض البطاقة" : "View Card" }, void 0, false, {
                      fileName: "/app/src/pages/BookSession.jsx?raw=",
                      lineNumber: 597,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      Button,
                      {
                        onClick: () => {
                          setStep(1);
                          setFormData({
                            sport_type: "",
                            trainer_id: "",
                            session_date: null,
                            session_time: "",
                            notes: "",
                            location_type: "home",
                            gym_id: "",
                            home_location: "",
                            home_latitude: null,
                            home_longitude: null
                          });
                          setMapPosition({ lat: 24.7136, lng: 46.6753 });
                        },
                        className: "bg-emerald-600 hover:bg-emerald-700",
                        children: language === "ar" ? "حجز جلسة أخرى" : "Book Another Session"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/pages/BookSession.jsx?raw=",
                        lineNumber: 600,
                        columnNumber: 23
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 596,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/src/pages/BookSession.jsx?raw=",
                lineNumber: 580,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 233,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/BookSession.jsx?raw=",
          lineNumber: 207,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/BookSession.jsx?raw=",
          lineNumber: 206,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(Card, { className: "shadow-lg border-0 sticky top-24", children: [
          /* @__PURE__ */ jsxDEV(CardHeader, { className: "border-b bg-gray-50/50", children: /* @__PURE__ */ jsxDEV(CardTitle, { className: "text-lg", children: t("myBookings") }, void 0, false, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 632,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 631,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(CardContent, { className: "p-4", children: !user ? /* @__PURE__ */ jsxDEV("div", { className: "text-center py-8", children: [
            /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 mb-4", children: language === "ar" ? "سجل دخولك لعرض حجوزاتك" : "Login to view your bookings" }, void 0, false, {
              fileName: "/app/src/pages/BookSession.jsx?raw=",
              lineNumber: 639,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV(Button, { onClick: () => base44.auth.redirectToLogin(), variant: "outline", children: t("login") }, void 0, false, {
              fileName: "/app/src/pages/BookSession.jsx?raw=",
              lineNumber: 642,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 638,
            columnNumber: 17
          }, this) : loadingBookings ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: [1, 2, 3].map(
            (i) => /* @__PURE__ */ jsxDEV("div", { className: "animate-pulse bg-gray-100 h-20 rounded-xl" }, i, false, {
              fileName: "/app/src/pages/BookSession.jsx?raw=",
              lineNumber: 649,
              columnNumber: 19
            }, this)
          ) }, void 0, false, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 647,
            columnNumber: 17
          }, this) : myBookings.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: myBookings.map(
            (booking) => /* @__PURE__ */ jsxDEV("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV(SportIcon, { sport: booking.sport_type, size: "small" }, void 0, false, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 658,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "font-medium text-sm", children: t(`sports.${booking.sport_type}`) }, void 0, false, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 659,
                    columnNumber: 29
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/BookSession.jsx?raw=",
                  lineNumber: 657,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV(Badge, { className: statusColors[booking.status], children: t(`status.${booking.status}`) }, void 0, false, {
                  fileName: "/app/src/pages/BookSession.jsx?raw=",
                  lineNumber: 663,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/BookSession.jsx?raw=",
                lineNumber: 656,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-500 space-y-1", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxDEV(Calendar, { className: "w-3 h-3" }, void 0, false, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 669,
                    columnNumber: 29
                  }, this),
                  booking.session_date
                ] }, void 0, true, {
                  fileName: "/app/src/pages/BookSession.jsx?raw=",
                  lineNumber: 668,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxDEV(Clock, { className: "w-3 h-3" }, void 0, false, {
                    fileName: "/app/src/pages/BookSession.jsx?raw=",
                    lineNumber: 673,
                    columnNumber: 29
                  }, this),
                  booking.session_time
                ] }, void 0, true, {
                  fileName: "/app/src/pages/BookSession.jsx?raw=",
                  lineNumber: 672,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/BookSession.jsx?raw=",
                lineNumber: 667,
                columnNumber: 25
              }, this)
            ] }, booking.id, true, {
              fileName: "/app/src/pages/BookSession.jsx?raw=",
              lineNumber: 655,
              columnNumber: 19
            }, this)
          ) }, void 0, false, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 653,
            columnNumber: 17
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "text-center py-8 text-gray-500", children: language === "ar" ? "لا توجد حجوزات بعد" : "No bookings yet" }, void 0, false, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 681,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 636,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/BookSession.jsx?raw=",
          lineNumber: 630,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/BookSession.jsx?raw=",
          lineNumber: 629,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/BookSession.jsx?raw=",
        lineNumber: 204,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Dialog, { open: showCard, onOpenChange: setShowCard, children: /* @__PURE__ */ jsxDEV(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxDEV(DialogHeader, { children: /* @__PURE__ */ jsxDEV(DialogTitle, { children: language === "ar" ? "بطاقة الحجز" : "Booking Card" }, void 0, false, {
          fileName: "/app/src/pages/BookSession.jsx?raw=",
          lineNumber: 694,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/BookSession.jsx?raw=",
          lineNumber: 693,
          columnNumber: 13
        }, this),
        createdBooking && /* @__PURE__ */ jsxDEV(
          PrintableBookingCard,
          {
            type: "session",
            data: {
              name: user?.full_name || "",
              phone: user?.phone || "",
              sport: t(`sports.${createdBooking.sport_type}`),
              trainer: selectedTrainer ? language === "ar" ? selectedTrainer.name_ar : selectedTrainer.name_en : "",
              date: createdBooking.session_date,
              time: createdBooking.session_time,
              duration: "60 " + (language === "ar" ? "دقيقة" : "minutes"),
              location_type: createdBooking.location_type,
              location: createdBooking.location_type === "home" ? createdBooking.home_location : selectedGym ? language === "ar" ? selectedGym.name_ar : selectedGym.name_en : "",
              booking_id: createdBooking.id
            }
          },
          void 0,
          false,
          {
            fileName: "/app/src/pages/BookSession.jsx?raw=",
            lineNumber: 699,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/src/pages/BookSession.jsx?raw=",
        lineNumber: 692,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/BookSession.jsx?raw=",
        lineNumber: 691,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/BookSession.jsx?raw=",
      lineNumber: 203,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/BookSession.jsx?raw=",
    lineNumber: 180,
    columnNumber: 5
  }, this);
}