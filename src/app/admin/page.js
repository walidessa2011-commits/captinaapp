"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRoot() {
    const router = useRouter();

    useEffect(() => {
        router.push('/admin/dashboard');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
