import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';

/**
 * * [Button] props about Style
 * - backgroundColor?: string; // default: primary
 * - color?: string; // default: white
 */
interface ButtonStyleProps {
  backgroundColor?: string;
  color?: string;
}

interface ButtonProps extends ButtonStyleProps {
  children: React.ReactNode;
  onClick?: (event) => void;
}

const StyledButton = styled.button<ButtonStyleProps>`
  padding: 0 ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.spacing(2)};
  cursor: pointer;
  border: none;
  background-color: ${(props) => props.backgroundColor ?? props.theme.color.primary};
  color: ${(props) => props.color ?? props.theme.color.orange};

  display: flex;
  align-items: center;
`;

const Button: React.FC<ButtonProps> = ({ children, backgroundColor, color, onClick }) => {
  return (
    <StyledButton backgroundColor={backgroundColor} color={color} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default Button;
