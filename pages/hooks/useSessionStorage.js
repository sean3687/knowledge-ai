import { useState, useEffect } from "react";

function getSavedValue(key, initialValue) {
  // Check if window is defined (i.e., if in browser environment)
  if (typeof window === 'undefined') {
    // Handle SSR case
    return initialValue instanceof Function ? initialValue() : initialValue;
  }

  const savedValue = sessionStorage.getItem(key);
  if (savedValue) return JSON.parse(savedValue);  // Use JSON.parse to handle non-string values

  if (initialValue instanceof Function) return initialValue();
  return initialValue;
}

export default function useSessionStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue);
  });

  useEffect(() => {
    // Check if window is defined before using sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(key, JSON.stringify(value)); // Use JSON.stringify to handle non-string values
    }
  }, [value, key]); // Add 'key' to the dependency array

  return [value, setValue];
}
