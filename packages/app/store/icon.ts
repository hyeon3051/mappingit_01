import { create } from 'zustand'

interface IconsState {
  icons: string[] | null
  addIcon: (icon: string) => void
  removeIcon: (icon: string) => void
}

export const useIconStore = create<IconsState>()((set) => ({
  icons: [
    'PinOff',
    'Eraser',
    'AArrowUp',
    'MapPinOff',
    'MapPin',
    'Pin',
    'TreePine',
    'ShoppingBag',
    'MapPinned',
    'BellPlus',
  ],
  addIcon: (icon: string) => set((state) => ({ icons: [...state.icons, icon] })),
  removeIcon: (icon: string) => set((state) => ({ icons: state.icons.filter((i) => i !== icon) })),
}))
