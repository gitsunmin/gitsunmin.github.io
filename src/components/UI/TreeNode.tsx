import { theme } from "@src/styles/theme"
import React, { useState } from "react"
import styled from "styled-components"
import { Toys } from "@styled-icons/material-rounded/Toys"
import { movePath } from "@src/utils"
import { Documents } from "@styled-icons/ionicons-solid/Documents"

const StyledTreeNode = styled.ul`
  input[type="checkbox"] {
    display: none;
  }
  list-style: none;
  margin-bottom: 0;
  margin-top: 0;
`

const StyledList = styled.li`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  margin: ${theme.spacing(2)} 0;
  label:hover {
    cursor: pointer;
    color: ${theme.color.primary};
  }

  .arrow-right {
    margin-left: 12px;
  }
  .prefix-icon {
    margin-right: ${theme.spacing(2)};
  }
`

const StyledPrefixIcon = styled.span`
  margin-right: ${theme.spacing(2)};
`

const iconMap = {
  Toys: <Toys width={20} color={theme.color.gainsboro} />,
  Documents: <Documents width={20} color={theme.color.gainsboro} />,
}

const TreeNode: React.FC<{ node: Menu }> = ({ node }) => {
  const [isOpen, setIsOpen] = useState(node.open)
  const changeNode = (to: string) => {
    setIsOpen(!isOpen)
    to && movePath(to)
  }
  return (
    <StyledTreeNode>
      <StyledList>
        <span>
          {(node.icon && (
            <StyledPrefixIcon>{iconMap[node.icon]}</StyledPrefixIcon>
          )) ||
            null}
          <input type="checkbox" id={node.id} onInput={() => changeNode(node.url)} />
          <label htmlFor={node.id}>{node.title} </label>
        </span>
        {isOpen && node.children
          ? node.children.map(child => {
              return <TreeNode node={child} key={child.id} />
            })
          : null}
      </StyledList>
    </StyledTreeNode>
  )
}

export default TreeNode
