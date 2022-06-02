import { atom } from "recoil"

export const DrawerState = atom({
  key: "drawer", // unique ID (with respect to other atoms/selectors)
  default: false,
})
