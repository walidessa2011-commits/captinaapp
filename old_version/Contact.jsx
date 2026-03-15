function Contact() {
  _s();
  const { t, language } = useLanguage();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
        setFormData((prev) => ({
          ...prev,
          sender_name: userData.full_name || "",
          sender_email: userData.email || ""
        }));
      }
    };
    loadUser();
  }, []);
  const contactMutation = useMutation({
    mutationFn: (data) => base44.entities.ContactMessage.create(data),
    onSuccess: () => {
      setSubmitted(true);
      toast.success(language === "ar" ? "تم إرسال رسالتك بنجاح!" : "Message sent successfully!");
    }
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };
  const contactInfo = [
    {
      icon: Mail,
      title: language === "ar" ? "البريد الإلكتروني" : "Email",
      value: "info@saqrpro.com",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: Phone,
      title: language === "ar" ? "الهاتف" : "Phone",
      value: "+966 50 000 0000",
      color: "bg-amber-100 text-amber-600"
    },
    {
      icon: MapPin,
      title: language === "ar" ? "الموقع" : "Location",
      value: language === "ar" ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia",
      color: "bg-blue-100 text-blue-600"
    }
  ];
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen pt-24 pb-16", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-teal-900 to-teal-800 py-16 mb-8", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 text-center", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxDEV(MessageSquare, { className: "w-8 h-8 text-teal-950" }, void 0, false, {
            fileName: "/app/src/pages/Contact.jsx?raw=",
            lineNumber: 104,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/Contact.jsx?raw=",
            lineNumber: 103,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: t("contact") }, void 0, false, {
            fileName: "/app/src/pages/Contact.jsx?raw=",
            lineNumber: 106,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-teal-200/80 max-w-2xl mx-auto", children: language === "ar" ? "نحن هنا للإجابة على جميع استفساراتك ومساعدتك في رحلتك التدريبية" : "We are here to answer all your questions and help you on your training journey" }, void 0, false, {
            fileName: "/app/src/pages/Contact.jsx?raw=",
            lineNumber: 109,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/pages/Contact.jsx?raw=",
        lineNumber: 99,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/pages/Contact.jsx?raw=",
      lineNumber: 98,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/Contact.jsx?raw=",
      lineNumber: 97,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxDEV("div", { className: "grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [
        contactInfo.map(
          (info, index) => /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: index * 0.1 },
              children: /* @__PURE__ */ jsxDEV(Card, { className: "shadow-sm hover:shadow-md transition-shadow border-0", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-6 flex items-start gap-4", children: [
                /* @__PURE__ */ jsxDEV("div", { className: `w-12 h-12 rounded-xl ${info.color} flex items-center justify-center`, children: /* @__PURE__ */ jsxDEV(info.icon, { className: "w-6 h-6" }, void 0, false, {
                  fileName: "/app/src/pages/Contact.jsx?raw=",
                  lineNumber: 132,
                  columnNumber: 23
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/Contact.jsx?raw=",
                  lineNumber: 131,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV("h3", { className: "font-semibold text-gray-800 mb-1", children: info.title }, void 0, false, {
                    fileName: "/app/src/pages/Contact.jsx?raw=",
                    lineNumber: 135,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: info.value }, void 0, false, {
                    fileName: "/app/src/pages/Contact.jsx?raw=",
                    lineNumber: 136,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Contact.jsx?raw=",
                  lineNumber: 134,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Contact.jsx?raw=",
                lineNumber: 130,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/Contact.jsx?raw=",
                lineNumber: 129,
                columnNumber: 17
              }, this)
            },
            index,
            false,
            {
              fileName: "/app/src/pages/Contact.jsx?raw=",
              lineNumber: 123,
              columnNumber: 13
            },
            this
          )
        ),
        /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3 },
            children: /* @__PURE__ */ jsxDEV(Card, { className: "shadow-sm border-0 overflow-hidden", children: /* @__PURE__ */ jsxDEV("div", { className: "aspect-video bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxDEV(MapPin, { className: "w-12 h-12 text-emerald-600 mx-auto mb-2" }, void 0, false, {
                fileName: "/app/src/pages/Contact.jsx?raw=",
                lineNumber: 152,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-emerald-700 font-medium", children: language === "ar" ? "الرياض" : "Riyadh" }, void 0, false, {
                fileName: "/app/src/pages/Contact.jsx?raw=",
                lineNumber: 153,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Contact.jsx?raw=",
              lineNumber: 151,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/Contact.jsx?raw=",
              lineNumber: 150,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/Contact.jsx?raw=",
              lineNumber: 149,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "/app/src/pages/Contact.jsx?raw=",
            lineNumber: 144,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/src/pages/Contact.jsx?raw=",
        lineNumber: 121,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          children: /* @__PURE__ */ jsxDEV(Card, { className: "shadow-lg border-0", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-8", children: submitted ? /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              className: "text-center py-12",
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-10 h-10 text-green-600" }, void 0, false, {
                  fileName: "/app/src/pages/Contact.jsx?raw=",
                  lineNumber: 177,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/Contact.jsx?raw=",
                  lineNumber: 176,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: language === "ar" ? "شكراً لتواصلك!" : "Thank you for contacting us!" }, void 0, false, {
                  fileName: "/app/src/pages/Contact.jsx?raw=",
                  lineNumber: 179,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 mb-6", children: language === "ar" ? "سنقوم بالرد على رسالتك في أقرب وقت ممكن" : "We will respond to your message as soon as possible" }, void 0, false, {
                  fileName: "/app/src/pages/Contact.jsx?raw=",
                  lineNumber: 182,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Button,
                  {
                    onClick: () => {
                      setSubmitted(false);
                      setFormData({
                        sender_name: user?.full_name || "",
                        sender_email: user?.email || "",
                        subject: "",
                        message: ""
                      });
                    },
                    variant: "outline",
                    children: language === "ar" ? "إرسال رسالة أخرى" : "Send Another Message"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/Contact.jsx?raw=",
                    lineNumber: 187,
                    columnNumber: 23
                  },
                  this
                )
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/src/pages/Contact.jsx?raw=",
              lineNumber: 171,
              columnNumber: 19
            },
            this
          ) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
            /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: t("sendMessage") }, void 0, false, {
              fileName: "/app/src/pages/Contact.jsx?raw=",
              lineNumber: 204,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: t("yourName") }, void 0, false, {
                    fileName: "/app/src/pages/Contact.jsx?raw=",
                    lineNumber: 211,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Input,
                    {
                      value: formData.sender_name,
                      onChange: (e) => setFormData((prev) => ({ ...prev, sender_name: e.target.value })),
                      placeholder: language === "ar" ? "أدخل اسمك" : "Enter your name",
                      required: true,
                      className: "mt-2"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/Contact.jsx?raw=",
                      lineNumber: 212,
                      columnNumber: 29
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Contact.jsx?raw=",
                  lineNumber: 210,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: t("yourEmail") }, void 0, false, {
                    fileName: "/app/src/pages/Contact.jsx?raw=",
                    lineNumber: 222,
                    columnNumber: 29
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Input,
                    {
                      type: "email",
                      value: formData.sender_email,
                      onChange: (e) => setFormData((prev) => ({ ...prev, sender_email: e.target.value })),
                      placeholder: "email@example.com",
                      required: true,
                      className: "mt-2"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/Contact.jsx?raw=",
                      lineNumber: 223,
                      columnNumber: 29
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Contact.jsx?raw=",
                  lineNumber: 221,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Contact.jsx?raw=",
                lineNumber: 209,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: t("subject") }, void 0, false, {
                  fileName: "/app/src/pages/Contact.jsx?raw=",
                  lineNumber: 235,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Input,
                  {
                    value: formData.subject,
                    onChange: (e) => setFormData((prev) => ({ ...prev, subject: e.target.value })),
                    placeholder: language === "ar" ? "موضوع الرسالة" : "Message subject",
                    required: true,
                    className: "mt-2"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/Contact.jsx?raw=",
                    lineNumber: 236,
                    columnNumber: 27
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/Contact.jsx?raw=",
                lineNumber: 234,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: t("message") }, void 0, false, {
                  fileName: "/app/src/pages/Contact.jsx?raw=",
                  lineNumber: 246,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Textarea,
                  {
                    value: formData.message,
                    onChange: (e) => setFormData((prev) => ({ ...prev, message: e.target.value })),
                    placeholder: language === "ar" ? "اكتب رسالتك هنا..." : "Write your message here...",
                    rows: 6,
                    required: true,
                    className: "mt-2"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/Contact.jsx?raw=",
                    lineNumber: 247,
                    columnNumber: 27
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/Contact.jsx?raw=",
                lineNumber: 245,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV(
                Button,
                {
                  type: "submit",
                  disabled: contactMutation.isPending,
                  className: "w-full bg-emerald-600 hover:bg-emerald-700 py-6 text-lg",
                  children: contactMutation.isPending ? /* @__PURE__ */ jsxDEV(Loader2, { className: "w-5 h-5 animate-spin" }, void 0, false, {
                    fileName: "/app/src/pages/Contact.jsx?raw=",
                    lineNumber: 263,
                    columnNumber: 25
                  }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
                    /* @__PURE__ */ jsxDEV(Send, { className: "w-5 h-5 me-2" }, void 0, false, {
                      fileName: "/app/src/pages/Contact.jsx?raw=",
                      lineNumber: 266,
                      columnNumber: 31
                    }, this),
                    t("send")
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Contact.jsx?raw=",
                    lineNumber: 265,
                    columnNumber: 25
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/src/pages/Contact.jsx?raw=",
                  lineNumber: 257,
                  columnNumber: 25
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/pages/Contact.jsx?raw=",
              lineNumber: 208,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/Contact.jsx?raw=",
            lineNumber: 203,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/Contact.jsx?raw=",
            lineNumber: 169,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/Contact.jsx?raw=",
            lineNumber: 168,
            columnNumber: 15
          }, this)
        },
        void 0,
        false,
        {
          fileName: "/app/src/pages/Contact.jsx?raw=",
          lineNumber: 164,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/src/pages/Contact.jsx?raw=",
        lineNumber: 163,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/Contact.jsx?raw=",
      lineNumber: 119,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/Contact.jsx?raw=",
      lineNumber: 118,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/Contact.jsx?raw=",
    lineNumber: 95,
    columnNumber: 5
  }, this);
}