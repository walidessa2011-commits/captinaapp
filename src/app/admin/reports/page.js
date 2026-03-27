"use client";
import React, { useState, useEffect } from 'react';
import { useApp } from "@/context/AppContext";
import { 
    BarChart3, 
    Download, 
    TrendingUp, 
    Users, 
    UserCheck, 
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function AdminReports() {
    const { language, darkMode, getText } = useApp();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        activeSubscribers: 0,
        totalTrainers: 0,
        totalBookings: 0,
        monthlyRevenue: [],
        topTrainers: [],
        recentSubscriptions: []
    });

    const [reportType, setReportType] = useState('all'); // all, financial, trainers, users
    const [timeRange, setTimeRange] = useState('all'); // month, year, all

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        setIsLoading(true);
        try {
            // Fetch Users
            const usersSnap = await getDocs(collection(db, "users"));
            const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Fetch Trainers
            const trainersSnap = await getDocs(collection(db, "trainers"));
            const trainers = trainersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Fetch Subscriptions (Orders/Packages)
            const subscriptionsSnap = await getDocs(query(collection(db, "subscriptions"), orderBy("createdAt", "desc")));
            const subscriptions = subscriptionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Fetch Bookings
            const bookingsSnap = await getDocs(collection(db, "bookings"));
            const bookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Fetch Attendances
            const attendanceSnap = await getDocs(query(collection(db, "attendance"), orderBy("date", "desc")));
            const attendances = attendanceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Calculate Stats
            const revenue = subscriptions.reduce((acc, sub) => acc + (parseFloat(sub.amount) || 0), 0);
            
            // Monthly Revenue Calculation
            const monthlyData = {};
            subscriptions.forEach(sub => {
                const date = new Date(sub.createdAt?.toDate?.() || sub.createdAt || new Date());
                const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
                monthlyData[monthYear] = (monthlyData[monthYear] || 0) + (parseFloat(sub.amount) || 0);
            });
            const monthlyRevenue = Object.entries(monthlyData).map(([name, total]) => ({ name, total }));

            // Top Trainers (simplified calculation based on bookings)
            const trainerBookings = {};
            bookings.forEach(b => {
                if (b.trainerId) {
                    trainerBookings[b.trainerId] = (trainerBookings[b.trainerId] || 0) + 1;
                }
            });

            const sortedTrainers = trainers.map(t => ({
                ...t,
                bookingsCount: trainerBookings[t.id] || 0
            })).sort((a, b) => b.bookingsCount - a.bookingsCount).slice(0, 5);

            setStats({
                totalRevenue: revenue,
                activeSubscribers: users.filter(u => u.activeSubscription).length,
                totalTrainers: trainers.length,
                totalBookings: bookings.length,
                monthlyRevenue,
                topTrainers: sortedTrainers,
                recentSubscriptions: subscriptions.slice(0, 10),
                recentAttendances: attendances.slice(0, 50),
                totalAttendances: attendances.filter(a => a.action > 0).length,
                allData: {
                    users,
                    trainers,
                    subscriptions,
                    bookings,
                    attendances
                }
            });
        } catch (error) {
            console.error("Error fetching report data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Add font support if needed, but standard ones work for basic text
        const title = language === 'ar' ? 'تقرير كابتنا الشامل' : 'Captina Comprehensive Report';
        const date = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');

        // Header
        doc.setFillColor(124, 58, 237); // Primary color
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text(title, 20, 25);
        doc.setFontSize(10);
        doc.text(`${language === 'ar' ? 'تاريخ التقرير' : 'Report Date'}: ${date}`, 20, 32);

        let yPos = 55;

        // Statistics Summary
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text(language === 'ar' ? 'ملخص الأداء' : 'Performance Summary', 20, yPos);
        yPos += 10;

        const summaryData = [
            [language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue', `${stats.totalRevenue} SAR`],
            [language === 'ar' ? 'المشتركين النشطين' : 'Active Subscribers', stats.activeSubscribers],
            [language === 'ar' ? 'إجمالي المدربين' : 'Total Trainers', stats.totalTrainers],
            [language === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings', stats.totalBookings],
            [language === 'ar' ? 'إجمالي تسجيل الحضور' : 'Total Attendances', stats.totalAttendances || 0],
        ];

        doc.autoTable({
            startY: yPos,
            head: [[language === 'ar' ? 'المقياس' : 'Metric', language === 'ar' ? 'القيمة' : 'Value']],
            body: summaryData,
            theme: 'grid',
            headStyles: { fillColor: [124, 58, 237] },
            styles: { fontSize: 10 }
        });

        yPos = doc.lastAutoTable.finalY + 20;

        // Recent Subscriptions
        doc.setFontSize(16);
        doc.text(language === 'ar' ? 'آخر الاشتراكات' : 'Recent Subscriptions', 20, yPos);
        yPos += 10;

        const subData = stats.recentSubscriptions.map(s => [
            s.userName || s.userEmail || 'N/A',
            s.packageName || 'N/A',
            `${s.amount} SAR`,
            new Date(s.createdAt?.toDate?.() || s.createdAt).toLocaleDateString()
        ]);

        doc.autoTable({
            startY: yPos,
            head: [[
                language === 'ar' ? 'المشترك' : 'Subscriber',
                language === 'ar' ? 'الباقة' : 'Package',
                language === 'ar' ? 'المبلغ' : 'Amount',
                language === 'ar' ? 'التاريخ' : 'Date'
            ]],
            body: subData,
            theme: 'striped',
            headStyles: { fillColor: [124, 58, 237] }
        });

        yPos = doc.lastAutoTable.finalY + 20;

        // Financials (Monthly Revenue)
        if (yPos > 240) { doc.addPage(); yPos = 20; }
        doc.setFontSize(16);
        doc.text(language === 'ar' ? 'التقرير المالي (الإيرادات الشهرية)' : 'Financial Report (Monthly Revenue)', 20, yPos);
        yPos += 10;

        const financialData = stats.monthlyRevenue.map(m => [
            m.name,
            `${m.total.toFixed(2)} SAR`
        ]);

        doc.autoTable({
            startY: yPos,
            head: [[
                language === 'ar' ? 'الشهر/السنة' : 'Month/Year',
                language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'
            ]],
            body: financialData,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] } // Emerald color for financials
        });

        yPos = doc.lastAutoTable.finalY + 20;

        // Top Trainers
        if (yPos > 240) { doc.addPage(); yPos = 20; }
        doc.setFontSize(16);
        doc.text(language === 'ar' ? 'أفضل المدربين (حسب الحجوزات)' : 'Top Trainers (by Bookings)', 20, yPos);
        yPos += 10;

        const trainerData = stats.topTrainers.map(t => [
            typeof t.name === 'object' ? (t.name[language] || t.name.ar) : t.name,
            typeof t.specialty === 'object' ? (t.specialty[language] || t.specialty.ar) : t.specialty,
            t.bookingsCount
        ]);

        doc.autoTable({
            startY: yPos,
            head: [[
                language === 'ar' ? 'الاسم' : 'Name',
                language === 'ar' ? 'التخصص' : 'Specialty',
                language === 'ar' ? 'عدد الحجوزات' : 'Bookings'
            ]],
            body: trainerData,
            theme: 'grid',
            headStyles: { fillColor: [124, 58, 237] }
        });

        yPos = doc.lastAutoTable.finalY + 20;

        // Trainer & Subscribers Report
        if (yPos > 240) { doc.addPage(); yPos = 20; }
        doc.setFontSize(16);
        doc.text(language === 'ar' ? 'تقرير المتدربين لكل مدرب' : 'Trainer Subscribers Report', 20, yPos);
        yPos += 10;

        // Mapping bookings to trainers to show how many unique users they booked
        const trainerSubscribersData = stats.topTrainers.map(t => {
            const tBookings = stats.allData.bookings.filter(b => b.trainerId === t.id);
            const uniqueUsers = new Set(tBookings.map(b => b.userId)).size;
            return [
                typeof t.name === 'object' ? (t.name[language] || t.name.ar) : t.name,
                uniqueUsers,
                t.bookingsCount
            ];
        });

        doc.autoTable({
            startY: yPos,
            head: [[
                language === 'ar' ? 'المدرب' : 'Trainer',
                language === 'ar' ? 'عدد المتدربين' : 'Number of Subscribers',
                language === 'ar' ? 'إجمالي الحصص' : 'Total Sessions'
            ]],
            body: trainerSubscribersData,
            theme: 'striped',
            headStyles: { fillColor: [245, 158, 11] } // Amber color
        });

        yPos = doc.lastAutoTable.finalY + 20;

        // Attendance Logs
        if (yPos > 240) { doc.addPage(); yPos = 20; }
        doc.setFontSize(16);
        doc.text(language === 'ar' ? 'سجل الحضور' : 'Attendance Logs', 20, yPos);
        yPos += 10;

        const attendanceData = (stats.recentAttendances || []).slice(0, 30).map(a => [
            a.userName || 'N/A',
            a.packageName || 'N/A',
            a.action > 0 ? '+1' : '-1',
            a.date?.toDate ? a.date.toDate().toLocaleDateString() : new Date(a.date).toLocaleDateString()
        ]);

        doc.autoTable({
            startY: yPos,
            head: [[
                language === 'ar' ? 'المستخدم' : 'User',
                language === 'ar' ? 'الباقة' : 'Package',
                language === 'ar' ? 'الإجراء' : 'Action',
                language === 'ar' ? 'التاريخ' : 'Date'
            ]],
            body: attendanceData,
            theme: 'striped',
            headStyles: { fillColor: [147, 51, 234] } // Purple
        });

        doc.save(`Captina_Admin_Reports_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const cardBg = darkMode ? "bg-white/5 border-white/10" : "bg-white border-gray-100 shadow-sm";
    const textClass = darkMode ? "text-white" : "text-slate-900";

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                        <BarChart3 className="w-10 h-10 text-primary" />
                        {language === 'ar' ? 'تقارير النظام' : 'System Reports'}
                    </h1>
                    <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-sm">
                        {language === 'ar' ? 'تحليل البيانات والأداء المالي' : 'Data Analytics & Financial Performance'}
                    </p>
                </div>
                
                <button 
                    onClick={generatePDF}
                    className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                >
                    <Download className="w-5 h-5" />
                    {language === 'ar' ? 'تصدير PDF' : 'Export PDF'}
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Revenue', labelAr: 'الإيرادات', val: `${stats.totalRevenue.toLocaleString()} SAR`, icon: <CreditCard />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Subscribers', labelAr: 'المشتركين', val: stats.activeSubscribers, icon: <Users />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Trainers', labelAr: 'المدربين', val: stats.totalTrainers, icon: <UserCheck />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Bookings', labelAr: 'الحجوزات', val: stats.totalBookings, icon: <Calendar />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                ].map((item, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className={`${cardBg} p-6 rounded-[2.5rem] border relative overflow-hidden group`}
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 ${item.bg} rounded-full blur-3xl -mr-10 -mt-10 opacity-50`}></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                                {React.cloneElement(item.icon, { className: "w-6 h-6" })}
                            </div>
                            <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">
                                {language === 'ar' ? item.labelAr : item.label}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-black">{item.val}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Subscriptions Table */}
                <div className={`${cardBg} rounded-[3rem] border overflow-hidden`}>
                    <div className="p-8 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                        <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            {language === 'ar' ? 'آخر العمليات' : 'Recent Transactions'}
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-start px-4">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-white/5">
                                    <th className="px-8 py-5 text-start">{language === 'ar' ? 'المستخدم' : 'User'}</th>
                                    <th className="px-8 py-5 text-start">{language === 'ar' ? 'المبلغ' : 'Amount'}</th>
                                    <th className="px-8 py-5 text-start">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                {stats.recentSubscriptions.map((sub, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black truncate max-w-[150px]">{getText(sub.userName) || sub.userEmail || 'N/A'}</span>
                                                <span className="text-[10px] text-gray-500 font-bold">{getText(sub.packageName)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-black text-emerald-500">+{sub.amount} SAR</span>
                                        </td>
                                        <td className="px-8 py-5 font-bold text-[10px] text-gray-400">
                                            {new Date(sub.createdAt?.toDate?.() || sub.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Trainers Table */}
                <div className={`${cardBg} rounded-[3rem] border overflow-hidden`}>
                    <div className="p-8 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                        <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3">
                            <UserCheck className="w-5 h-5 text-amber-500" />
                            {language === 'ar' ? 'أكثر المدربين طلباً' : 'In-Demand Trainers'}
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-start">
                            <thead>
                                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-white/5">
                                    <th className="px-8 py-5 text-start">{language === 'ar' ? 'المدرب' : 'Trainer'}</th>
                                    <th className="px-8 py-5 text-start">{language === 'ar' ? 'الحجوزات' : 'Bookings'}</th>
                                    <th className="px-8 py-5 text-end">{language === 'ar' ? 'التقييم' : 'Rating'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                {stats.topTrainers.map((trainer, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                                                    <img src={trainer.image || trainer.profileImage} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black">{typeof trainer.name === 'object' ? (trainer.name[language] || trainer.name.ar) : trainer.name}</span>
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                                                        {typeof trainer.specialty === 'object' ? (trainer.specialty[language] || trainer.specialty.ar) : trainer.specialty}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-12 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(trainer.bookingsCount * 10, 100)}%` }}
                                                        className="h-full bg-primary"
                                                    />
                                                </div>
                                                <span className="text-xs font-black">{trainer.bookingsCount}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-end">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 rounded-lg text-[10px] font-black">
                                                {trainer.rating || "5.0"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Attendance Logs Table (Full Width) */}
            <div className={`${cardBg} rounded-[3rem] border overflow-hidden mt-8`}>
                <div className="p-8 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                    <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3">
                        <UserCheck className="w-5 h-5 text-purple-500" />
                        {language === 'ar' ? 'سجل الحضور الحديث' : 'Recent Attendance Logs'}
                    </h2>
                    <div className="px-4 py-2 bg-purple-500/10 text-purple-500 rounded-full text-xs font-black">
                        {language === 'ar' ? `إجمالي الحضور: ${stats.totalAttendances || 0}` : `Total Attendances: ${stats.totalAttendances || 0}`}
                    </div>
                </div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-start px-4 relative">
                        <thead className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-50 dark:border-white/5 shadow-sm z-10">
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="px-8 py-5 text-start">{language === 'ar' ? 'المستخدم' : 'User'}</th>
                                <th className="px-8 py-5 text-start">{language === 'ar' ? 'الباقة' : 'Package'}</th>
                                <th className="px-8 py-5 text-start">{language === 'ar' ? 'الإجراء' : 'Action'}</th>
                                <th className="px-8 py-5 text-start">{language === 'ar' ? 'التاريخ/الوقت' : 'Date/Time'}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {stats.recentAttendances?.map((record, i) => (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-5">
                                        <span className="text-xs font-black">{getText(record.userName)}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-[10px] text-gray-500 font-bold">{getText(record.packageName)}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black ${record.action > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                            {record.action > 0 ? '+1' : '-1'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-[10px] text-gray-400">
                                        {record.date?.toDate ? record.date.toDate().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }) : new Date(record.date).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </td>
                                </tr>
                            ))}
                            {(!stats.recentAttendances || stats.recentAttendances.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-10 text-center text-gray-400 text-xs font-bold">
                                        {language === 'ar' ? 'لا توجد سجلات حضور حتى الآن' : 'No attendance logs found yet'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
