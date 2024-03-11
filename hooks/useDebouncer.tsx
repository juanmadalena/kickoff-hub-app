import { useEffect, useState } from 'react';

export const useDebouncer = (input: string = '', time: number = 500) => {
    
    const [ debouncedValue, setDebouncedValue ] = useState(input)

    useEffect(() => {
    
        const timeout = setTimeout(() => {
          setDebouncedValue(input);
        }, time );
    
      
        return () => {
          clearTimeout(timeout);
        }
      }, [input])

    return {
        debouncedValue
    }
};

export default useDebouncer;