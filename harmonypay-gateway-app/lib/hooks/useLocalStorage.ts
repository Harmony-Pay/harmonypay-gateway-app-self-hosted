
import { useState, useEffect } from "react";

function getStorageValue(key: string, defaultValue: any) {
    // getting stored value
    if (typeof window !== "undefined" || typeof window !== undefined || typeof window !== null) {
      const saved = localStorage.getItem(key);
      const initial = saved !== null ? JSON.parse(saved) : defaultValue;
      return initial;
    }
  }
  
  export const useLocalStorage = (key: string, defaultValue: any) => {
    const [value, setValue] = useState(() => {
      return getStorageValue(key, defaultValue);
    });
  
    useEffect(() => {
      // storing input name
      localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
  
    return [value, setValue];
  };