export default function Gyms() {
    const gyms = [
        { id: 1, name: "فرع المونسية", location: "الرياض - طريق الأمير محمد بن سلمان", rating: 4.9, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500" },
        { id: 2, name: "فرع الياسمين", location: "الرياض - طريق الملك عبدالعزيز", rating: 4.8, image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=500" }
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-primary mb-8 text-right">فروعنا</h1>
            <div className="grid md:grid-cols-2 gap-8">
                {gyms.map((gym) => (
                    <div key={gym.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row">
                        <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                            <img src={gym.image} alt={gym.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="md:w-1/2 p-8 text-right flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{gym.name}</h3>
                            <p className="text-gray-500 font-medium mb-4">{gym.location}</p>
                            <div className="flex items-center gap-2 mb-6 justify-end">
                                <span className="text-secondary font-bold text-lg">{gym.rating}</span>
                                <span className="text-secondary">★★★★★</span>
                            </div>
                            <button className="bg-primary text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-primary/20">
                                عرض التفاصيل الخريطة
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
