function Notifications() {
  _s();
  const { t, language } = useLanguage();
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  React.useEffect(() => {
    const loadUser = async () => {
      const userData = await base44.auth.me();
      setUser(userData);
    };
    loadUser();
  }, []);
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.email],
    queryFn: () => base44.entities.Notification.filter({ user_email: user.email }, "-created_date"),
    enabled: !!user
  });
  const markAsReadMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications.filter((n) => !n.is_read);
      await Promise.all(unreadNotifications.map((n) => base44.entities.Notification.update(n.id, { is_read: true })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
  const deleteNotificationMutation = useMutation({
    mutationFn: (id) => base44.entities.Notification.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_confirmed":
        return /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-5 h-5 text-green-600" }, void 0, false, {
          fileName: "/app/src/pages/Notifications.jsx?raw=",
          lineNumber: 78,
          columnNumber: 16
        }, this);
      case "booking_cancelled":
        return /* @__PURE__ */ jsxDEV(XCircle, { className: "w-5 h-5 text-red-600" }, void 0, false, {
          fileName: "/app/src/pages/Notifications.jsx?raw=",
          lineNumber: 80,
          columnNumber: 16
        }, this);
      case "booking_reminder":
        return /* @__PURE__ */ jsxDEV(Calendar, { className: "w-5 h-5 text-blue-600" }, void 0, false, {
          fileName: "/app/src/pages/Notifications.jsx?raw=",
          lineNumber: 82,
          columnNumber: 16
        }, this);
      case "video_approved":
        return /* @__PURE__ */ jsxDEV(CheckCircle, { className: "w-5 h-5 text-green-600" }, void 0, false, {
          fileName: "/app/src/pages/Notifications.jsx?raw=",
          lineNumber: 84,
          columnNumber: 16
        }, this);
      case "video_rejected":
        return /* @__PURE__ */ jsxDEV(XCircle, { className: "w-5 h-5 text-red-600" }, void 0, false, {
          fileName: "/app/src/pages/Notifications.jsx?raw=",
          lineNumber: 86,
          columnNumber: 16
        }, this);
      default:
        return /* @__PURE__ */ jsxDEV(Bell, { className: "w-5 h-5 text-gray-600" }, void 0, false, {
          fileName: "/app/src/pages/Notifications.jsx?raw=",
          lineNumber: 88,
          columnNumber: 16
        }, this);
    }
  };
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  if (!user) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV(Bell, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }, void 0, false, {
        fileName: "/app/src/pages/Notifications.jsx?raw=",
        lineNumber: 98,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-600", children: language === "ar" ? "جاري التحميل..." : "Loading..." }, void 0, false, {
        fileName: "/app/src/pages/Notifications.jsx?raw=",
        lineNumber: 99,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/Notifications.jsx?raw=",
      lineNumber: 97,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/Notifications.jsx?raw=",
      lineNumber: 96,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-gray-50 pt-24 pb-12", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 max-w-4xl", children: [
    /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "mb-8",
        children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxDEV(Bell, { className: "w-6 h-6 text-emerald-600" }, void 0, false, {
              fileName: "/app/src/pages/Notifications.jsx?raw=",
              lineNumber: 116,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/app/src/pages/Notifications.jsx?raw=",
              lineNumber: 115,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDEV("h1", { className: "text-3xl font-bold text-gray-900", children: language === "ar" ? "الإشعارات" : "Notifications" }, void 0, false, {
                fileName: "/app/src/pages/Notifications.jsx?raw=",
                lineNumber: 119,
                columnNumber: 17
              }, this),
              unreadCount > 0 && /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-500", children: [
                unreadCount,
                " ",
                language === "ar" ? "إشعار جديد" : "unread"
              ] }, void 0, true, {
                fileName: "/app/src/pages/Notifications.jsx?raw=",
                lineNumber: 123,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/src/pages/Notifications.jsx?raw=",
              lineNumber: 118,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/src/pages/Notifications.jsx?raw=",
            lineNumber: 114,
            columnNumber: 13
          }, this),
          unreadCount > 0 && /* @__PURE__ */ jsxDEV(
            Button,
            {
              variant: "outline",
              onClick: () => markAllAsReadMutation.mutate(),
              disabled: markAllAsReadMutation.isPending,
              children: [
                /* @__PURE__ */ jsxDEV(Check, { className: "w-4 h-4 me-2" }, void 0, false, {
                  fileName: "/app/src/pages/Notifications.jsx?raw=",
                  lineNumber: 136,
                  columnNumber: 17
                }, this),
                language === "ar" ? "تعليم الكل كمقروء" : "Mark all as read"
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/src/pages/Notifications.jsx?raw=",
              lineNumber: 131,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/src/pages/Notifications.jsx?raw=",
          lineNumber: 113,
          columnNumber: 11
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/src/pages/Notifications.jsx?raw=",
        lineNumber: 108,
        columnNumber: 9
      },
      this
    ),
    isLoading ? /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: [1, 2, 3].map(
      (i) => /* @__PURE__ */ jsxDEV(Card, { className: "animate-pulse", children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "h-4 bg-gray-200 rounded w-3/4 mb-2" }, void 0, false, {
          fileName: "/app/src/pages/Notifications.jsx?raw=",
          lineNumber: 148,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "h-3 bg-gray-200 rounded w-1/2" }, void 0, false, {
          fileName: "/app/src/pages/Notifications.jsx?raw=",
          lineNumber: 149,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "/app/src/pages/Notifications.jsx?raw=",
        lineNumber: 147,
        columnNumber: 17
      }, this) }, i, false, {
        fileName: "/app/src/pages/Notifications.jsx?raw=",
        lineNumber: 146,
        columnNumber: 11
      }, this)
    ) }, void 0, false, {
      fileName: "/app/src/pages/Notifications.jsx?raw=",
      lineNumber: 144,
      columnNumber: 9
    }, this) : notifications.length === 0 ? /* @__PURE__ */ jsxDEV(Card, { children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-12 text-center", children: [
      /* @__PURE__ */ jsxDEV(Bell, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }, void 0, false, {
        fileName: "/app/src/pages/Notifications.jsx?raw=",
        lineNumber: 157,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 text-lg", children: language === "ar" ? "لا توجد إشعارات" : "No notifications" }, void 0, false, {
        fileName: "/app/src/pages/Notifications.jsx?raw=",
        lineNumber: 158,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "/app/src/pages/Notifications.jsx?raw=",
      lineNumber: 156,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "/app/src/pages/Notifications.jsx?raw=",
      lineNumber: 155,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV("div", { className: "space-y-3", children: notifications.map(
      (notification, index) => /* @__PURE__ */ jsxDEV(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: index * 0.05 },
          children: /* @__PURE__ */ jsxDEV(
            Card,
            {
              className: `transition-all hover:shadow-md ${!notification.is_read ? "bg-blue-50 border-blue-200" : ""}`,
              children: /* @__PURE__ */ jsxDEV(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsxDEV("div", { className: `mt-1 ${!notification.is_read ? "opacity-100" : "opacity-50"}`, children: getNotificationIcon(notification.type) }, void 0, false, {
                  fileName: "/app/src/pages/Notifications.jsx?raw=",
                  lineNumber: 179,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: /* @__PURE__ */ jsxDEV("div", { className: "flex items-start justify-between gap-4", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsxDEV("h3", { className: `font-semibold ${!notification.is_read ? "text-gray-900" : "text-gray-700"}`, children: language === "ar" ? notification.title_ar : notification.title_en }, void 0, false, {
                      fileName: "/app/src/pages/Notifications.jsx?raw=",
                      lineNumber: 186,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600 mt-1", children: language === "ar" ? notification.message_ar : notification.message_en }, void 0, false, {
                      fileName: "/app/src/pages/Notifications.jsx?raw=",
                      lineNumber: 189,
                      columnNumber: 29
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-xs text-gray-400 mt-2", children: format(new Date(notification.created_date), "PPp", {
                      locale: language === "ar" ? ar : enUS
                    }) }, void 0, false, {
                      fileName: "/app/src/pages/Notifications.jsx?raw=",
                      lineNumber: 192,
                      columnNumber: 29
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Notifications.jsx?raw=",
                    lineNumber: 185,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                    !notification.is_read && /* @__PURE__ */ jsxDEV(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        onClick: () => markAsReadMutation.mutate(notification.id),
                        children: /* @__PURE__ */ jsxDEV(Check, { className: "w-4 h-4" }, void 0, false, {
                          fileName: "/app/src/pages/Notifications.jsx?raw=",
                          lineNumber: 206,
                          columnNumber: 33
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/pages/Notifications.jsx?raw=",
                        lineNumber: 201,
                        columnNumber: 25
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        onClick: () => deleteNotificationMutation.mutate(notification.id),
                        children: /* @__PURE__ */ jsxDEV(Trash2, { className: "w-4 h-4 text-red-500" }, void 0, false, {
                          fileName: "/app/src/pages/Notifications.jsx?raw=",
                          lineNumber: 214,
                          columnNumber: 31
                        }, this)
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/src/pages/Notifications.jsx?raw=",
                        lineNumber: 209,
                        columnNumber: 29
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/src/pages/Notifications.jsx?raw=",
                    lineNumber: 199,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/src/pages/Notifications.jsx?raw=",
                  lineNumber: 184,
                  columnNumber: 25
                }, this) }, void 0, false, {
                  fileName: "/app/src/pages/Notifications.jsx?raw=",
                  lineNumber: 183,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/app/src/pages/Notifications.jsx?raw=",
                lineNumber: 178,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "/app/src/pages/Notifications.jsx?raw=",
                lineNumber: 177,
                columnNumber: 19
              }, this)
            },
            void 0,
            false,
            {
              fileName: "/app/src/pages/Notifications.jsx?raw=",
              lineNumber: 172,
              columnNumber: 17
            },
            this
          )
        },
        notification.id,
        false,
        {
          fileName: "/app/src/pages/Notifications.jsx?raw=",
          lineNumber: 166,
          columnNumber: 11
        },
        this
      )
    ) }, void 0, false, {
      fileName: "/app/src/pages/Notifications.jsx?raw=",
      lineNumber: 164,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/src/pages/Notifications.jsx?raw=",
    lineNumber: 107,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/src/pages/Notifications.jsx?raw=",
    lineNumber: 106,
    columnNumber: 5
  }, this);
}