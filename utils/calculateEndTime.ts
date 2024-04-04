export const calculateEndTime = (startDate: string, startTime: string, duration: string, sumInMinutes?: number): Date => {
    try{
        const [startHour, startMinute] = startTime.split(':').map(Number);
        
        // startDate + startTime
        let startDateFormatted = new Date(startDate);
        startDateFormatted.setHours(startHour);
        startDateFormatted.setMinutes(startMinute);
    
        const [hours, minutes] = duration.split(':').map(Number);
    
        const endDate = new Date(startDateFormatted.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);
    
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