import { useState, useEffect } from "react";

function getSavedValue(key, initialValue) {
  if (typeof sessionStorage === 'undefined') {
    // Handle the case where sessionStorage is not defined
    return initialValue instanceof Function ? initialValue() : initialValue;
  }

  const savedValue = sessionStorage.getItem(key);
  if (savedValue) return savedValue;

  if (initialValue instanceof Function) return initialValue();
  return initialValue;
}

export default function useSessionStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue);
  });

  useEffect(() => {
   
      sessionStorage.setItem(key, String(value));
    
  }, [value]);

  return [value, setValue];
}
