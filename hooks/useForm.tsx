import { useState } from 'react';

export const useForm = <T extends Object>( initState: T ) => {
    
    const [state, setState] = useState<T>( initState );

    const onChange = async ( value: string | string[], field: keyof T | Array<keyof T> ) => {
        if(Array.isArray(field)){
            console.log("pre-loop",state)
            for await (const fieldIndex of field) {
                console.log("loop",fieldIndex, value[field.indexOf(fieldIndex)])
                console.log("loop",state)
                setState({
                    ...state,
                    [fieldIndex]: value[field.indexOf(fieldIndex)]
                });
            }
            // field.forEach((fieldIndex, index) => {
            //     console.log(state)
            //     setState({
            //         ...state,
            //         [fieldIndex]: value[index]
            //     });
            // });
        }else{
            setState({
                ...state,
                [field]: value
            });
        }
    }

    return {
        ...state,
        form: state,
        onChange,
    }

}