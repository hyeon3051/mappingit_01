import { create } from 'zustand'

interface colorsState {
  colors: string[] | null
  addcolor: (color: string) => void
  removecolor: (color: string) => void
}

export const usecolorStore = create<colorsState>()((set) => ({
  colors: [
    '$red10',
    '$blue10',
    '$purple10',
    '$green10',
    '$yellow10',
    '$orange10',
    '$pink10',
    '$gray10',
    '$magenta10',
  ],
  addcolor: (color: string) => set((state) => ({ colors: [...state.colors, color] })),
  removecolor: (color: string) =>
    set((state) => ({ colors: state.colors.filter((i) => i !== color) })),
}))
