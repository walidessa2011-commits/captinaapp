"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HorizontalDatePicker = ({ selectedDate, onDateChange, language }) => {
    const [dates, setDates] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        const generateDates = () => {
            const dateList = [];
            const today = new Date();
            for (let i = 0; i < 30; i++) {
                const date = new Date();
                date.setDate(today.getDate() + i);
                dateList.push(date);
            }
            setDates(dateList);
        };
        generateDates();
    }, []);

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short' });
        const weekday = date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'short' });
        return { day, month, weekday, full: date.toISOString().split('T')[0] };
    };

    return (
        <div className="relative w-full overflow-hidden">
            <div 
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-1"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {dates.map((date, idx) => {
                    const info = formatDate(date);
                    const isSelected = selectedDate === info.full;
                    return (
                        <button
                            key={idx}
                            onClick={() => onDateChange(info.full)}
                            className={`flex flex-col items-center justify-center min-w-[70px] h-[100px] rounded-[24px] transition-all duration-300 border-2 ${
                                isSelected 
                                ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30 scale-105' 
                                : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-white/5 text-gray-500 hover:border-primary/30'
                            }`}
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                {info.month}
                            </span>
                            <span className="text-xl font-black my-1">
                                {info.day}
                            </span>
                            <span className={`text-[9px] font-bold uppercase ${isSelected ? 'text-white/90' : 'text-gray-400'}`}>
                                {info.weekday}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default HorizontalDatePicker;
