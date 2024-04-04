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

    filteredMatches = groupMatchesByKey(group, filteredMatches);

    filteredMatches = orderMatchesByTitle({ key: group, order, matches: filteredMatches }); 

    return filteredMatches;
}