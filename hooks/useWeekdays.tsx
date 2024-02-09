import { useEffect, useState } from "react";

interface Weekday {
    day: string;
    date: number;
    fullDate: Date;
}

enum Days { Sun, Mon, Tue, Wed, Thu, Fri, Sat };

export const useWeekdays = () => {
    
    const NUM_DAYS = 8;

    const [ dayList, setDayList ] = useState<Weekday[]>([]);
    const [ selectedDate, setSelectedDate ] = useState<Weekday>();

    useEffect(() => {
        setDayList(getWeekdays());
    }, []);

    useEffect(() => {
        setSelectedDate(dayList[0]);
    }, [dayList]);

    const today = new Date();

    const getWeekdays = () : Weekday[] => {
        const weekdays: Weekday[] = [];

        for (let i = 0; i < NUM_DAYS; i++) {
            const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
            const day = Days[date.getDay()];
            weekdays.push({
                day,
                date: date.getDate(),
                fullDate: date
            });
        }

        return weekdays;
    
    }

    return {
        dayList,
        selectedDate,
        setSelectedDate
    }
};