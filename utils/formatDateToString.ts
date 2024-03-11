type formats =  
    |'yyyy-mm-dd'
    |'dd/mm'
    |'dd/mm/yyyy'
    |'hh:mm';

export function formatDateToString(date: Date | string | number, format?: formats): string {
    if(!date) return '';

    if(typeof date === 'string' || typeof date === 'number') date = new Date(date);
    

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    switch(format){
        case 'yyyy-mm-dd':
            return `${year}-${month > 10 ? month : 0 +''+ month}-${day > 10 ? day : 0 +''+ day}`;
        case 'dd/mm':
            return `${day > 10 ? day : 0 +''+ day}/${month > 10 ? month : 0 +''+ month}`;
        case 'dd/mm/yyyy':
            return `${day > 10 ? day : 0 +''+ day}/${month > 10 ? month : 0 +''+ month}/${year}`;
        case 'hh:mm':
            return `${hours > 10 ? hours : 0 +''+hours }:${minutes > 10 ? minutes : 0 +''+ minutes}`;
        default:
            return `${year}-${month > 10 ? month : 0 +''+ month}-${day > 10 ? day : 0 +''+ day}`;
    }
}