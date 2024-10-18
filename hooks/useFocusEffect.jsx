import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const useFocus = () => {
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);      
      return () => {       
        setIsFocused(false);
      };
    }, [])
  );

  useEffect(() => {
    return () => {
      setIsFocused(false); 
    };
  }, []);

  return {
    isFocused,
  };
};

export { useFocus };