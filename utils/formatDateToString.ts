type formats =  
    |'yyyy-mm-dd'
    |'dd/mm'
    |'dd/mm/yyyy'
    |'hh:mm';

export function formatDateToString(date: Date | string | number, format?: formats): string {
    if(!date) return '';

    if(typeof date === 'string' || typeof date === 'number') date = new Date(date);
    console.log(date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    switch(format){
        case 'yyyy-mm-dd':
            return `${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
        case 'dd/mm':
            return `${day.toString().padStart(2,'0')}/${month.toString().padStart(2,'0')}`;
        case 'dd/mm/yyyy':
            return `${day.toString().padStart(2,'0')}/${month.toString().padStart(2,'0')}/${year}`;
        case 'hh:mm':
            return `${hours.toString().padStart(2,'0') }:${minutes.toString().padStart(2,'0')}`;
        default:
            return `${year}-${month.toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`;
    }
}