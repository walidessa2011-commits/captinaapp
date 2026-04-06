"use client";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Sparkles, Home } from 'lucide-react';

import { useApp } from '@/context/AppContext';

import { motion } from 'framer-motion';

export default function Navigation() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isTrial = searchParams.get('trial') === 'true';
    const { t } = useApp();

    const links = [
        { name: t('home'), href: '/', icon: Home },
        { name: t('nav.trialSession'), href: '/booking?trial=true', icon: Sparkles, color: 'text-primary' },
        { name: t('packages'), href: '/packages' },
        { name: t('trainers'), href: '/trainers' },
        { name: t('nav.store'), href: '/store' },
        { name: t('nav.library'), href: '/library' },
    ];

    return (
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
            {links.map((link) => {
                const isHomeLink = link.href === '/';
                const isTrialLink = link.href.includes('trial=true');
                const isActive = isHomeLink 
                    ? pathname === '/' 
                    : isTrialLink 
                        ? (pathname === '/booking' && isTrial)
                        : (pathname.startsWith(link.href) && !isTrialLink);

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`group relative flex items-center gap-2 font-black transition-all text-[11px] uppercase tracking-wider py-2 ${
                            isTrialLink
                            ? `px-5 py-2.5 rounded-2xl border transition-all hover:scale-105 active:scale-95 shadow-lg ${
                                isActive 
                                ? 'bg-primary text-white border-primary shadow-primary/20' 
                                : 'bg-primary/10 text-primary border-primary/20 shadow-primary/5'
                              }`
                            : isActive 
                            ? 'text-primary' 
                            : 'text-gray-500 hover:text-primary'
                        }`}
                    >
                        {link.icon && <link.icon className={`w-4 h-4 ${isTrialLink && isActive ? 'text-white' : (link.color || '')}`} />}
                        <span>{link.name}</span>

                        {isActive && !isTrialLink && (
                            <motion.div 
                                layoutId="nav-underline"
                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-sm shadow-primary/50"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
