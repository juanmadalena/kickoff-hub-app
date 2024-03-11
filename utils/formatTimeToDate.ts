export const formatTimeToDate = (time: string) => {
    const date = new Date();
    const [hours, minutes] = time.split(':');
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return date;
}