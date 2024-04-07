export const verifyDate = (date: string, time: string): boolean => {
    
    const dateOffset = new Date().getTimezoneOffset() * -1;

    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + dateOffset);

    [date] = date.split('T')

    const matchDate = new Date(`${date}T${time}.000Z`);
    console.log(matchDate, currentDate)
    if(matchDate < currentDate) return false;
    
    return true;
}