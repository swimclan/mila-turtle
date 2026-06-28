import * as React from "react";
import { memo } from "react";
import styled from "styled-components";

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

export const Canvas = memo(
  React.forwardRef(
    (_props: {}, ref: React.ForwardedRef<HTMLCanvasElement>) => {
      return <StyledCanvas ref={ref} />;
    }
  )
);
