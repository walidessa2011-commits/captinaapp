"use client";
import { motion } from "framer-motion";
import { 
    FileText, Shield, ChevronRight, ChevronLeft, 
    CheckCircle2, AlertCircle, Scale, PenTool,
    Lock, RefreshCcw, Eye
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from "@/context/AppContext";

export default function TermsAndConditions() {
    const { language } = useApp();

    const sections = [
        {
            title: language === 'ar' ? 'قبول الشروط' : 'Acceptance of Terms',
            content: language === 'ar' 
                ? 'باستخدامك لتطبيق كابتينا، فإنك توافق على الالتزام بشروط الاستخدام الموضحة هنا. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام التطبيق.' 
                : 'By using the Captina application, you agree to comply with the terms of use outlined here. If you do not agree to these terms, please do not use the application.',
            icon: CheckCircle2
        },
        {
            title: language === 'ar' ? 'مسؤولية المستخدم' : 'User Responsibility',
            content: language === 'ar'
                ? 'المستخدم مسؤول عن دقة البيانات المقدمة وصحة حالته الصحية لممارسة الرياضة. كابتينا ليست مسؤولة عن أي إصابات ناتجة عن التدريب.'
                : 'The user is responsible for the accuracy of the data provided and the correctness of their health status for exercising. Captina is not responsible for any injuries resulting from training.',
            icon: Shield
        },
        {
            title: language === 'ar' ? 'سياسة الإلغاء والاسترجاع' : 'Cancellation & Refund Policy',
            content: language === 'ar'
                ? 'يمكن إلغاء الحجز قبل 24 ساعة من الموعد. الاسترجاع المالي يخضع لسياسات الباقات المشترك بها والموضحة وقت الشراء.'
                : 'Bookings can be cancelled 24 hours before the appointment. Refunds are subject to the policies of the subscribed packages shared at the time of purchase.',
            icon: RefreshCcw
        },
        {
            title: language === 'ar' ? 'حقوق الملكية الفكرية' : 'Intellectual Property Rights',
            content: language === 'ar'
                ? 'جميع المحتويات المتوفرة في التطبيق هي ملك لمنصة كابتينا. لا يجوز نسخ أو توزيع أي جزء من المحتوى بدون إذن مسبق.'
                : 'All contents available in the application are the property of Captina platform. No part of the content may be copied or distributed without prior permission.',
            icon: Scale
        },
        {
            title: language === 'ar' ? 'الخصوصية' : 'Privacy',
            content: language === 'ar'
                ? 'نحن نلتزم بحماية خصوصية بياناتك. يمكنك مراجعة سياسة الخصوصية الكاملة لمعرفة كيفية التعامل مع بياناتك الشخصية.'
                : 'We are committed to protecting the privacy of your data. You can review the full privacy policy to know how your personal data is handled.',
            icon: Eye
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1a] transition-colors duration-300 pb-12">
            {/* Header / Breadcrumbs - Compact Version */}
            <header className="relative z-20 pt-6 px-4">
                <div className="max-w-2xl mx-auto flex flex-col items-center">
                    {/* Breadcrumbs */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest opacity-50"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <Link href="/settings" className="hover:text-primary transition-colors">{language === 'ar' ? 'الإعدادات' : 'Settings'}</Link>
                        <span className="text-gray-500">
                            {language === 'ar' ? ' < ' : ' > '}
                        </span>
                        <span className="text-primary">{language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</span>
                    </motion.div>

                    {/* Consolidated Title Line - Horizontal */}
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                            <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter italic uppercase text-center">
                                {language === 'ar' 
                                    ? '( حقوقك والتزاماتك - الشروط والأحكام )' 
                                    : '( Your Rights and Obligations - Terms & Conditions )'}
                            </h1>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        </motion.div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 max-w-2xl">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Scale className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                        {language === 'ar' ? 'اتفاقية الاستخدام' : 'User Agreement'}
                    </h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {language === 'ar' ? 'آخر تحديث: 1 مارس 2026' : 'Last Updated: March 1, 2026'}
                    </p>
                </div>

                <div className="space-y-6">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm text-start">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                                    <section.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    {section.title}
                                </h3>
                            </div>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed pl-2 border-l-2 border-primary/10 ml-5">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-slate-900 rounded-[2.5rem] text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <Shield className="w-8 h-8 mx-auto mb-4 text-primary" />
                        <h4 className="text-sm font-black mb-2">{language === 'ar' ? 'هل لديك أسئلة؟' : 'Have questions?'}</h4>
                        <p className="text-[10px] text-white/60 mb-6 px-4">
                            {language === 'ar' 
                                ? 'إذا كان لديك أي استفسار حول هذه الشروط، لا تتردد في التواصل معنا.' 
                                : 'If you have any questions about these terms, feel free to contact us.'}
                        </p>
                        <Link 
                            href="/help"
                            className="inline-block bg-primary text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider"
                        >
                            {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                        </Link>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                </div>
            </main>
        </div>
    );
}
