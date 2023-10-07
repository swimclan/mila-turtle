import styled from "styled-components";
import { BASE_COLORS } from "../theme";
import { type TypeBaseColors } from "../theme";

export const TriangleUp = styled.div.attrs<{
  width: number;
  color: string;
  y: number;
  x: number;
  theta: number;
}>((props) => ({
  style: {
    rotate: `${props.theta}deg`,
    top: `${props.y - 4}px`,
    left: `${props.x - 10}px`,
  },
}))`
  position: absolute;
  width: 0;
  height: 0;
  border-left: ${(props) => props.width}px solid transparent;
  border-right: ${(props) => props.width}px solid transparent;
  border-bottom: ${(props) => props.width}px solid
    ${(props) => BASE_COLORS[props.color.toUpperCase() as TypeBaseColors]};
`;
