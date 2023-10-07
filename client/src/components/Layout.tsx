import styled from "styled-components";
import { UI_COLORS } from "../theme";

export const Layout = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 1fr 4fr 4fr 1fr;
  grid-template-areas:
    "header header"
    "editor canvas"
    "browser canvas"
    "footer footer";
  font-family: "Courier New", Arial, sans-serif;
`;

export const Container = styled.div<{
  width?: string;
  height?: string;
  align?: "right" | "left" | "center";
  border?: Array<"top" | "right" | "bottom" | "left">;
  orientation?: "horizontal" | "vertical";
  padding?: string;
  gridarea?: string;
}>`
  box-sizing: border-box;
  position: relative;
  display: flex;
  padding: ${(props) => props.padding ?? "0"};
  grid-area: ${(props) => props.gridarea};
  flex-direction: ${(props) =>
    props.orientation === "horizontal" ? "row" : "column"};
  justify-content: ${(props) => {
    if (props.orientation === "horizontal") {
      switch (props.align) {
        case "right":
          return "flex-end";
        case "center":
          return "center";
        case "left":
        default:
          return "flex-start";
      }
    }
    return "flex-start";
  }};
  align-items: ${(props) => {
    if (props.orientation !== "horizontal") {
      switch (props.align) {
        case "right":
          return "flex-end";
        case "center":
          return "center";
        case "left":
        default:
          return "flex-start";
      }
    }
    return "center";
  }};
  width: ${(props) => props.width ?? "100%"};
  height: ${(props) => props.height ?? "100%"};
  background-color: ${UI_COLORS.BACKGROUND.DARK};
  color: ${UI_COLORS.FOREGROUND.DEFAULT};
  border-right: ${(props) =>
    props.border?.includes("right")
      ? `1px solid ${UI_COLORS.FOREGROUND.DEFAULT}`
      : "none"};
  border-left: ${(props) =>
    props.border?.includes("left")
      ? `1px solid ${UI_COLORS.FOREGROUND.DEFAULT}`
      : "none"};
  border-top: ${(props) =>
    props.border?.includes("top")
      ? `1px solid ${UI_COLORS.FOREGROUND.DEFAULT}`
      : "none"};
  border-bottom: ${(props) =>
    props.border?.includes("bottom")
      ? `1px solid ${UI_COLORS.FOREGROUND.DEFAULT}`
      : "none"};
`;

export const SimpleList = styled.ul`
  list-style: none;
  padding: 1em;
`;

export const RightAlignedContainer = styled(Container)`
  justify-content: flex-end;
`;

export const LeftAlignedContainer = styled(Container)`
  justify-content: flex-start;
`;

export const RightAlignedCenteredContainer = styled(RightAlignedContainer)`
  align-items: center;
`;

export const LeftAlignedCenteredContainer = styled(LeftAlignedContainer)`
  align-items: center;
`;
