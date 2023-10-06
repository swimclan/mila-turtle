import styled from "styled-components";
import { UI_COLORS } from "../theme";

export const Layout = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 8fr 4fr 1fr;
  font-family: "Courier New", Arial, sans-serif;
`;

export const LayoutContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  background-color: ${UI_COLORS.BACKGROUND.DARK};
  border-bottom: 1px solid ${UI_COLORS.FOREGROUND.DEFAULT};
  color: ${UI_COLORS.FOREGROUND.DEFAULT};
`;

export const RightAlignedLayoutContainer = styled(LayoutContainer)`
  justify-content: flex-end;
`;

export const LeftAlignedLayoutContainer = styled(LayoutContainer)`
  justify-content: flex-start;
`;

export const RightAlignedCenteredLayoutContainer = styled(
  RightAlignedLayoutContainer
)`
  align-items: center;
`;

export const LeftAlignedCenteredLayoutContainer = styled(
  LeftAlignedLayoutContainer
)`
  align-items: center;
`;
