import styled from "styled-components";
import { Container } from "./Layout";
import React, { EventHandler } from "react";

const Overlay = styled.div.attrs({ id: "modal-overlay" })`
  display: flex;
  position: absolute;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.7);
`;

export const Modal = ({
  children,
  onBlur,
  height,
  width,
}: React.PropsWithChildren & {
  height?: string;
  width?: string;
  onBlur?: (e: React.SyntheticEvent) => void;
}) => {
  const handleOverlayClick = (e: React.SyntheticEvent) => {
    // @ts-expect-error
    if (e?.target.id == "modal-overlay") {
      onBlur?.(e);
    }
  };

  return (
    <Overlay onClick={handleOverlayClick as EventHandler<React.SyntheticEvent>}>
      <Container
        height={height ?? "50%"}
        width={width ?? "50%"}
        border={["top", "bottom", "left", "right"]}
      >
        {children}
      </Container>
    </Overlay>
  );
};
