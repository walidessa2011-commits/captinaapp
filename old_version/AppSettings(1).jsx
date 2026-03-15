function AppSettings() {
  _s();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    logo_url: "",
    app_name_ar: "",
    app_name_en: ""
  });
  useEffect(() => {
    const loadUser = async () => {
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin();
        return;
      }
      const userData = await base44.auth.me();
      if (userData.role !== "admin") {
        window.location.href = "/";
        return;
      }
      setUser(userData);
    };
    loadUser();
  }, []);
  const { data: settings } = useQuery({
    queryKey: ["appSettings"],
    queryFn: async () => {
      const result = await base44.entities.AppSettings.filter({ setting_key: "main" });
      return result[0];
    }
  });
  useEffect(() => {
    if (settings) {
      setFormData({
        logo_url: settings.logo_url || "",
        app_name_ar: settings.app_name_ar || "",
        app_name_en: settings.app_name_en || ""
      });
    }
  }, [settings]);
  const updateSettingsMutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        return base44.entities.AppSettings.update(settings.id, data);
      } else {
        return base44.entities.AppSettings.create({ setting_key: "main", ...data });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appSettings"] });
      toast.success(language === "ar" ? "تم حفظ الإعدادات بنجاح!" : "Settings saved successfully!");
    }
  });
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, logo_url: file_url });
      toast.success(language === "ar" ? "تم رفع اللوجو بنجاح!" : "Logo uploaded successfully!");
    } catch (error) {
      toast.error(language === "ar" ? "فشل رفع اللوجو" : "Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };
  const handleSave = () => {
    updateSettingsMutation.mutate(formData);
  };
  if (!user) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" }, void 0, false, {
      fileName: "/app/src/pages/AppSettings.jsx?raw=",
      lineNumber: 115,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/AppSettings.jsx?raw=",
      lineNumber: 114,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50 py-20", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 max-w-4xl", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxDEV(Settings, { className: "w-8 h-8 text-emerald-600" }, void 0, false, {
          fileName: "/app/src/pages/AppSettings.jsx?raw=",
          lineNumber: 125,
          columnNumber: 13
        }, this),
        language === "ar" ? "إعدادات التطبيق" : "App Settings"
      ] }, void 0, true, {
        fileName: "/app/src/pages/AppSettings.jsx?raw=",
        lineNumber: 124,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 mt-2", children: language === "ar" ? "قم بتخصيص مظهر التطبيق" : "Customize your app appearance" }, void 0, false, {
        fileName: "/app/src/pages/AppSettings.jsx?raw=",
        lineNumber: 128,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/AppSettings.jsx?raw=",
      lineNumber: 123,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(Card, { children: [
      /* @__PURE__ */ jsxDEV(CardHeader, { children: /* @__PURE__ */ jsxDEV(CardTitle, { children: language === "ar" ? "الشعار والعلامة التجارية" : "Logo & Branding" }, void 0, false, {
        fileName: "/app/src/pages/AppSettings.jsx?raw=",
        lineNumber: 135,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/AppSettings.jsx?raw=",
        lineNumber: 134,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "شعار التطبيق" : "App Logo" }, void 0, false, {
            fileName: "/app/src/pages/AppSettings.jsx?raw=",
            lineNumber: 139,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "mt-2 flex items-center gap-4", children: [
            formData.logo_url && /* @__PURE__ */ jsxDEV(
              "img",
              {
                src: formData.logo_url,
                alt: "Logo",
                className: "w-24 h-24 object-contain border rounded-lg p-2"
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/AppSettings.jsx?raw=",
                lineNumber: 142,
                columnNumber: 17
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxDEV(
                Input,
                {
                  type: "file",
                  accept: "image/*",
                  onChange: handleLogoUpload,
                  disabled: uploading,
                  className: "mb-2"
                },
                void 0,
                false,
                {
                  fileName: "/app/src/pages/AppSettings.jsx?raw=",
                  lineNumber: 149,
                  columnNumber: 19
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-500", children: language === "ar" ? "يفضل استخدام صورة PNG شفافة بحجم 512x512 بكسل" : "Recommended: Transparent PNG, 512x512px" }, void 0, false, {
                fileName: "/app/src/pages/AppSettings.jsx?raw=",
                lineNumber: 156,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/AppSettings.jsx?raw=",
              lineNumber: 148,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/AppSettings.jsx?raw=",
            lineNumber: 140,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/AppSettings.jsx?raw=",
          lineNumber: 138,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "رابط اللوجو (اختياري)" : "Logo URL (Optional)" }, void 0, false, {
            fileName: "/app/src/pages/AppSettings.jsx?raw=",
            lineNumber: 166,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            Input,
            {
              value: formData.logo_url,
              onChange: (e) => setFormData({ ...formData, logo_url: e.target.value }),
              placeholder: "https://example.com/logo.png"
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/AppSettings.jsx?raw=",
              lineNumber: 167,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/pages/AppSettings.jsx?raw=",
          lineNumber: 165,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "اسم التطبيق (عربي)" : "App Name (Arabic)" }, void 0, false, {
              fileName: "/app/src/pages/AppSettings.jsx?raw=",
              lineNumber: 176,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                value: formData.app_name_ar,
                onChange: (e) => setFormData({ ...formData, app_name_ar: e.target.value }),
                placeholder: "كوتشينا"
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/AppSettings.jsx?raw=",
                lineNumber: 177,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/AppSettings.jsx?raw=",
            lineNumber: 175,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "اسم التطبيق (إنجليزي)" : "App Name (English)" }, void 0, false, {
              fileName: "/app/src/pages/AppSettings.jsx?raw=",
              lineNumber: 184,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(
              Input,
              {
                value: formData.app_name_en,
                onChange: (e) => setFormData({ ...formData, app_name_en: e.target.value }),
                placeholder: "Coachinaa"
              },
              void 0,
              false,
              {
                fileName: "/app/src/pages/AppSettings.jsx?raw=",
                lineNumber: 185,
                columnNumber: 17
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/src/pages/AppSettings.jsx?raw=",
            lineNumber: 183,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/AppSettings.jsx?raw=",
          lineNumber: 174,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            onClick: handleSave,
            disabled: updateSettingsMutation.isPending,
            className: "w-full bg-emerald-600 hover:bg-emerald-700",
            children: [
              /* @__PURE__ */ jsxDEV(Save, { className: "w-4 h-4 me-2" }, void 0, false, {
                fileName: "/app/src/pages/AppSettings.jsx?raw=",
                lineNumber: 198,
                columnNumber: 15
              }, this),
              updateSettingsMutation.isPending ? language === "ar" ? "جاري الحفظ..." : "Saving..." : language === "ar" ? "حفظ الإعدادات" : "Save Settings"
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/src/pages/AppSettings.jsx?raw=",
            lineNumber: 193,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/src/pages/AppSettings.jsx?raw=",
        lineNumber: 137,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/AppSettings.jsx?raw=",
      lineNumber: 133,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/AppSettings.jsx?raw=",
    lineNumber: 122,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/pages/AppSettings.jsx?raw=",
    lineNumber: 121,
    columnNumber: 5
  }, this);
}