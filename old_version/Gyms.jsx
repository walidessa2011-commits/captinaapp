function Gyms() {
  _s();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingGym, setEditingGym] = useState(null);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    description_ar: "",
    description_en: "",
    location: "",
    latitude: 24.7136,
    longitude: 46.6753,
    phone: "",
    available_sports: [],
    facilities_ar: [],
    facilities_en: [],
    price_per_session: "",
    imageFile: null,
    is_active: true
  });
  const [facilityInput, setFacilityInput] = useState({ ar: "", en: "" });
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
  const { data: gyms = [], isLoading } = useQuery({
    queryKey: ["gyms"],
    queryFn: () => base44.entities.Gym.list("-created_date")
  });
  const saveGymMutation = useMutation({
    mutationFn: async (data) => {
      let imageUrl = editingGym?.image;
      if (data.imageFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: data.imageFile });
        imageUrl = file_url;
      }
      const gymPayload = {
        name_ar: data.name_ar,
        name_en: data.name_en,
        description_ar: data.description_ar,
        description_en: data.description_en,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        phone: data.phone,
        available_sports: data.available_sports,
        facilities_ar: data.facilities_ar,
        facilities_en: data.facilities_en,
        price_per_session: parseFloat(data.price_per_session) || null,
        image: imageUrl,
        is_active: data.is_active
      };
      if (editingGym?.id) {
        return base44.entities.Gym.update(editingGym.id, gymPayload);
      } else {
        return base44.entities.Gym.create(gymPayload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gyms"] });
      setEditDialogOpen(false);
      setEditingGym(null);
      resetForm();
      toast.success(language === "ar" ? "تم حفظ النادي بنجاح" : "Gym saved successfully");
    }
  });
  const deleteGymMutation = useMutation({
    mutationFn: (id) => base44.entities.Gym.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gyms"] });
      toast.success(language === "ar" ? "تم حذف النادي" : "Gym deleted");
    }
  });
  const resetForm = () => {
    setFormData({
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      location: "",
      latitude: 24.7136,
      longitude: 46.6753,
      phone: "",
      available_sports: [],
      facilities_ar: [],
      facilities_en: [],
      price_per_session: "",
      imageFile: null,
      is_active: true
    });
    setFacilityInput({ ar: "", en: "" });
  };
  const handleEdit = (gym) => {
    setEditingGym(gym);
    setFormData({
      name_ar: gym.name_ar || "",
      name_en: gym.name_en || "",
      description_ar: gym.description_ar || "",
      description_en: gym.description_en || "",
      location: gym.location || "",
      latitude: gym.latitude || 24.7136,
      longitude: gym.longitude || 46.6753,
      phone: gym.phone || "",
      available_sports: gym.available_sports || [],
      facilities_ar: gym.facilities_ar || [],
      facilities_en: gym.facilities_en || [],
      price_per_session: gym.price_per_session || "",
      imageFile: null,
      is_active: gym.is_active !== false
    });
    setEditDialogOpen(true);
  };
  const handleSave = () => {
    if (!formData.name_ar || !formData.name_en || !formData.location) {
      toast.error(language === "ar" ? "الرجاء إدخال الحقول المطلوبة" : "Please fill required fields");
      return;
    }
    saveGymMutation.mutate(formData);
  };
  const toggleSport = (sport) => {
    setFormData((prev) => ({
      ...prev,
      available_sports: prev.available_sports.includes(sport) ? prev.available_sports.filter((s) => s !== sport) : [...prev.available_sports, sport]
    }));
  };
  const addFacility = () => {
    if (facilityInput.ar && facilityInput.en) {
      setFormData((prev) => ({
        ...prev,
        facilities_ar: [...prev.facilities_ar, facilityInput.ar],
        facilities_en: [...prev.facilities_en, facilityInput.en]
      }));
      setFacilityInput({ ar: "", en: "" });
    }
  };
  const removeFacility = (index) => {
    setFormData((prev) => ({
      ...prev,
      facilities_ar: prev.facilities_ar.filter((_, i) => i !== index),
      facilities_en: prev.facilities_en.filter((_, i) => i !== index)
    }));
  };
  const isAdmin = user?.role === "admin" || user?.user_type === "trainer";
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen pt-24 pb-16 bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "bg-gradient-to-br from-emerald-900 to-emerald-800 py-16 mb-8", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 text-center", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxDEV(Building2, { className: "w-8 h-8 text-emerald-950" }, void 0, false, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 226,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 225,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: language === "ar" ? "النوادي المتعاونة" : "Partner Gyms" }, void 0, false, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 228,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-emerald-200/80 max-w-2xl mx-auto", children: language === "ar" ? "تعرف على النوادي الرياضية المتعاونة معنا" : "Discover our partner gyms and training facilities" }, void 0, false, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 231,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/pages/Gyms.jsx?raw=",
        lineNumber: 221,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/pages/Gyms.jsx?raw=",
      lineNumber: 220,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/Gyms.jsx?raw=",
      lineNumber: 219,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4", children: [
      isAdmin && /* @__PURE__ */ jsxDEV("div", { className: "mb-6 flex justify-end", children: /* @__PURE__ */ jsxDEV(
        Button,
        {
          onClick: () => {
            setEditingGym(null);
            resetForm();
            setEditDialogOpen(true);
          },
          className: "bg-emerald-600 hover:bg-emerald-700",
          children: [
            /* @__PURE__ */ jsxDEV(Plus, { className: "w-4 h-4 me-2" }, void 0, false, {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 251,
              columnNumber: 15
            }, this),
            language === "ar" ? "إضافة نادي" : "Add Gym"
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 243,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "/app/src/pages/Gyms.jsx?raw=",
        lineNumber: 242,
        columnNumber: 9
      }, this),
      isLoading ? /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: [1, 2, 3].map(
        (i) => /* @__PURE__ */ jsxDEV("div", { className: "animate-pulse bg-white rounded-xl h-64" }, i, false, {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 260,
          columnNumber: 11
        }, this)
      ) }, void 0, false, {
        fileName: "/app/src/pages/Gyms.jsx?raw=",
        lineNumber: 258,
        columnNumber: 9
      }, this) : gyms.length === 0 ? /* @__PURE__ */ jsxDEV(Card, { className: "text-center py-12", children: [
        /* @__PURE__ */ jsxDEV(Building2, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }, void 0, false, {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 265,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500", children: language === "ar" ? "لا توجد نوادي حالياً" : "No gyms available" }, void 0, false, {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 266,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/Gyms.jsx?raw=",
        lineNumber: 264,
        columnNumber: 9
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: gyms.map(
        (gym) => /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            children: /* @__PURE__ */ jsxDEV(Card, { className: "h-full hover:shadow-lg transition-shadow", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "relative h-48 bg-gray-200 rounded-t-xl overflow-hidden", children: [
                gym.image ? /* @__PURE__ */ jsxDEV("img", { src: gym.image, alt: gym.name_ar, className: "w-full h-full object-cover" }, void 0, false, {
                  fileName: "/app/src/pages/Gyms.jsx?raw=",
                  lineNumber: 281,
                  columnNumber: 17
                }, this) : /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(Building2, { className: "w-16 h-16 text-gray-400" }, void 0, false, {
                  fileName: "/app/src/pages/Gyms.jsx?raw=",
                  lineNumber: 284,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/Gyms.jsx?raw=",
                  lineNumber: 283,
                  columnNumber: 17
                }, this),
                isAdmin && /* @__PURE__ */ jsxDEV("div", { className: "absolute top-2 end-2 flex gap-2", children: [
                  /* @__PURE__ */ jsxDEV(
                    Button,
                    {
                      size: "icon",
                      variant: "secondary",
                      onClick: () => handleEdit(gym),
                      className: "bg-white/90 hover:bg-white",
                      children: /* @__PURE__ */ jsxDEV(Edit, { className: "w-4 h-4" }, void 0, false, {
                        fileName: "/app/src/pages/Gyms.jsx?raw=",
                        lineNumber: 295,
                        columnNumber: 27
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/Gyms.jsx?raw=",
                      lineNumber: 289,
                      columnNumber: 25
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    Button,
                    {
                      size: "icon",
                      variant: "secondary",
                      onClick: () => {
                        if (confirm(language === "ar" ? "هل تريد حذف هذا النادي؟" : "Delete this gym?")) {
                          deleteGymMutation.mutate(gym.id);
                        }
                      },
                      className: "bg-white/90 hover:bg-white text-red-600",
                      children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-4 h-4" }, void 0, false, {
                        fileName: "/app/src/pages/Gyms.jsx?raw=",
                        lineNumber: 307,
                        columnNumber: 27
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/Gyms.jsx?raw=",
                      lineNumber: 297,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Gyms.jsx?raw=",
                  lineNumber: 288,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 279,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV(CardContent, { className: "p-5", children: [
                /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-bold mb-2", children: language === "ar" ? gym.name_ar : gym.name_en }, void 0, false, {
                  fileName: "/app/src/pages/Gyms.jsx?raw=",
                  lineNumber: 313,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 text-sm mb-4 line-clamp-2", children: language === "ar" ? gym.description_ar : gym.description_en }, void 0, false, {
                  fileName: "/app/src/pages/Gyms.jsx?raw=",
                  lineNumber: 316,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 mb-4", children: [
                  gym.location && /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-2 text-sm text-gray-600", children: [
                    /* @__PURE__ */ jsxDEV(MapPin, { className: "w-4 h-4 flex-shrink-0 mt-0.5" }, void 0, false, {
                      fileName: "/app/src/pages/Gyms.jsx?raw=",
                      lineNumber: 323,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { children: gym.location }, void 0, false, {
                      fileName: "/app/src/pages/Gyms.jsx?raw=",
                      lineNumber: 324,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Gyms.jsx?raw=",
                    lineNumber: 322,
                    columnNumber: 19
                  }, this),
                  gym.phone && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
                    /* @__PURE__ */ jsxDEV(Phone, { className: "w-4 h-4" }, void 0, false, {
                      fileName: "/app/src/pages/Gyms.jsx?raw=",
                      lineNumber: 329,
                      columnNumber: 27
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { children: gym.phone }, void 0, false, {
                      fileName: "/app/src/pages/Gyms.jsx?raw=",
                      lineNumber: 330,
                      columnNumber: 27
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Gyms.jsx?raw=",
                    lineNumber: 328,
                    columnNumber: 19
                  }, this),
                  gym.price_per_session && /* @__PURE__ */ jsxDEV("div", { className: "text-emerald-600 font-semibold", children: [
                    gym.price_per_session,
                    " ",
                    language === "ar" ? "ريال/جلسة" : "SAR/session"
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Gyms.jsx?raw=",
                    lineNumber: 334,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Gyms.jsx?raw=",
                  lineNumber: 320,
                  columnNumber: 21
                }, this),
                gym.available_sports?.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap gap-2 mt-4", children: gym.available_sports.map(
                  (sport) => /* @__PURE__ */ jsxDEV(Badge, { variant: "outline", className: "gap-1", children: [
                    /* @__PURE__ */ jsxDEV(SportIcon, { sport, size: "small", showBg: false }, void 0, false, {
                      fileName: "/app/src/pages/Gyms.jsx?raw=",
                      lineNumber: 344,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("span", { className: "text-xs", children: t(`sports.${sport}`) }, void 0, false, {
                      fileName: "/app/src/pages/Gyms.jsx?raw=",
                      lineNumber: 345,
                      columnNumber: 29
                    }, this)
                  ] }, sport, true, {
                    fileName: "/app/src/pages/Gyms.jsx?raw=",
                    lineNumber: 343,
                    columnNumber: 19
                  }, this)
                ) }, void 0, false, {
                  fileName: "/app/src/pages/Gyms.jsx?raw=",
                  lineNumber: 341,
                  columnNumber: 17
                }, this),
                gym.latitude && gym.longitude && /* @__PURE__ */ jsxDEV("div", { className: "mt-4 h-32 rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxDEV(
                  MapContainer,
                  {
                    center: [gym.latitude, gym.longitude],
                    zoom: 15,
                    style: { height: "100%", width: "100%" },
                    scrollWheelZoom: false,
                    dragging: false,
                    children: [
                      /* @__PURE__ */ jsxDEV(TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }, void 0, false, {
                        fileName: "/app/src/pages/Gyms.jsx?raw=",
                        lineNumber: 360,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDEV(Marker, { position: [gym.latitude, gym.longitude] }, void 0, false, {
                        fileName: "/app/src/pages/Gyms.jsx?raw=",
                        lineNumber: 361,
                        columnNumber: 27
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/src/pages/Gyms.jsx?raw=",
                    lineNumber: 353,
                    columnNumber: 25
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/src/pages/Gyms.jsx?raw=",
                  lineNumber: 352,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 312,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 278,
              columnNumber: 17
            }, this)
          },
          gym.id,
          false,
          {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 273,
            columnNumber: 11
          },
          this
        )
      ) }, void 0, false, {
        fileName: "/app/src/pages/Gyms.jsx?raw=",
        lineNumber: 271,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/Gyms.jsx?raw=",
      lineNumber: 240,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Dialog, { open: editDialogOpen, onOpenChange: setEditDialogOpen, children: /* @__PURE__ */ jsxDEV(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxDEV(DialogHeader, { children: /* @__PURE__ */ jsxDEV(DialogTitle, { children: editingGym ? language === "ar" ? "تعديل النادي" : "Edit Gym" : language === "ar" ? "إضافة نادي جديد" : "Add New Gym" }, void 0, false, {
        fileName: "/app/src/pages/Gyms.jsx?raw=",
        lineNumber: 377,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/Gyms.jsx?raw=",
        lineNumber: 376,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 mt-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الاسم (عربي)" : "Name (Arabic)" }, void 0, false, {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 387,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                value: formData.name_ar,
                onChange: (e) => setFormData({ ...formData, name_ar: e.target.value })
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 388,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 386,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الاسم (إنجليزي)" : "Name (English)" }, void 0, false, {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 394,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                value: formData.name_en,
                onChange: (e) => setFormData({ ...formData, name_en: e.target.value })
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 395,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 393,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 385,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الوصف (عربي)" : "Description (Arabic)" }, void 0, false, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 403,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            Textarea,
            {
              value: formData.description_ar,
              onChange: (e) => setFormData({ ...formData, description_ar: e.target.value }),
              rows: 3
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 404,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 402,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الوصف (إنجليزي)" : "Description (English)" }, void 0, false, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 412,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            Textarea,
            {
              value: formData.description_en,
              onChange: (e) => setFormData({ ...formData, description_en: e.target.value }),
              rows: 3
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 413,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 411,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "العنوان" : "Address" }, void 0, false, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 421,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            Input,
            {
              value: formData.location,
              onChange: (e) => setFormData({ ...formData, location: e.target.value })
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 422,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 420,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "خط العرض" : "Latitude" }, void 0, false, {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 430,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                type: "number",
                step: "any",
                value: formData.latitude,
                onChange: (e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 431,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 429,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "خط الطول" : "Longitude" }, void 0, false, {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 439,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                type: "number",
                step: "any",
                value: formData.longitude,
                onChange: (e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 440,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 438,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 428,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "رقم الهاتف" : "Phone" }, void 0, false, {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 451,
              columnNumber: 17
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
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 452,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 450,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "سعر الجلسة" : "Price per Session" }, void 0, false, {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 458,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                type: "number",
                value: formData.price_per_session,
                onChange: (e) => setFormData({ ...formData, price_per_session: e.target.value })
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 459,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 457,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 449,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "صورة النادي" : "Gym Image" }, void 0, false, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 468,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            Input,
            {
              type: "file",
              accept: "image/*",
              onChange: (e) => setFormData({ ...formData, imageFile: e.target.files[0] })
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 469,
              columnNumber: 15
            },
            this
          ),
          (editingGym?.image || formData.imageFile) && /* @__PURE__ */ jsxDEV(
            "img",
            {
              src: formData.imageFile ? URL.createObjectURL(formData.imageFile) : editingGym.image,
              alt: "Preview",
              className: "mt-2 w-full h-40 object-cover rounded-lg"
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 475,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 467,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV(Label, { className: "mb-2 block", children: language === "ar" ? "الرياضات المتاحة" : "Available Sports" }, void 0, false, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 484,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-3 gap-2", children: allSports.map(
            (sport) => /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                onClick: () => toggleSport(sport),
                className: `p-2 rounded-lg border-2 transition-all text-xs ${formData.available_sports.includes(sport) ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`,
                children: [
                  /* @__PURE__ */ jsxDEV(SportIcon, { sport, size: "small" }, void 0, false, {
                    fileName: "/app/src/pages/Gyms.jsx?raw=",
                    lineNumber: 497,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "mt-1", children: t(`sports.${sport}`) }, void 0, false, {
                    fileName: "/app/src/pages/Gyms.jsx?raw=",
                    lineNumber: 498,
                    columnNumber: 21
                  }, this)
                ]
              },
              sport,
              true,
              {
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 487,
                columnNumber: 17
              },
              this
            )
          ) }, void 0, false, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 485,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 483,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "المرافق" : "Facilities" }, void 0, false, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 505,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-2 mb-3", children: formData.facilities_ar.map(
            (facility, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 p-2 bg-gray-50 rounded", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "flex-1 text-sm", children: facility }, void 0, false, {
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 509,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: () => removeFacility(idx),
                  className: "text-red-600",
                  children: /* @__PURE__ */ jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
                    fileName: "/app/src/pages/Gyms.jsx?raw=",
                    lineNumber: 516,
                    columnNumber: 23
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/src/pages/Gyms.jsx?raw=",
                  lineNumber: 510,
                  columnNumber: 21
                },
                this
              )
            ] }, idx, true, {
              fileName: "/app/src/pages/Gyms.jsx?raw=",
              lineNumber: 508,
              columnNumber: 17
            }, this)
          ) }, void 0, false, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 506,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                placeholder: language === "ar" ? "مرفق جديد (عربي)" : "New facility (Arabic)",
                value: facilityInput.ar,
                onChange: (e) => setFacilityInput({ ...facilityInput, ar: e.target.value })
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 522,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                placeholder: language === "ar" ? "مرفق جديد (إنجليزي)" : "New facility (English)",
                value: facilityInput.en,
                onChange: (e) => setFacilityInput({ ...facilityInput, en: e.target.value })
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 527,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(
              Button,
              {
                onClick: addFacility,
                variant: "outline",
                className: "w-full",
                children: language === "ar" ? "إضافة مرفق" : "Add Facility"
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/Gyms.jsx?raw=",
                lineNumber: 532,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 521,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/Gyms.jsx?raw=",
          lineNumber: 504,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            onClick: handleSave,
            disabled: saveGymMutation.isPending,
            className: "w-full bg-emerald-600 hover:bg-emerald-700",
            children: saveGymMutation.isPending ? language === "ar" ? "جاري الحفظ..." : "Saving..." : language === "ar" ? "حفظ" : "Save"
          },
          void 0,
          false,
          {
            fileName: "/app/src/pages/Gyms.jsx?raw=",
            lineNumber: 542,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/src/pages/Gyms.jsx?raw=",
        lineNumber: 384,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/Gyms.jsx?raw=",
      lineNumber: 375,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/Gyms.jsx?raw=",
      lineNumber: 374,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/Gyms.jsx?raw=",
    lineNumber: 217,
    columnNumber: 5
  }, this);
}