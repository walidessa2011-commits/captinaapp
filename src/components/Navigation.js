"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Home } from 'lucide-react';

import { useApp } from '@/context/AppContext';

export default function Navigation() {
    const pathname = usePathname();
    const { t, language } = useApp();

    const links = [
        { name: t('home'), href: '/', icon: Home },
        { name: language === 'ar' ? 'حصة تجريبية' : 'Trial Session', href: '/booking?trial=true', icon: Sparkles, color: 'text-primary' },
        { name: t('packages'), href: '/packages' },
        { name: t('trainers'), href: '/trainers' },
        { name: t('store'), href: '/store' },
        { name: t('library'), href: '/library' },
    ];

    return (
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 font-black transition-all text-[11px] uppercase tracking-wider ${
                        link.href.includes('trial=true')
                        ? 'bg-primary/10 text-primary px-5 py-2.5 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5 hover:scale-105 active:scale-95 transition-all'
                        : link.href === '/' 
                        ? pathname === '/' 
                        ? 'text-primary' 
                        : 'text-gray-500 hover:text-primary'
                        : pathname.startsWith(link.href) 
                        ? 'text-primary' 
                        : 'text-gray-500 hover:text-primary'
                    }`}
                >
                    {link.icon && <link.icon className={`w-4 h-4 ${link.color || ''}`} />}
                    {link.name}
                </Link>
            ))}
        </nav>
    );
}
