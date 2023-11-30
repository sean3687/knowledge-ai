import { useCallback, useState } from "react";

export const useSessionStorage = (key, initialValue) => {
  // Initialize directly from sessionStorage
  const initialize = () => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [state, setState] = useState(initialize);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(state) : value;
        setState(valueToStore);
        sessionStorage.setItem(key, JSON.stringify(valueToStore));
        
      } catch (error) {
        console.log(error);
      }
    },
    [key]
  );

  return [state, setValue];
}
