import { MenuId, MenuTitle, MenuURL } from "@src/types/enums"

export const MENU: Menu[] = [
  {
    id: MenuId.BLOG,
    url: MenuURL.BLOG,
    title: MenuTitle.BLOG,
    icon: "Documents",
  },
  {
    id: MenuId.SANDBOX,
    url: MenuURL.SANDBOX,
    title: MenuTitle.SANDBOX,
    icon: "Toys",
    open: false,
  },
]
