export default function Contact() {
    return (
        <div className="container mx-auto px-4 py-20 max-w-4xl">
            <div className="bg-white rounded-[40px] shadow-2xl border border-gray-50 overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-primary p-12 text-white text-right">
                    <h2 className="text-4xl font-black mb-6">تواصل معنا</h2>
                    <p className="text-white/80 text-lg mb-8">نحن هنا للإجابة على جميع استفساراتك حول الدورات والمدربين.</p>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 justify-end">
                            <div>
                                <p className="font-bold">الموقع</p>
                                <p className="text-white/70">الرياض، حي المونسية</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 justify-end">
                            <div>
                                <p className="font-bold">الجوال</p>
                                <p className="text-white/70">0551447768</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:w-1/2 p-12 text-right">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">الاسم بالكامل</label>
                            <input type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-primary outline-none transition-all" placeholder="أدخل اسمك" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">رقم الجوال</label>
                            <input type="tel" className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-primary outline-none transition-all" placeholder="05xxxxxxxx" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">الرسالة</label>
                            <textarea className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:border-primary outline-none transition-all h-32" placeholder="كيف يمكننا مساعدتك؟"></textarea>
                        </div>
                        <button className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                            إرسال الرسالة
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
