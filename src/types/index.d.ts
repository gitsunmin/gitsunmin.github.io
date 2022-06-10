declare module "*.svg" {
  const content: any
  export default content
}

/**
 * * media 적용 시 필요한 DeviceType들을 선언한 것
 */
type DeviceType = "desktop" | "tablet" | "mobile"

/**
 * * Menu의 Tree 구조를 나타낸 type
 */
type Menu = {
  id: MenuIdType
  url: MenuURLType
  title: MenuTitleType
  icon?: string
  open?: boolean
  children?: Menu[]
}
