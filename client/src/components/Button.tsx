import styled from "styled-components";
import { UI_COLORS } from "../theme";

export const Button = styled.button<{
  variant: "primary" | "secondary";
}>`
  background-color: ${(props) =>
    props.variant === "primary"
      ? UI_COLORS.BACKGROUND.DEFAULT
      : UI_COLORS.BACKGROUND.DARK};
  border: 2px solid
    ${(props) =>
      props.variant === "primary"
        ? UI_COLORS.FOREGROUND.DEFAULT
        : UI_COLORS.FOREGROUND.LIGHT};
  height: 3em;
  width: 10em;
  color: ${(props) =>
    props.variant === "primary"
      ? UI_COLORS.FOREGROUND.DEFAULT
      : UI_COLORS.FOREGROUND.LIGHT};
  font-weight: bold;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1em;
`;
