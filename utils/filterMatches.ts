import { Match, showOptions, orderOptions } from '@/interfaces';
import { groupMatchesByKey } from '@/utils/groupMatchesByKey';
import { orderMatchesByTitle } from '@/utils/orderMatchesByTitle';

type FiltersComponentProps = {
    matches: Match[];
    filter: keyof typeof showOptions;
    group: keyof Match;
    order: keyof typeof orderOptions;
}

export const filterMatches = ( { matches, filter, group, order }: FiltersComponentProps ): Match[] => {
    try{
        let filteredMatches = matches;
    
        switch(filter) {
            case 'ALL':
                filteredMatches = matches;
                break;
            case 'UPCOMING':
                filteredMatches = matches.filter((match: any) => new Date(match.date) > new Date());
                break;
            case 'PAST':
                filteredMatches = matches.filter((match: any) => new Date(match.date) < new Date());
                break;
            default:
                filteredMatches = matches;
        }
    
        if(filteredMatches.length === 0) return filteredMatches;
    
        filteredMatches = groupMatchesByKey(group, filteredMatches);
    
        filteredMatches = orderMatchesByTitle({ key: group, order, matches: filteredMatches }); 
    
        return filteredMatches;
    }
    catch(e) {
        return matches;
    }
}