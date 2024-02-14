import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

const useKeyboardActive = () => {
    const [keyboardActive, setKeyboardActive] = useState(false);
    
    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener('keyboardWillShow', () => setKeyboardActive(true));

        const keyboardHideListener = Keyboard.addListener('keyboardWillHide', () => setKeyboardActive(false));

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        }
    }, []);

    return {
        keyboardActive
    }
};

export default useKeyboardActive;