import { Match } from "@/interfaces";


export const groupMatchesByKey = (key: keyof Match, matches: Match[]): Match[] => {
    try{
        if(!matches) return matches;

        const groupedMatches: any[] = matches?.reduce((acc: any, match: any) => {
            let value = key === 'date' ? new Date(match[key]).getTime() : match[key];
        
            const existingGroup = acc?.find((group: any) => group.title === value);
            
            if (!existingGroup) {
                acc.push({ title: value, data: [match] });
            } else {
                existingGroup.data.push(match);
            }
        
            return acc;
    
        }, []) || [];

        return groupedMatches;
    }catch(error){
        return matches;
    }
};