import create from "zustand";

const useChatInfoStore = create((set) => ({
  summarizeId: -1,
  chatArray: [],
  currentChatId :-1,

  // Set the entire array
  setChatArray: (newArray) => set({ chatArray: newArray }),
  // Add to the chat array
  addChatArray: (newItem) => set((state) => ({
    chatArray: [...state.chatArray, newItem]
  })),

  // Remove the last item from the chat array
  popChatArray: () => set((state) => {
    const newChatArray = [...state.chatArray];
    newChatArray.pop();
    return { chatArray: newChatArray };
  }),
  setSummarizeId: (newInt) => set({ summarizeId: newInt }),
  setCurrentChatId: (newInt) => set({ currentChatId: newInt }),
}));

export default useChatInfoStore;
