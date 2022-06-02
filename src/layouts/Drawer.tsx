import * as React from "react"
import styled from "styled-components"
import { theme } from '@src/styles/theme'

const StyledDrawer = styled.div<{ width: string; open: boolean }>`
  position: fixed;
  top: 0;
  z-index: 99999;

  background-color: #fff;
  border-left: 1px solid black;
  height: 100%;

  transition: right 0.5s cubic-bezier(0.82, 0.085, 0.395, 0.895);

  width: ${props => props.width};
  right: -${props => props.width};
  ${props => (props.open ? `right: 0;` : `right: -${props.width}`)};
`

const StyledDrawerHeader = styled.header`
  height: 50px;
`

const StyledDrawerWrapper = styled.div`
  height: 100%;
  padding: ${theme.spacing(2)}
`

interface DrawerProps {
  open?: boolean
  width?: string
  onClose?: () => void
}

const Drawer: React.FC<DrawerProps> = ({
  open = true,
  width = "300px",
  onClose = () => {},
}) => {
  let touchX = 0

  const onTouchStart = event => {
    const myTouch = event.touches[0]
    const x = myTouch?.pageX ?? 0
    touchX = x
  }

  const onTouchEnd = event => {
    const myTouch = event.changedTouches[0]
    const x = myTouch?.pageX ?? 0
    if (touchX < x) {
      onClose()
    } else {
      // open
    }
  }

  return (
    <>
      <StyledDrawer
        width={width}
        open={open}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <StyledDrawerHeader></StyledDrawerHeader>
        <hr />
        <StyledDrawerWrapper>In Ready...</StyledDrawerWrapper>
      </StyledDrawer>
    </>
  )
}

export default Drawer
