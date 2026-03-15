"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useApp } from '@/context/AppContext';

export default function Navigation() {
    const pathname = usePathname();
    const { t, language } = useApp();

    const links = [
        { name: t('home'), href: '/' },
        { name: t('packages'), href: '/packages' },
        { name: t('trainers'), href: '/trainers' },
        { name: t('store'), href: '/store' },
        { name: t('booking.title'), href: '/booking' },
    ];

    return (
        <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`font-bold transition-all ${
                        link.href === '/' 
                        ? pathname === '/' 
                        : pathname.startsWith(link.href) 
                        ? 'text-primary' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                >
                    {link.name}
                </Link>
            ))}
        </nav>
    );
}
