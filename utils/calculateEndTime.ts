export const calculateEndTime = (startDate: string, startTime: string, duration: string, sumInMinutes?: number): Date => {
    try{
        const [startHour, startMinute] = startTime.split(':').map(Number);
        
        const offset = new Date().getTimezoneOffset() * -1;

        // startDate + startTime
        let startDateFormatted = new Date(startDate);
        startDateFormatted.setHours(startHour);
        startDateFormatted.setMinutes(startMinute + offset);

        const [hours, minutes] = duration.split(':').map(Number);

        const endDate = new Date(startDateFormatted.getTime());
        endDate.setHours(endDate.getHours() + hours);
        endDate.setMinutes(endDate.getMinutes() + minutes);

        if(sumInMinutes) {
            const sumDate = new Date(endDate.getTime() + sumInMinutes * 60 * 1000);
            return sumDate;
        }
        return endDate;
    }
    catch(e){
        return new Date();
    }
}