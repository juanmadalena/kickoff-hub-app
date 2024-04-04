import { Match, orderOptions } from '@/interfaces'

type orderMatchesByKeyProps = {
    key: keyof Match;
    order: keyof typeof orderOptions;
    matches: Match[];
}

export const orderMatchesByTitle = ( { key, order, matches }: orderMatchesByKeyProps ): Match[] => {
    try{
        let orderedMatches = matches;

        if(key === 'date') {

            if(order === 'ASCENDING') orderedMatches = matches.sort((a: any, b: any) => (a.title) - (b.title))
            if(order === 'DESCENDING') orderedMatches = matches.sort((a: any, b: any) => (b.title) - (a.title))
        }else{

            if(order === 'ASCENDING') orderedMatches = matches.sort(orderStringAsc)
            if(order === 'DESCENDING') orderedMatches = matches.sort(orderStringDesc)
        }

        return orderedMatches;

    }catch(error){
        return matches;
    }
}


const orderStringAsc = (a: any, b: any) => {
    if (a.title < b.title) {
        return -1;
    }
    if (a.title > b.title) {
        return 1;
    }
    return 0;
}

const orderStringDesc = (a: any, b: any) => {
    if (a.title > b.title) {
        return -1;
    }
    if (a.title < b.title) {
        return 1;
    }
    return 0;
}