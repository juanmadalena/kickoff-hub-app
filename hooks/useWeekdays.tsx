import { useEffect, useState } from "react";

import { formatDateToString } from "@/utils/formatDateToString";

interface Weekday {
    day: string;
    date: number;
    fullDate: string;
}

enum Days { Sun, Mon, Tue, Wed, Thu, Fri, Sat };

export const useWeekdays = ( initialDate: Date, numberOfDays: number = 8 ) => {

    const [ dayList, setDayList ] = useState<Weekday[]>([]);

    useEffect(() => {
        setDayList(getWeekdays());
    }, []);

    const getWeekdays = () : Weekday[] => {
        const weekdays: Weekday[] = [];

        for (let i = 0; i < numberOfDays; i++) {
            const date = new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate() + i);
            const day = Days[date.getDay()];
            weekdays.push({
                day,
                date: date.getDate(),
                fullDate: formatDateToString(date)
            });
        }

        return weekdays;
    
    }

    return {
        dayList
    }
};