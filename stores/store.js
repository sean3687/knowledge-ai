import create from 'zustand';

const useAccountInfoStore = create((set) => ({
  labelArray: [],
  username:"",
  // Set the entire array
  setLabelArray: (newArray) => set({ labelArray: newArray }),
  setUsername: (newString)=> set({username: newString}),
  
}));

export default useAccountInfoStore;
