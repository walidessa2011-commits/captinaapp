import os

file_path = r'c:\Users\Dell\Desktop\Captina_app_new\src\app\booking\page.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the Step 4 block using unique tokens.
start_token = '{step === 4 && ('
end_token = ')}'
# But ')}' is not unique. 
# Let's find the 'AnimatePresence' after it.

# Look for:
# {step === 4 && (
#     <AnimatePresence mode="wait">

# And end with:
#     </AnimatePresence>
# )}

import re

# This regex finds Step 4 block and replaces it.
# We'll be very careful with the regex to not match other steps.
pattern = re.compile(r'\{step === 4 && \(\s+<AnimatePresence mode="wait">.*?</AnimatePresence>\s+\)\}', re.DOTALL)

correct_step_4 = """{step === 4 && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white">
                                        {t('booking.reviewBooking')}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        {/* Booking Details List */}
                                        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-5">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-primary/10 rounded-xl">
                                                    <Layout className="w-5 h-5 text-primary" />
                                                </div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">
                                                    {language === 'ar' ? 'تفاصيل الحجز' : 'Booking Details'}
                                                </h4>
                                            </div>

                                            <div className="space-y-4">
                                                {[
                                                    { 
                                                        label: t('booking.sport'), 
                                                        value: typeof bookingData.sport === 'object' ? getText(bookingData.sport) : bookingData.sport, 
                                                        icon: Activity, color: 'text-primary', bg: 'bg-primary/10' 
                                                    },
                                                    { 
                                                        label: t('booking.location'), 
                                                        value: bookingData.locationType === 'home' 
                                                            ? (bookingData.address ? `${bookingData.address.title}: ${bookingData.address.details}` : `${t('booking.atHome')} (+50)`)
                                                            : (bookingData.selectedGym?.name || '-'), 
                                                        icon: MapPin, color: 'text-blue-500', bg: 'bg-blue-500/10' 
                                                    },
                                                    { label: t('booking.selectTrainer'), value: bookingData.trainer ? getText(bookingData.trainer.name) : '-', icon: User, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                                    { label: t('booking.selectDateTime'), value: `${bookingData.date} • ${bookingData.time}`, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                                    isTrial ? {
                                                        label: language === 'ar' ? 'نوع الجلسة' : 'Session Type',
                                                        value: language === 'ar' ? 'حصة تجريبية مجانية (جلسة واحدة)' : 'Free Trial Session (1 Session)',
                                                        icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10'
                                                    } : (bookingData.offerId || bookingData.packageId) && {
                                                        label: bookingData.offerId ? (language === 'ar' ? 'العرض المختار' : 'Selected Offer') : (language === 'ar' ? 'الباقة المختارة' : 'Selected Package'),
                                                        value: bookingData.offerId || bookingData.packageId,
                                                        icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10'
                                                    }
                                                ].filter(Boolean).map((item, i) => (
                                                    <div key={i} className="flex items-center gap-4 text-start group">
                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.bg}`}>
                                                            <item.icon className={`w-5 h-5 ${item.color}`} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                                            <p className="text-xs font-black text-gray-900 dark:text-white">
                                                                {typeof item.value === 'object' ? getText(item.value) : item.value}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Personal Data Confirmation */}
                                        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-6 text-start">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-primary/10 rounded-xl">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">
                                                    {language === 'ar' ? 'تعديل البيانات الشخصية' : 'Edit Personal Info'}
                                                </h4>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none ml-1">{language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}</label>
                                                    <input 
                                                        type="text"
                                                        value={userProfile?.fullName || userProfile?.displayName || ''}
                                                        onChange={(e) => setUserProfile(prev => ({ ...prev, fullName: e.target.value }))}
                                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-primary transition-colors"
                                                    />
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none ml-1">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                                                        <div className="relative">
                                                            <input 
                                                                type="tel"
                                                                value={userProfile?.phone || userProfile?.phoneNumber || auth.currentUser?.phoneNumber || ''}
                                                                onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-primary transition-colors"
                                                            />
                                                            {(userProfile?.phone_verified || auth.currentUser?.phoneNumber) && (
                                                                <div className={`absolute ${language === 'en' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-lg border border-emerald-500/20`}>
                                                                    <ShieldCheck className="w-3 h-3" />
                                                                    <span className="text-[8px] font-black uppercase tracking-tighter">{language === 'ar' ? 'موثق' : 'Verified'}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none ml-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
                                                        <div className="relative">
                                                            <input 
                                                                type="email"
                                                                value={userProfile?.email || auth.currentUser?.email || ''}
                                                                onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-primary transition-colors"
                                                            />
                                                            {auth.currentUser?.emailVerified && (
                                                                <div className={`absolute ${language === 'en' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 flex items-center gap-1 bg-blue-500/10 text-blue-500 px-2 py-1 rounded-lg border border-blue-500/20`}>
                                                                    <ShieldCheck className="w-3 h-3" />
                                                                    <span className="text-[8px] font-black uppercase tracking-tighter">{language === 'ar' ? 'موثق' : 'Verified'}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cost Summary & Terms */}
                                        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-gray-100 dark:border-white/5 shadow-2xl space-y-6 text-start relative overflow-hidden group">
                                            {/* Decorative Background for Summary */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                                            <div className="space-y-4">
                                                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <Receipt className="w-4 h-4 text-primary" />
                                                    {t('booking.orderSummary')}
                                                </h3>

                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500 dark:text-gray-400">
                                                        <span>{isTrial ? (language === 'ar' ? 'رسوم الحصة التجريبية' : 'Trial Session Fee') : (language === 'ar' ? 'قيمة الاشتراك' : 'Subscription Value')}</span>
                                                        <span className="line-through opacity-50">150 {t('booking.currency')}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/10">
                                                        <span className="flex items-center gap-2">
                                                            <Sparkles className="w-4 h-4" />
                                                            {isTrial ? (language === 'ar' ? 'عرض الحصة التجريبية' : 'Trial Offer') : (language === 'ar' ? 'خصم خاص' : 'Special Discount')}
                                                        </span>
                                                        <span>{isTrial ? '0' : '150'} {t('booking.currency')}</span>
                                                    </div>

                                                    {bookingData.locationType === 'home' && (
                                                        <div className="flex justify-between items-center text-xs font-bold text-gray-500 dark:text-gray-400 px-1 pt-2">
                                                            <span className="flex items-center gap-2">
                                                                <Home className="w-3.5 h-3.5" />
                                                                {t('booking.atHome')}
                                                            </span>
                                                            <span className="font-black text-gray-900 dark:text-white">+50 {t('booking.currency')}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-4 mt-4 border-t-2 border-dashed border-gray-100 dark:border-white/5">
                                                    <div className="flex justify-between items-center">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('booking.totalToPay')}</p>
                                                            <p className="text-2xl font-black text-gray-900 dark:text-white">
                                                                {isTrial ? (bookingData.locationType === 'home' ? 50 : 0) : (bookingData.locationType === 'home' ? 200 : 150)}
                                                                <span className="text-[10px] font-black text-primary ml-1 uppercase">{t('booking.currency')}</span>
                                                            </p>
                                                        </div>
                                                        <div className="bg-primary/10 text-primary p-3 rounded-2xl">
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Terms & Conditions Checkbox */}
                                            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 transition-all hover:border-primary/30">
                                                <div className="relative flex items-center h-5">
                                                    <input
                                                        id="terms-checkbox"
                                                        type="checkbox"
                                                        checked={acceptedTerms}
                                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all cursor-pointer"
                                                    />
                                                </div>
                                                <label htmlFor="terms-checkbox" className="text-[10px] font-bold text-gray-500 dark:text-gray-400 leading-normal cursor-pointer">
                                                    {language === 'ar' ? 'أوافق على ' : 'I agree to the '}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setShowTerms(true);
                                                        }}
                                                        className="text-primary font-black underline underline-offset-2 hover:opacity-80 transition-opacity"
                                                    >
                                                        {language === 'ar' ? 'الشروط والأحكام وسياسة التدريب' : 'Terms & Conditions and Training Policy'}
                                                    </button>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}"""

