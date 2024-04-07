import { Match, Player } from "@/interfaces";

    //check if the match is available
export const checkIfMatchIsAvailable = (match: Match | undefined, playersList?: Player[] | undefined, userId?: string): 'join' | 'leave' | 'full' | 'disabled' => {
    if(!match) return 'disabled';
    
    //Check if the match is in the past
    const formatDate = match?.date.split('T')[0]
    const matchDate = new Date(formatDate+'T'+match?.time+'.000Z').getTime();
    
    const timeOffset = new Date().getTimezoneOffset() * 60000 * -1;
    const currentDate = new Date().getTime() + timeOffset;

    if( matchDate < currentDate ){
        return 'disabled';
    }

    //Check if the match is full
    if( match?.num_players! >= match?.max_players!){
        return 'full';
    }
    
    //Check if the user is already in the match
    if( playersList?.find(playersList => playersList.id === userId ) ){
        return 'leave';
    }

    return 'join';
}