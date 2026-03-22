"use client";
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from "@/context/AppContext";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const { language } = useApp();

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-8 py-4 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/10">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-white/10 text-sm font-black rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50"
                >
                    {language === 'ar' ? 'السابق' : 'Previous'}
                </button>
                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-white/10 text-sm font-black rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-50"
                >
                    {language === 'ar' ? 'التالي' : 'Next'}
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        {language === 'ar' ? 'الصفحة' : 'Page'}{' '}
                        <span className="font-black text-primary">{currentPage}</span>{' '}
                        {language === 'ar' ? 'من' : 'of'}{' '}
                        <span className="font-black text-primary">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-2xl shadow-sm -space-x-px overflow-hidden border border-gray-100 dark:border-white/10" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-3 py-2 bg-white dark:bg-white/5 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-30 ${language === 'ar' ? 'rounded-r-2xl' : 'rounded-l-2xl'}`}
                        >
                            <span className="sr-only">Previous</span>
                            {language === 'ar' ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => {
                            const pageNumber = i + 1;
                            // Show first, last, and pages around current
                            if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => onPageChange(pageNumber)}
                                        className={`relative inline-flex items-center px-4 py-2 border-x border-gray-50 dark:border-white/5 text-xs font-black transition-all ${
                                            currentPage === pageNumber
                                                ? 'z-10 bg-primary text-white'
                                                : 'bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else if (
                                pageNumber === currentPage - 2 ||
                                pageNumber === currentPage + 2
                            ) {
                                return (
                                    <span key={pageNumber} className="relative inline-flex items-center px-4 py-2 border-x border-gray-50 dark:border-white/5 bg-white dark:bg-white/5 text-xs font-black text-gray-500">
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}

                        <button
                            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center px-3 py-2 bg-white dark:bg-white/5 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10 disabled:opacity-30 ${language === 'ar' ? 'rounded-l-2xl' : 'rounded-r-2xl'}`}
                        >
                            <span className="sr-only">Next</span>
                            {language === 'ar' ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
