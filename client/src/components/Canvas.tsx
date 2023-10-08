import * as React from "react";
import { memo } from "react";
import styled from "styled-components";

const StyledSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

export const Canvas = memo(
  React.forwardRef(
    (
      { children }: React.PropsWithChildren,
      ref: React.ForwardedRef<SVGSVGElement>
    ) => {
      return <StyledSvg ref={ref}>{children}</StyledSvg>;
    }
  )
);
