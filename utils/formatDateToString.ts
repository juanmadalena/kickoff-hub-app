type formats =  
    |'yyyy-mm-dd'
    |'dd/mm'

export function formatDateToString(date: Date | string, format?: formats): string {
    if(!date) return '';

    if(typeof date === 'string') date = new Date(date);
    
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    switch(format){
        case 'yyyy-mm-dd':
            return `${year}-${month > 10 ? month : 0 +''+ month}-${day > 10 ? day : 0 +''+ day}`;
        case 'dd/mm':
            return `${day > 10 ? day : 0 +''+ day}/${month > 10 ? month : 0 +''+ month}`;
        default:
            return `${year}-${month > 10 ? month : 0 +''+ month}-${day > 10 ? day : 0 +''+ day}`;
    }
}