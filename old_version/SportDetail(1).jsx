function SportDetail() {
  _s();
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    media_type: "image",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    file: null
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    benefits_ar: [],
    benefits_en: [],
    imageFile: null
  });
  const [benefitInput, setBenefitInput] = useState({ ar: "", en: "" });
  const urlParams = new URLSearchParams(window.location.search);
  const sportType = urlParams.get("sport");
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
  const { data: sportData, isLoading: sportLoading } = useQuery({
    queryKey: ["sport", sportType],
    queryFn: async () => {
      const sports = await base44.entities.Sport.filter({ sport_type: sportType });
      return sports[0];
    },
    enabled: !!sportType
  });
  const sportInfo = {
    boxing: {
      title_ar: "الملاكمة",
      title_en: "Boxing",
      image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800",
      description_ar: "الملاكمة هي رياضة قتالية يتبارى فيها اثنان باستخدام قبضاتهما. تعتبر من أقدم الرياضات القتالية وأكثرها شعبية في العالم، حيث تجمع بين القوة البدنية والذكاء التكتيكي. تساعد الملاكمة على بناء جسم قوي ومتوازن، وتطور ردود الفعل السريعة والقدرة على التحمل.",
      description_en: "Boxing is a combat sport where two people fight using their fists. It is one of the oldest and most popular martial arts in the world, combining physical strength with tactical intelligence. Boxing helps build a strong and balanced body, develops quick reflexes and endurance.",
      benefits_ar: ["تحسين اللياقة البدنية والقوة العضلية", "تطوير ردود الفعل والسرعة", "بناء الثقة بالنفس والانضباط", "حرق السعرات الحرارية بفعالية"],
      benefits_en: ["Improve physical fitness and muscle strength", "Develop reflexes and speed", "Build self-confidence and discipline", "Burn calories effectively"]
    },
    karate: {
      title_ar: "الكاراتيه",
      title_en: "Karate",
      image: "https://images.unsplash.com/photo-1555597408-26bc8e548a46?w=800",
      description_ar: "الكاراتيه فن قتالي ياباني تقليدي يركز على الضربات واللكمات والركلات الدقيقة. يتميز بالتأكيد على الانضباط الذاتي والاحترام والتطور الروحي. الكاراتيه ليس مجرد رياضة قتالية، بل هو أسلوب حياة يعلم الصبر والمثابرة.",
      description_en: "Karate is a traditional Japanese martial art focusing on precise strikes, punches, and kicks. It emphasizes self-discipline, respect, and spiritual development. Karate is not just a martial art, but a way of life that teaches patience and perseverance.",
      benefits_ar: ["تحسين التوازن والتنسيق الحركي", "زيادة المرونة والرشاقة", "تطوير التركيز الذهني والانضباط", "تعلم الدفاع عن النفس بفعالية"],
      benefits_en: ["Improve balance and coordination", "Increase flexibility and agility", "Develop mental focus and discipline", "Learn effective self-defense"]
    },
    taekwondo: {
      title_ar: "التايكوندو",
      title_en: "Taekwondo",
      image: "https://images.unsplash.com/photo-1555597408-48c77fd8b475?w=800",
      description_ar: "التايكوندو رياضة كورية عريقة تتميز بالركلات العالية والسريعة والحركات الاستعراضية المذهلة. أصبحت رياضة أولمبية رسمية وتحظى بشعبية عالمية واسعة. تركز على تطوير القوة في الساقين والمرونة الفائقة مع التأكيد على الروح الرياضية.",
      description_en: "Taekwondo is a prestigious Korean sport distinguished by high and fast kicks and spectacular movements. It became an official Olympic sport with worldwide popularity. It focuses on developing leg power and superior flexibility while emphasizing sportsmanship.",
      benefits_ar: ["تقوية عضلات الساقين بشكل استثنائي", "تحسين المرونة والتوازن", "تطوير السرعة والرشاقة", "بناء الروح الرياضية والثقة"],
      benefits_en: ["Exceptionally strengthen leg muscles", "Improve flexibility and balance", "Develop speed and agility", "Build sportsmanship and confidence"]
    },
    judo: {
      title_ar: "الجودو",
      title_en: "Judo",
      image: "https://images.unsplash.com/photo-1559232744-bd84fdcf14e6?w=800",
      description_ar: "الجودو فن قتالي ياباني يعتمد على الرميات والإمساك والتقنيات الأرضية. فلسفة الجودو تقوم على استخدام قوة الخصم ضده بدلاً من المواجهة المباشرة. يطور الجودو القوة الذهنية والبدنية معاً، ويعلم احترام الخصم والتواضع.",
      description_en: "Judo is a Japanese martial art based on throws, grappling, and ground techniques. The philosophy of Judo is about using the opponent's force against them rather than direct confrontation. Judo develops both mental and physical strength and teaches respect for opponents and humility.",
      benefits_ar: ["تطوير قوة الجسم الكاملة", "تحسين التوازن والتنسيق", "تعلم السقوط الآمن", "بناء الثقة والاحترام"],
      benefits_en: ["Develop full body strength", "Improve balance and coordination", "Learn safe falling techniques", "Build confidence and respect"]
    },
    muay_thai: {
      title_ar: "المواي تاي",
      title_en: "Muay Thai",
      image: "https://images.unsplash.com/photo-1605925163439-d61c1b0c0fa2?w=800",
      description_ar: 'المواي تاي هو الفن القتالي الوطني لتايلاند، المعروف بـ"فن الأطراف الثمانية" لاستخدامه القبضات والركلات والركب والمرافق. يتميز بقوته وفعاليته العالية، ويجمع بين التقنيات القتالية القديمة والتدريب الحديث لبناء مقاتلين أقوياء.',
      description_en: `Muay Thai is Thailand's national martial art, known as the "Art of Eight Limbs" for using fists, kicks, knees, and elbows. It is characterized by its high power and effectiveness, combining ancient fighting techniques with modern training to build strong fighters.`,
      benefits_ar: ["تحسين القوة الانفجارية", "زيادة التحمل البدني والعقلي", "تطوير المرونة والتنسيق", "حرق سعرات حرارية عالية"],
      benefits_en: ["Improve explosive power", "Increase physical and mental endurance", "Develop flexibility and coordination", "High calorie burning"]
    },
    mma: {
      title_ar: "الفنون القتالية المختلطة",
      title_en: "Mixed Martial Arts",
      image: "https://images.unsplash.com/photo-1561677843-39dee7a319ca?w=800",
      description_ar: "الـ MMA رياضة قتالية حديثة تجمع أفضل تقنيات من مختلف الفنون القتالية العالمية. تشمل الضرب والمصارعة والخنق والقتال الأرضي. أصبحت من أسرع الرياضات نمواً في العالم، حيث تتطلب مهارات شاملة ولياقة بدنية استثنائية.",
      description_en: "MMA is a modern combat sport combining the best techniques from various global martial arts. It includes striking, wrestling, submissions, and ground fighting. It has become one of the fastest-growing sports worldwide, requiring comprehensive skills and exceptional fitness.",
      benefits_ar: ["تطوير مهارات قتالية شاملة ومتنوعة", "تحسين اللياقة البدنية الكاملة", "تعلم استراتيجيات متعددة", "بناء القوة العقلية والثقة"],
      benefits_en: ["Develop comprehensive and diverse fighting skills", "Improve complete physical fitness", "Learn multiple strategies", "Build mental strength and confidence"]
    },
    wrestling: {
      title_ar: "المصارعة",
      title_en: "Wrestling",
      image: "https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=800",
      description_ar: "المصارعة من أقدم الرياضات القتالية في التاريخ، تعتمد على الإمساك والرميات والسيطرة على الخصم. تبني قوة بدنية هائلة وتحمل عالي. المصارعة رياضة أولمبية عريقة تجمع بين القوة والتقنية والذكاء التكتيكي.",
      description_en: "Wrestling is one of the oldest combat sports in history, based on grappling, throws, and controlling the opponent. It builds tremendous physical strength and high endurance. Wrestling is a prestigious Olympic sport combining strength, technique, and tactical intelligence.",
      benefits_ar: ["بناء القوة البدنية الهائلة", "تطوير التحمل والقدرة على التحكم", "تحسين التنسيق الحركي", "تعلم السيطرة الكاملة على الجسم"],
      benefits_en: ["Build tremendous physical strength", "Develop endurance and control", "Improve movement coordination", "Learn complete body control"]
    },
    jiu_jitsu: {
      title_ar: "الجيو جيتسو",
      title_en: "Brazilian Jiu-Jitsu",
      image: "https://images.unsplash.com/photo-1599307133254-d3f6c7f1e3f5?w=800",
      description_ar: "الجيو جيتسو البرازيلي فن قتالي يركز على القتال الأرضي والخنق والسيطرة. يعتمد على التقنية والذكاء أكثر من القوة الجسدية، مما يجعله مثالياً لجميع الأعمار والأحجام. يطور مهارات حل المشكلات والتفكير الاستراتيجي.",
      description_en: "Brazilian Jiu-Jitsu is a martial art focusing on ground fighting, submissions, and control. It relies on technique and intelligence more than physical strength, making it ideal for all ages and sizes. It develops problem-solving skills and strategic thinking.",
      benefits_ar: ["تطوير التفكير الاستراتيجي وحل المشكلات", "تحسين المرونة والتحكم", "تعلم الصبر والمثابرة", "بناء الثقة بالنفس والهدوء"],
      benefits_en: ["Develop strategic thinking and problem-solving", "Improve flexibility and control", "Learn patience and perseverance", "Build self-confidence and calmness"]
    },
    kickboxing: {
      title_ar: "الكيك بوكسينغ",
      title_en: "Kickboxing",
      image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800",
      description_ar: "الكيك بوكسينغ رياضة قتالية ديناميكية تجمع بين تقنيات الملاكمة القوية والركلات المتنوعة. تعتبر من أفضل الرياضات لحرق الدهون وبناء اللياقة البدنية الشاملة. تطور القوة والسرعة والتنسيق الحركي بشكل متوازن.",
      description_en: "Kickboxing is a dynamic combat sport combining powerful boxing techniques with diverse kicks. It is one of the best sports for fat burning and building comprehensive fitness. It develops power, speed, and movement coordination in a balanced way.",
      benefits_ar: ["حرق دهون عالي وفقدان وزن فعال", "تحسين القوة والسرعة معاً", "تطوير التنسيق الحركي", "تحسين صحة القلب والأوعية"],
      benefits_en: ["High fat burning and effective weight loss", "Improve both power and speed", "Develop movement coordination", "Improve cardiovascular health"]
    }
  };
  const defaultInfo = sportInfo[sportType] || sportInfo.boxing;
  const info = sportData || defaultInfo;
  useEffect(() => {
    if (sportData) {
      setEditForm({
        title_ar: sportData.title_ar || "",
        title_en: sportData.title_en || "",
        description_ar: sportData.description_ar || "",
        description_en: sportData.description_en || "",
        benefits_ar: sportData.benefits_ar || [],
        benefits_en: sportData.benefits_en || [],
        imageFile: null
      });
    } else if (defaultInfo) {
      setEditForm({
        title_ar: defaultInfo.title_ar || "",
        title_en: defaultInfo.title_en || "",
        description_ar: defaultInfo.description_ar || "",
        description_en: defaultInfo.description_en || "",
        benefits_ar: defaultInfo.benefits_ar || [],
        benefits_en: defaultInfo.benefits_en || [],
        imageFile: null
      });
    }
  }, [sportData, sportType]);
  const { data: gallery = [], isLoading: galleryLoading } = useQuery({
    queryKey: ["sportGallery", sportType],
    queryFn: () => base44.entities.SportGallery.filter({ sport_type: sportType }),
    enabled: !!sportType
  });
  const { data: trainers = [], isLoading: trainersLoading } = useQuery({
    queryKey: ["trainers", sportType],
    queryFn: async () => {
      const allTrainers = await base44.entities.Trainer.list();
      return allTrainers.filter((t2) => t2.specializations?.includes(sportType));
    },
    enabled: !!sportType
  });
  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ["sportVideos", sportType],
    queryFn: () => base44.entities.TrainingVideo.filter({ sport_type: sportType }),
    enabled: !!sportType
  });
  const saveSportMutation = useMutation({
    mutationFn: async (data) => {
      let imageUrl = sportData?.image || defaultInfo.image;
      if (data.imageFile) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: data.imageFile });
        imageUrl = file_url;
      }
      const sportPayload = {
        sport_type: sportType,
        title_ar: data.title_ar,
        title_en: data.title_en,
        description_ar: data.description_ar,
        description_en: data.description_en,
        benefits_ar: data.benefits_ar,
        benefits_en: data.benefits_en,
        image: imageUrl
      };
      if (sportData?.id) {
        return base44.entities.Sport.update(sportData.id, sportPayload);
      } else {
        return base44.entities.Sport.create(sportPayload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sport", sportType] });
      setEditDialogOpen(false);
      toast.success(language === "ar" ? "تم حفظ التغييرات بنجاح" : "Changes saved successfully");
    }
  });
  const uploadMutation = useMutation({
    mutationFn: async (data) => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: data.file });
      return base44.entities.SportGallery.create({
        sport_type: sportType,
        media_url: file_url,
        media_type: data.media_type,
        title_ar: data.title_ar,
        title_en: data.title_en,
        description_ar: data.description_ar,
        description_en: data.description_en
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sportGallery", sportType] });
      setUploadDialogOpen(false);
      setUploadForm({
        media_type: "image",
        title_ar: "",
        title_en: "",
        description_ar: "",
        description_en: "",
        file: null
      });
      toast.success(language === "ar" ? "تم رفع الملف بنجاح" : "File uploaded successfully");
    }
  });
  const handleUpload = () => {
    if (!uploadForm.file) {
      toast.error(language === "ar" ? "الرجاء اختيار ملف" : "Please select a file");
      return;
    }
    uploadMutation.mutate(uploadForm);
  };
  const handleSaveSport = () => {
    if (!editForm.title_ar || !editForm.title_en) {
      toast.error(language === "ar" ? "الرجاء إدخال العنوان بالعربية والإنجليزية" : "Please enter title in both Arabic and English");
      return;
    }
    saveSportMutation.mutate(editForm);
  };
  const addBenefit = () => {
    if (benefitInput.ar && benefitInput.en) {
      setEditForm({
        ...editForm,
        benefits_ar: [...editForm.benefits_ar, benefitInput.ar],
        benefits_en: [...editForm.benefits_en, benefitInput.en]
      });
      setBenefitInput({ ar: "", en: "" });
    }
  };
  const removeBenefit = (index) => {
    setEditForm({
      ...editForm,
      benefits_ar: editForm.benefits_ar.filter((_, i) => i !== index),
      benefits_en: editForm.benefits_en.filter((_, i) => i !== index)
    });
  };
  const isTrainer = user?.user_type === "trainer" || user?.role === "admin";
  const title = language === "ar" ? info.title_ar : info.title_en;
  const description = language === "ar" ? info.description_ar : info.description_en;
  const benefits = language === "ar" ? info.benefits_ar : info.benefits_en;
  const colors = sportColors[sportType] || sportColors.boxing;
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100", children: [
    /* @__PURE__ */ jsxDEV("div", { className: `${colors.bg} py-20`, children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "text-center",
        children: [
          /* @__PURE__ */ jsxDEV(SportIcon, { sport: sportType, size: "large", showBg: false, className: "mx-auto mb-6" }, void 0, false, {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 331,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h1", { className: "text-5xl font-bold text-black mb-4 drop-shadow-lg", children: title }, void 0, false, {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 332,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("p", { className: "text-xl text-black max-w-3xl mx-auto drop-shadow-md line-clamp-2 mb-8", children: description }, void 0, false, {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 333,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto", children: [
            /* @__PURE__ */ jsxDEV(Link, { to: createPageUrl("Subscribe"), className: "w-full sm:w-auto", children: /* @__PURE__ */ jsxDEV(Button, { size: "lg", className: "w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg", children: [
              /* @__PURE__ */ jsxDEV(CreditCard, { className: "w-5 h-5 me-2" }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 341,
                columnNumber: 19
              }, this),
              language === "ar" ? "اشترك الآن" : "Subscribe Now"
            ] }, void 0, true, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 340,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 339,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(Link, { to: createPageUrl("BookSession"), className: "w-full sm:w-auto", children: /* @__PURE__ */ jsxDEV(Button, { size: "lg", variant: "outline", className: "w-full bg-white hover:bg-gray-50 border-2 border-black text-black shadow-lg", children: [
              /* @__PURE__ */ jsxDEV(Calendar, { className: "w-5 h-5 me-2" }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 347,
                columnNumber: 19
              }, this),
              language === "ar" ? "احجز حصتك التجريبية المجانية" : "Book Your Free Trial"
            ] }, void 0, true, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 346,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 345,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 338,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/src/pages/SportDetail.jsx?raw=",
        lineNumber: 326,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "/app/src/pages/SportDetail.jsx?raw=",
      lineNumber: 325,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/SportDetail.jsx?raw=",
      lineNumber: 324,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 py-12", children: /* @__PURE__ */ jsxDEV(Tabs, { defaultValue: "about", className: "space-y-8", children: [
      /* @__PURE__ */ jsxDEV(TabsList, { className: "grid w-full grid-cols-4 bg-white border-2 border-gray-200 p-2 rounded-xl shadow-lg max-w-3xl mx-auto h-auto", children: [
        /* @__PURE__ */ jsxDEV(
          TabsTrigger,
          {
            value: "about",
            className: "data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg font-semibold py-3 transition-all",
            children: language === "ar" ? "نبذة" : "About"
          },
          void 0,
          false,
          {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 359,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          TabsTrigger,
          {
            value: "trainers",
            className: "data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg font-semibold py-3 transition-all",
            children: language === "ar" ? "المدربون" : "Trainers"
          },
          void 0,
          false,
          {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 365,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          TabsTrigger,
          {
            value: "gallery",
            className: "data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg font-semibold py-3 transition-all",
            children: language === "ar" ? "المعرض" : "Gallery"
          },
          void 0,
          false,
          {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 371,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          TabsTrigger,
          {
            value: "videos",
            className: "data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-lg font-semibold py-3 transition-all",
            children: language === "ar" ? "فيديوهات" : "Videos"
          },
          void 0,
          false,
          {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 377,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/src/pages/SportDetail.jsx?raw=",
        lineNumber: 358,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(TabsContent, { value: "about", children: [
        isTrainer && /* @__PURE__ */ jsxDEV("div", { className: "mb-6 flex justify-end", children: /* @__PURE__ */ jsxDEV(Dialog, { open: editDialogOpen, onOpenChange: setEditDialogOpen, children: [
          /* @__PURE__ */ jsxDEV(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxDEV(Button, { className: "bg-amber-500 hover:bg-amber-600", children: [
            /* @__PURE__ */ jsxDEV(Edit, { className: "w-4 h-4 me-2" }, void 0, false, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 392,
              columnNumber: 23
            }, this),
            language === "ar" ? "تعديل تفاصيل الرياضة" : "Edit Sport Details"
          ] }, void 0, true, {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 391,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 390,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
            /* @__PURE__ */ jsxDEV(DialogHeader, { children: /* @__PURE__ */ jsxDEV(DialogTitle, { children: language === "ar" ? "تعديل تفاصيل الرياضة" : "Edit Sport Details" }, void 0, false, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 398,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 397,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 mt-4", children: [
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "العنوان (عربي)" : "Title (Arabic)" }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 404,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Input,
                  {
                    value: editForm.title_ar,
                    onChange: (e) => setEditForm({ ...editForm, title_ar: e.target.value })
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 405,
                    columnNumber: 25
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 403,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "العنوان (إنجليزي)" : "Title (English)" }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 411,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Input,
                  {
                    value: editForm.title_en,
                    onChange: (e) => setEditForm({ ...editForm, title_en: e.target.value })
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 412,
                    columnNumber: 25
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 410,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الوصف (عربي)" : "Description (Arabic)" }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 418,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Textarea,
                  {
                    value: editForm.description_ar,
                    onChange: (e) => setEditForm({ ...editForm, description_ar: e.target.value }),
                    rows: 4
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 419,
                    columnNumber: 25
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 417,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الوصف (إنجليزي)" : "Description (English)" }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 426,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Textarea,
                  {
                    value: editForm.description_en,
                    onChange: (e) => setEditForm({ ...editForm, description_en: e.target.value }),
                    rows: 4
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 427,
                    columnNumber: 25
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 425,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "صورة الرياضة" : "Sport Image" }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 434,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Input,
                  {
                    type: "file",
                    accept: "image/*",
                    onChange: (e) => setEditForm({ ...editForm, imageFile: e.target.files[0] })
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 435,
                    columnNumber: 25
                  },
                  this
                ),
                (info.image || editForm.imageFile) && /* @__PURE__ */ jsxDEV(
                  "img",
                  {
                    src: editForm.imageFile ? URL.createObjectURL(editForm.imageFile) : info.image,
                    alt: "Preview",
                    className: "mt-2 w-full h-40 object-cover rounded-lg"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 441,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 433,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { children: [
                /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الفوائد" : "Benefits" }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 449,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "space-y-2", children: editForm.benefits_ar.map(
                  (benefit, idx) => /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 p-2 bg-gray-50 rounded", children: [
                    /* @__PURE__ */ jsxDEV("span", { className: "flex-1 text-sm", children: benefit }, void 0, false, {
                      fileName: "/app/src/pages/SportDetail.jsx?raw=",
                      lineNumber: 453,
                      columnNumber: 31
                    }, this),
                    /* @__PURE__ */ jsxDEV(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        onClick: () => removeBenefit(idx),
                        className: "text-red-600",
                        children: "✕"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/pages/SportDetail.jsx?raw=",
                        lineNumber: 454,
                        columnNumber: 31
                      },
                      this
                    )
                  ] }, idx, true, {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 452,
                    columnNumber: 25
                  }, this)
                ) }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 450,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "mt-3 space-y-2", children: [
                  /* @__PURE__ */ jsxDEV(
                    Input,
                    {
                      placeholder: language === "ar" ? "فائدة جديدة (عربي)" : "New benefit (Arabic)",
                      value: benefitInput.ar,
                      onChange: (e) => setBenefitInput({ ...benefitInput, ar: e.target.value })
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/SportDetail.jsx?raw=",
                      lineNumber: 466,
                      columnNumber: 27
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    Input,
                    {
                      placeholder: language === "ar" ? "فائدة جديدة (إنجليزي)" : "New benefit (English)",
                      value: benefitInput.en,
                      onChange: (e) => setBenefitInput({ ...benefitInput, en: e.target.value })
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/SportDetail.jsx?raw=",
                      lineNumber: 471,
                      columnNumber: 27
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    Button,
                    {
                      onClick: addBenefit,
                      variant: "outline",
                      className: "w-full",
                      children: language === "ar" ? "إضافة فائدة" : "Add Benefit"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/SportDetail.jsx?raw=",
                      lineNumber: 476,
                      columnNumber: 27
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 465,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 448,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV(
                Button,
                {
                  onClick: handleSaveSport,
                  disabled: saveSportMutation.isPending,
                  className: "w-full bg-emerald-600 hover:bg-emerald-700",
                  children: saveSportMutation.isPending ? language === "ar" ? "جاري الحفظ..." : "Saving..." : language === "ar" ? "حفظ التغييرات" : "Save Changes"
                },
                void 0,
                false,
                {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 485,
                  columnNumber: 23
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 402,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 396,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/SportDetail.jsx?raw=",
          lineNumber: 389,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "/app/src/pages/SportDetail.jsx?raw=",
          lineNumber: 388,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxDEV(Card, { className: "overflow-hidden", children: /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-0", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "relative h-64 md:h-auto", children: [
              /* @__PURE__ */ jsxDEV(
                "img",
                {
                  src: info.image,
                  alt: title,
                  className: "w-full h-full object-cover"
                },
                void 0,
                false,
                {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 502,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 507,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 501,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(CardContent, { className: "p-8 flex flex-col justify-center bg-white", children: [
              /* @__PURE__ */ jsxDEV("h2", { className: "text-3xl font-bold text-gray-900 mb-4", children: language === "ar" ? "نبذة عن الرياضة" : "About the Sport" }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 510,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-black leading-relaxed text-lg font-medium", children: description }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 513,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 509,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 500,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 499,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(Card, { children: [
            /* @__PURE__ */ jsxDEV(CardHeader, { children: /* @__PURE__ */ jsxDEV(CardTitle, { className: "text-2xl", children: language === "ar" ? "فوائد التدريب" : "Training Benefits" }, void 0, false, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 523,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 522,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV(CardContent, { children: /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6", children: benefits.map(
              (benefit, idx) => /* @__PURE__ */ jsxDEV(
                motion.div,
                {
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: idx * 0.1 },
                  className: "flex items-start gap-3 p-4 bg-emerald-50 rounded-lg",
                  children: [
                    /* @__PURE__ */ jsxDEV(Award, { className: "w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" }, void 0, false, {
                      fileName: "/app/src/pages/SportDetail.jsx?raw=",
                      lineNumber: 537,
                      columnNumber: 25
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-gray-700", children: benefit }, void 0, false, {
                      fileName: "/app/src/pages/SportDetail.jsx?raw=",
                      lineNumber: 538,
                      columnNumber: 25
                    }, this)
                  ]
                },
                idx,
                true,
                {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 530,
                  columnNumber: 21
                },
                this
              )
            ) }, void 0, false, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 528,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 527,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 521,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/SportDetail.jsx?raw=",
          lineNumber: 497,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/SportDetail.jsx?raw=",
        lineNumber: 386,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(TabsContent, { value: "trainers", children: /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: trainersLoading ? /* @__PURE__ */ jsxDEV("p", { className: "col-span-full text-center text-gray-500", children: t("loading") }, void 0, false, {
        fileName: "/app/src/pages/SportDetail.jsx?raw=",
        lineNumber: 551,
        columnNumber: 15
      }, this) : trainers.length === 0 ? /* @__PURE__ */ jsxDEV("p", { className: "col-span-full text-center text-gray-500", children: language === "ar" ? "لا يوجد مدربون متاحون حالياً" : "No trainers available currently" }, void 0, false, {
        fileName: "/app/src/pages/SportDetail.jsx?raw=",
        lineNumber: 555,
        columnNumber: 15
      }, this) : trainers.map(
        (trainer) => /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            children: /* @__PURE__ */ jsxDEV(Card, { className: "h-full hover:shadow-lg transition-shadow", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center text-center", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-4 overflow-hidden shadow-lg", children: trainer.photo_url ? /* @__PURE__ */ jsxDEV("img", { src: trainer.photo_url, alt: trainer.name_ar, className: "w-full h-full object-cover" }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 570,
                columnNumber: 25
              }, this) : /* @__PURE__ */ jsxDEV(Users, { className: "w-12 h-12 text-white" }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 572,
                columnNumber: 25
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 568,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-bold mb-2", children: language === "ar" ? trainer.name_ar : trainer.name_en }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 575,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600 mb-4 text-sm", children: language === "ar" ? trainer.bio_ar : trainer.bio_en }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 578,
                columnNumber: 27
              }, this),
              trainer.experience_years && /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-emerald-600 mb-3", children: [
                /* @__PURE__ */ jsxDEV(Dumbbell, { className: "w-4 h-4" }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 583,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ jsxDEV("span", { className: "text-sm font-medium", children: [
                  trainer.experience_years,
                  " ",
                  language === "ar" ? "سنوات خبرة" : "years experience"
                ] }, void 0, true, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 584,
                  columnNumber: 31
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 582,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "flex gap-2 mt-auto pt-4 border-t w-full justify-center", children: /* @__PURE__ */ jsxDEV(Link, { to: createPageUrl("TrainerProfile") + "?id=" + trainer.id, children: /* @__PURE__ */ jsxDEV(Button, { className: "bg-emerald-600 hover:bg-emerald-700 w-full", children: [
                language === "ar" ? "عرض البروفايل" : "View Profile",
                /* @__PURE__ */ jsxDEV(ExternalLink, { className: "w-4 h-4 ms-2" }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 593,
                  columnNumber: 33
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 591,
                columnNumber: 31
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 590,
                columnNumber: 29
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 589,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 567,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 566,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 565,
              columnNumber: 21
            }, this)
          },
          trainer.id,
          false,
          {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 560,
            columnNumber: 15
          },
          this
        )
      ) }, void 0, false, {
        fileName: "/app/src/pages/SportDetail.jsx?raw=",
        lineNumber: 549,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/SportDetail.jsx?raw=",
        lineNumber: 548,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(TabsContent, { value: "gallery", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "mb-6 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-bold", children: language === "ar" ? "معرض الصور والفيديوهات" : "Photos & Videos Gallery" }, void 0, false, {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 609,
            columnNumber: 15
          }, this),
          isTrainer && /* @__PURE__ */ jsxDEV(Dialog, { open: uploadDialogOpen, onOpenChange: setUploadDialogOpen, children: [
            /* @__PURE__ */ jsxDEV(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxDEV(Button, { className: "bg-emerald-600 hover:bg-emerald-700", children: [
              /* @__PURE__ */ jsxDEV(Upload, { className: "w-4 h-4 me-2" }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 616,
                columnNumber: 23
              }, this),
              language === "ar" ? "رفع ملف" : "Upload File"
            ] }, void 0, true, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 615,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 614,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV(DialogContent, { className: "max-w-md", children: [
              /* @__PURE__ */ jsxDEV(DialogHeader, { children: /* @__PURE__ */ jsxDEV(DialogTitle, { children: language === "ar" ? "رفع صورة أو فيديو" : "Upload Image or Video" }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 622,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 621,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 mt-4", children: [
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "نوع الملف" : "File Type" }, void 0, false, {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 628,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Select,
                    {
                      value: uploadForm.media_type,
                      onValueChange: (value) => setUploadForm({ ...uploadForm, media_type: value }),
                      children: [
                        /* @__PURE__ */ jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDEV(SelectValue, {}, void 0, false, {
                          fileName: "/app/src/pages/SportDetail.jsx?raw=",
                          lineNumber: 634,
                          columnNumber: 29
                        }, this) }, void 0, false, {
                          fileName: "/app/src/pages/SportDetail.jsx?raw=",
                          lineNumber: 633,
                          columnNumber: 27
                        }, this),
                        /* @__PURE__ */ jsxDEV(SelectContent, { children: [
                          /* @__PURE__ */ jsxDEV(SelectItem, { value: "image", children: language === "ar" ? "صورة" : "Image" }, void 0, false, {
                            fileName: "/app/src/pages/SportDetail.jsx?raw=",
                            lineNumber: 637,
                            columnNumber: 29
                          }, this),
                          /* @__PURE__ */ jsxDEV(SelectItem, { value: "video", children: language === "ar" ? "فيديو" : "Video" }, void 0, false, {
                            fileName: "/app/src/pages/SportDetail.jsx?raw=",
                            lineNumber: 638,
                            columnNumber: 29
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/src/pages/SportDetail.jsx?raw=",
                          lineNumber: 636,
                          columnNumber: 27
                        }, this)
                      ]
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/src/pages/SportDetail.jsx?raw=",
                      lineNumber: 629,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 627,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "العنوان (عربي)" : "Title (Arabic)" }, void 0, false, {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 643,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Input,
                    {
                      value: uploadForm.title_ar,
                      onChange: (e) => setUploadForm({ ...uploadForm, title_ar: e.target.value })
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/SportDetail.jsx?raw=",
                      lineNumber: 644,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 642,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "العنوان (إنجليزي)" : "Title (English)" }, void 0, false, {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 650,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Input,
                    {
                      value: uploadForm.title_en,
                      onChange: (e) => setUploadForm({ ...uploadForm, title_en: e.target.value })
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/SportDetail.jsx?raw=",
                      lineNumber: 651,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 649,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الوصف (عربي)" : "Description (Arabic)" }, void 0, false, {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 657,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Textarea,
                    {
                      value: uploadForm.description_ar,
                      onChange: (e) => setUploadForm({ ...uploadForm, description_ar: e.target.value })
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/SportDetail.jsx?raw=",
                      lineNumber: 658,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 656,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "الوصف (إنجليزي)" : "Description (English)" }, void 0, false, {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 664,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Textarea,
                    {
                      value: uploadForm.description_en,
                      onChange: (e) => setUploadForm({ ...uploadForm, description_en: e.target.value })
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/SportDetail.jsx?raw=",
                      lineNumber: 665,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 663,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDEV(Label, { children: language === "ar" ? "اختر الملف" : "Select File" }, void 0, false, {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 671,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV(
                    Input,
                    {
                      type: "file",
                      accept: uploadForm.media_type === "image" ? "image/*" : "video/*",
                      onChange: (e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/src/pages/SportDetail.jsx?raw=",
                      lineNumber: 672,
                      columnNumber: 25
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 670,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV(
                  Button,
                  {
                    onClick: handleUpload,
                    disabled: uploadMutation.isPending,
                    className: "w-full bg-emerald-600 hover:bg-emerald-700",
                    children: uploadMutation.isPending ? language === "ar" ? "جاري الرفع..." : "Uploading..." : language === "ar" ? "رفع" : "Upload"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 678,
                    columnNumber: 23
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 626,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 620,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 613,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/src/pages/SportDetail.jsx?raw=",
          lineNumber: 608,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-3 gap-6", children: galleryLoading ? /* @__PURE__ */ jsxDEV("p", { className: "col-span-full text-center text-gray-500", children: t("loading") }, void 0, false, {
          fileName: "/app/src/pages/SportDetail.jsx?raw=",
          lineNumber: 693,
          columnNumber: 15
        }, this) : gallery.length === 0 ? /* @__PURE__ */ jsxDEV("p", { className: "col-span-full text-center text-gray-500", children: language === "ar" ? "لا توجد صور أو فيديوهات حالياً" : "No photos or videos yet" }, void 0, false, {
          fileName: "/app/src/pages/SportDetail.jsx?raw=",
          lineNumber: 695,
          columnNumber: 15
        }, this) : gallery.map(
          (item) => /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              className: "relative group rounded-lg overflow-hidden shadow-lg aspect-square",
              children: [
                item.media_type === "image" ? /* @__PURE__ */ jsxDEV(
                  "img",
                  {
                    src: item.media_url,
                    alt: language === "ar" ? item.title_ar : item.title_en,
                    className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 707,
                    columnNumber: 17
                  },
                  this
                ) : /* @__PURE__ */ jsxDEV("div", { className: "relative w-full h-full bg-black", children: /* @__PURE__ */ jsxDEV(
                  "video",
                  {
                    src: item.media_url,
                    className: "w-full h-full object-cover",
                    controls: true
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 714,
                    columnNumber: 25
                  },
                  this
                ) }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 713,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4", children: /* @__PURE__ */ jsxDEV("div", { className: "text-white", children: [
                  /* @__PURE__ */ jsxDEV("h4", { className: "font-bold", children: language === "ar" ? item.title_ar : item.title_en }, void 0, false, {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 723,
                    columnNumber: 25
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-white/80", children: language === "ar" ? item.description_ar : item.description_en }, void 0, false, {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 726,
                    columnNumber: 25
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 722,
                  columnNumber: 23
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 721,
                  columnNumber: 21
                }, this)
              ]
            },
            item.id,
            true,
            {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 700,
              columnNumber: 15
            },
            this
          )
        ) }, void 0, false, {
          fileName: "/app/src/pages/SportDetail.jsx?raw=",
          lineNumber: 691,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/SportDetail.jsx?raw=",
        lineNumber: 607,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV(TabsContent, { value: "videos", children: /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-3 gap-6", children: videosLoading ? /* @__PURE__ */ jsxDEV("p", { className: "col-span-full text-center text-gray-500", children: t("loading") }, void 0, false, {
        fileName: "/app/src/pages/SportDetail.jsx?raw=",
        lineNumber: 741,
        columnNumber: 15
      }, this) : videos.length === 0 ? /* @__PURE__ */ jsxDEV("p", { className: "col-span-full text-center text-gray-500", children: language === "ar" ? "لا توجد فيديوهات تدريبية حالياً" : "No training videos yet" }, void 0, false, {
        fileName: "/app/src/pages/SportDetail.jsx?raw=",
        lineNumber: 743,
        columnNumber: 15
      }, this) : videos.map(
        (video) => /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            children: /* @__PURE__ */ jsxDEV(Card, { className: "overflow-hidden hover:shadow-lg transition-shadow cursor-pointer", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "relative aspect-video bg-gray-900", children: [
                /* @__PURE__ */ jsxDEV(
                  "img",
                  {
                    src: video.thumbnail_url || "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400",
                    alt: language === "ar" ? video.title_ar : video.title_en,
                    className: "w-full h-full object-cover"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/src/pages/SportDetail.jsx?raw=",
                    lineNumber: 755,
                    columnNumber: 25
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxDEV(Play, { className: "w-16 h-16 text-white" }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 761,
                  columnNumber: 27
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 760,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 754,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDEV(CardContent, { className: "p-4", children: [
                /* @__PURE__ */ jsxDEV("h3", { className: "font-bold text-lg mb-2", children: language === "ar" ? video.title_ar : video.title_en }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 765,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 line-clamp-2", children: language === "ar" ? video.description_ar : video.description_en }, void 0, false, {
                  fileName: "/app/src/pages/SportDetail.jsx?raw=",
                  lineNumber: 768,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/SportDetail.jsx?raw=",
                lineNumber: 764,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/SportDetail.jsx?raw=",
              lineNumber: 753,
              columnNumber: 21
            }, this)
          },
          video.id,
          false,
          {
            fileName: "/app/src/pages/SportDetail.jsx?raw=",
            lineNumber: 748,
            columnNumber: 15
          },
          this
        )
      ) }, void 0, false, {
        fileName: "/app/src/pages/SportDetail.jsx?raw=",
        lineNumber: 739,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/src/pages/SportDetail.jsx?raw=",
        lineNumber: 738,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/SportDetail.jsx?raw=",
      lineNumber: 357,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/SportDetail.jsx?raw=",
      lineNumber: 356,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/SportDetail.jsx?raw=",
    lineNumber: 322,
    columnNumber: 5
  }, this);
}