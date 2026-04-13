"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { db, auth } from '@/lib/firebase';
import { 
    collection, onSnapshot, doc, getDoc, getDocs, setDoc, query, where, 
    limit, addDoc, serverTimestamp, updateDoc, orderBy 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// External Data & Utils
import { translations } from './translations';
import { 
    initialPackages, initialGyms, initialTrainers, initialSports, 
    initialOffers, initialProducts, initialCats, initialTasks, initialGoals, 
    initialAppContent, defaultContactInfo 
} from './initialData';
import { getValue, getLoc, getText, getAr, getEn, getSportImage } from '../utils/dataUtils';

const AppContext = createContext();

export function AppProvider({ children }) {
    // UI State
    const [language, setLanguage] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('lang') || 'ar';
        return 'ar';
    });
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('theme') === 'true';
        return false;
    });
    const [alert, setAlert] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Auth State
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    // Domain Data State (Initialized with mock data for immediate UI availability)
    const [gyms, setGyms] = useState(initialGyms);
    const [packages, setPackages] = useState(initialPackages);
    const [trainers, setTrainers] = useState(initialTrainers);
    const [sports, setSports] = useState(initialSports);
    const [offers, setOffers] = useState([]);
    const [products, setProducts] = useState(initialProducts);
    const [categories, setCategories] = useState(initialCats);
    const [tasks, setTasks] = useState(initialTasks);
    const [goals, setGoals] = useState(initialGoals);
    const [appContent, setAppContent] = useState(initialAppContent);
    const [favorites, setFavorites] = useState([]);
    const [favoriteTrainers, setFavoriteTrainers] = useState([]);
    const [favoriteSports, setFavoriteSports] = useState([]);
    const [activeSubscription, setActiveSubscription] = useState(null);
    const [contactInfo, setContactInfo] = useState(defaultContactInfo);
    const [inquiries, setInquiries] = useState([]);

    // Loading States
    const [loadingGyms, setLoadingGyms] = useState(true);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [loadingTrainers, setLoadingTrainers] = useState(true);
    const [loadingSports, setLoadingSports] = useState(true);
    const [loadingOffers, setLoadingOffers] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [loadingGoals, setLoadingGoals] = useState(true);
    const [loadingAppContent, setLoadingAppContent] = useState(true);
    const [loadingSubscription, setLoadingSubscription] = useState(true);
    const [loadingInquiries, setLoadingInquiries] = useState(true);

    // AUTH LISTENER
    useEffect(() => {
        let userDocUnsub = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
            // Clean up previous user doc listener
            if (userDocUnsub) { userDocUnsub(); userDocUnsub = null; }

            setUser(u);
            if (u) {
                const userRef = doc(db, "users", u.uid);
                // Check if doc exists; create if not
                const snap = await getDoc(userRef);
                if (!snap.exists()) {
                    const newData = {
                        email: u.email,
                        displayName: u.displayName || 'User',
                        role: 'user',
                        createdAt: serverTimestamp()
                    };
                    await setDoc(userRef, newData);
                }
                // Real-time listener so userData always reflects latest Firestore state
                userDocUnsub = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData({ uid: u.uid, ...docSnap.data() });
                    }
                    setLoadingAuth(false);
                }, () => setLoadingAuth(false));
            } else {
                setUserData(null);
                setLoadingAuth(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (userDocUnsub) userDocUnsub();
        };
    }, []);

    // FAVORITES HANDLERS
    const toggleFavorite = (id) => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const toggleFavoriteTrainer = (id) => setFavoriteTrainers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const toggleFavoriteSport = (id) => setFavoriteSports(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    // DOMAIN DATA — one-time fetch for static collections, snapshot only for live data
    useEffect(() => {
        const lang = language;

        // Helper: seed collection if empty, then set state
        const fetchStatic = async (coll, setter, loadingSetter, initialData = [], transform) => {
            try {
                const snap = await getDocs(collection(db, coll));
                if (snap.empty && initialData.length > 0) {
                    await Promise.all(initialData.map(item => {
                        const { id, ...data } = item;
                        return id ? setDoc(doc(db, coll, id), data) : addDoc(collection(db, coll), data);
                    }));
                    setter(initialData);
                } else if (!snap.empty) {
                    setter(snap.docs.map(d => transform ? transform(d.id, d.data()) : { id: d.id, ...d.data() }));
                }
            } catch (e) { console.error(`Error fetching ${coll}:`, e); }
            finally { if (loadingSetter) loadingSetter(false); }
        };

        // Static collections — single read, no persistent socket
        fetchStatic("gyms",     setGyms,     setLoadingGyms,     initialGyms);
        fetchStatic("packages", setPackages, setLoadingPackages, initialPackages, (id, d) => ({
            id, ...d,
            name: getValue(d, 'name', lang),
            description: getValue(d, 'description', lang),
            features: lang === 'ar' ? (d.features_ar || []) : (d.features_en || [])
        }));
        fetchStatic("trainers", setTrainers, setLoadingTrainers, initialTrainers);
        fetchStatic("sports",   setSports,   setLoadingSports,   initialSports, (id, d) => ({
            id, ...d, name: getValue(d, 'name', lang)
        }));
        fetchStatic("products", setProducts, setLoadingProducts, initialProducts, (id, d) => ({
            id, ...d,
            name: getValue(d, 'name', lang),
            category: getValue(d, 'category', lang),
            description: getValue(d, 'description', lang) || getValue(d, 'desc', lang)
        }));
        fetchStatic("tasks", setTasks, setLoadingTasks, initialTasks, (id, d) => ({
            id, ...d, title: getValue(d, 'title', lang), time: getValue(d, 'time', lang)
        }));
        fetchStatic("goals", setGoals, setLoadingGoals, initialGoals, (id, d) => ({
            id, ...d, text: getValue(d, 'text', lang), sub: getValue(d, 'sub', lang)
        }));

        // Offers — realtime (admin updates frequently)
        const offerUnsub = onSnapshot(collection(db, "offers"), async (snap) => {
            if (snap.empty && initialOffers.length > 0) {
                await Promise.all(initialOffers.map(item => {
                    const { id, ...data } = item;
                    return id ? setDoc(doc(db, "offers", id), data) : addDoc(collection(db, "offers"), data);
                }));
                setOffers(initialOffers);
            } else if (!snap.empty) {
                setOffers(snap.docs.map(d => {
                    const data = d.data();
                    return {
                        id: d.id, ...data,
                        title: getValue(data, 'title', lang),
                        subtitle: getValue(data, 'subtitle', lang) || getValue(data, 'desc', lang),
                        badge: getValue(data, 'badge', lang) || (lang === 'ar' ? 'عرض خاص' : 'Special Offer')
                    };
                }));
            }
            setLoadingOffers(false);
        });

        // Subscriptions — realtime (user-specific)
        let subUnsub = null;
        if (user) {
            const q = query(collection(db, "subscriptions"), where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(1));
            subUnsub = onSnapshot(q, (snap) => {
                setActiveSubscription(!snap.empty ? { id: snap.docs[0].id, ...snap.docs[0].data() } : null);
                setLoadingSubscription(false);
            });
        } else {
            setLoadingSubscription(false);
        }

        return () => {
            offerUnsub();
            if (subUnsub) subUnsub();
        };
    }, [user, language]);

    // SETTINGS & CONTENT LISTENER
    useEffect(() => {
        const unsubs = [];
        
        // Contact Info
        unsubs.push(onSnapshot(doc(db, "settings", "contact_info"), (snap) => {
            if (snap.exists()) setContactInfo(snap.data());
        }));

        // App Content (onboarding, etc.)
        unsubs.push(onSnapshot(collection(db, "app_content"), (snap) => {
            const data = { ...initialAppContent };
            snap.forEach(doc => { data[doc.id] = doc.data(); });
            setAppContent(data);
            setLoadingAppContent(false);
        }));

        // Inquiries (Admin only)
        if (userData?.role === 'admin') {
            const q = query(collection(db, "contact_inquiries"), orderBy("createdAt", "desc"));
            unsubs.push(onSnapshot(q, (snap) => {
                setInquiries(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoadingInquiries(false);
            }));
        } else {
            setLoadingInquiries(false);
        }

        return () => unsubs.forEach(unsub => unsub?.());
    }, [userData]);

    // CART STATE
    const [cart, setCart] = useState([]);
    useEffect(() => {
        const saved = localStorage.getItem('captina_cart');
        if (saved) try { setCart(JSON.parse(saved)); } catch (e) { console.error("Cart load error:", e); }
    }, []);

    const saveCart = useCallback((newCart) => {
        setCart(newCart);
        localStorage.setItem('captina_cart', JSON.stringify(newCart));
    }, []);

    const addToCart = useCallback((product, selection = {}) => {
        const isSub = selection.type === 'subscription';
        const cartId = selection.cartId || (isSub ? `sub-${product.id}` : `${product.id}-${selection.size || 'default'}-${selection.color?.code || 'default'}`);
        const existing = cart.findIndex(item => item.cartId === cartId);

        if (existing > -1 && !isSub) {
            const next = [...cart];
            next[existing].quantity += (selection.quantity || 1);
            saveCart(next);
        } else {
            const item = {
                cartId, productId: product.id, name: selection.name || product.name,
                image: selection.image || product.image || "/logo_captina.jpg",
                price: parseFloat(selection.price || product.price) || 0,
                size: selection.size, color: selection.color,
                quantity: selection.quantity || 1,
                type: selection.type || 'product', metadata: selection.metadata || {}
            };
            if (existing > -1) {
                const next = [...cart];
                next[existing] = item;
                saveCart(next);
            } else {
                saveCart([...cart, item]);
            }
        }
    }, [cart, saveCart]);

    const removeFromCart = useCallback((id) => saveCart(cart.filter(x => x.cartId !== id)), [cart, saveCart]);
    const updateCartQuantity = useCallback((id, d) => {
        saveCart(cart.map(x => x.cartId === id ? { ...x, quantity: Math.max(1, x.quantity + d) } : x));
    }, [cart, saveCart]);

    const cartTotal = useMemo(() => cart.reduce((acc, x) => acc + (x.price * x.quantity), 0), [cart]);
    const cartCount = useMemo(() => cart.reduce((acc, x) => acc + x.quantity, 0), [cart]);

    // UTILITIES
    const changeLanguage = useCallback((l) => { setLanguage(l); localStorage.setItem('lang', l); }, []);
    const toggleLanguage = useCallback(() => changeLanguage(language === 'ar' ? 'en' : 'ar'), [language, changeLanguage]);
    const changeDarkMode = useCallback((m) => { setDarkMode(m); localStorage.setItem('theme', m); }, []);
    const toggleDarkMode = useCallback(() => changeDarkMode(!darkMode), [darkMode, changeDarkMode]);

    const getSubscriptionDetails = useCallback(async (id) => {
        try {
            const snap = await getDoc(doc(db, "subscriptions", id));
            return snap.exists() ? { id: snap.id, ...snap.data() } : null;
        } catch (e) { return null; }
    }, []);

    const t = useCallback((key) => {
        if (!key) return '';
        // 1. Data mapping (returns arrays/objects for specific keys)
        const dataMap = {
            gymsData: gyms, packagesData: packages, pageTrainersData: trainers,
            pageSportsData: sports, offersData: offers, allOffersData: offers,
            productsData: products, categoriesData: categories,
            tasksData: tasks, goalsData: goals
        };
        if (dataMap[key]) return dataMap[key];

        const langData = translations[language] || translations['ar'];
        
        // 2. Specific fallbacks for common navigation labels that clash with section names
        if (key === 'home' || key === 'packages' || key === 'trainers' || key === 'sports' || key === 'offers') {
            if (langData.nav && langData.nav[key]) return langData.nav[key];
        }

        // 3. Resolve keys (handles dot notation e.g. "auth.loginTitle")
        const keys = key.split('.');
        let val = langData;
        for (const k of keys) {
            if (val && typeof val === 'object' && (k in val)) {
                val = val[k];
            } else {
                // If not found at specific path, try common/nav as fallback
                if (keys.length === 1) {
                    if (langData.common && (key in langData.common)) return langData.common[key];
                    if (langData.nav && (key in langData.nav)) return langData.nav[key];
                }
                return key;
            }
        }

        // Auto-fallback image logic for sport content
        if (key.endsWith('Content') && typeof val === 'object' && val?.heroImg?.includes('unsplash.com')) {
            val.heroImg = getSportImage(key.replace('Content', ''), val.heroImg);
        }

        return val;
    }, [language, gyms, packages, trainers, sports, offers, products, categories, tasks, goals]);

    // MEMOIZED CONTEXT VALUE
    const value = useMemo(() => ({
        language, setLanguage: changeLanguage, toggleLanguage,
        darkMode, setDarkMode: changeDarkMode, toggleDarkMode,
        t, gyms, packages, trainers, sports, offers, products, categories, tasks, goals,
        loadingGyms, loadingPackages, loadingTrainers, loadingSports, loadingOffers,
        loadingProducts, loadingTasks, loadingGoals, appContent, loadingAppContent,
        alert, setAlert, cart, addToCart, removeFromCart, updateCartQuantity,
        cartTotal, cartCount, user, userData, favorites, toggleFavorite,
        favoriteTrainers, toggleFavoriteTrainer, favoriteSports, toggleFavoriteSport,
        loadingAuth, isCartOpen, setIsCartOpen, activeSubscription, loadingSubscription,
        contactInfo, inquiries, loadingInquiries, getSubscriptionDetails,
        getValue, getLoc, getText, getAr, getEn
    }), [
        language, changeLanguage, toggleLanguage, darkMode, changeDarkMode, toggleDarkMode, t,
        gyms, packages, trainers, sports, offers, products, categories, tasks, goals,
        loadingGyms, loadingPackages, loadingTrainers, loadingSports, loadingOffers,
        loadingProducts, loadingTasks, loadingGoals, appContent, loadingAppContent,
        alert, cart, addToCart, removeFromCart, updateCartQuantity, cartTotal, cartCount,
        user, userData, favorites, favoriteTrainers, favoriteSports, loadingAuth,
        isCartOpen, activeSubscription, loadingSubscription, contactInfo, inquiries,
        loadingInquiries, getSubscriptionDetails
    ]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
