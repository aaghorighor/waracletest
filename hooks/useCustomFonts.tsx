import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';

export function useCustomFonts() {
    const [isReady, setIsReady] = useState(false);
    const [fontsLoaded] = useFonts({        
        "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
        "Roboto-Italic": require("../assets/fonts/Roboto-Italic.ttf"),
        "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf")        
    });   

    useEffect(() => {
        async function prepare() {
            if (fontsLoaded) {             
                setIsReady(true);
            } 
        }

        prepare();
    }, [fontsLoaded]);
  
    return isReady;
}