# If we can't match it exactly, we'll use a more flexible search.
if pattern.search(content):
    content = pattern.sub(correct_step_4, content)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced Step 4 block.")
else:
    print("Matching failed. Attempting alternative replacement strategy...")
    # Alternative: find the lines by text content
    lines = content.splitlines()
    start_idx = -1
    for i, line in enumerate(lines):
        if '{step === 4 && (' in line:
            start_idx = i
            break
    
    if start_idx != -1:
        # Find where to stop.
        # We want to stop at the next ')}' that is followed by '</div>' (main step container)
        # or just find the end of the AnimatePresence.
        end_idx = -1
        for i in range(start_idx, len(lines)):
            if '</AnimatePresence>' in lines[i]:
                # Next line should be )}
                if i+1 < len(lines) and ')}' in lines[i+1]:
                    end_idx = i + 1
                    break
        
        if end_idx != -1:
            print(f"Found Step 4 at lines {start_idx+1} to {end_idx+1}. Replacing...")
            new_lines = lines[:start_idx] + [correct_step_4] + lines[end_idx+1:]
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write("\\n".join(new_lines))
            print("Successfully replaced Step 4 block using line-by-line strategy.")
        else:
            print("Could not find the end of Step 4 block.")
    else:
        print("Could not find the start of Step 4 block.")
