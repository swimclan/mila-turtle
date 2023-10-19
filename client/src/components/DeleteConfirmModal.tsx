import { useState } from "react";
import { Modal } from "./Modal";
import { Container } from "./Layout";
import { Button } from "./Button";
import { Input } from "./Input";

type TypeSaveModalProps = {
  open: boolean;
  scriptId: string | null;
  onSubmit: (id: string | null) => void;
  onCancel: () => void;
};

export const DeleteConfirmModal = ({
  open,
  onSubmit,
  onCancel,
  scriptId,
}: TypeSaveModalProps) => {
  const handleSubmitClick = () => onSubmit(scriptId);
  return open ? (
    <Modal onBlur={onCancel} height="33%" width="25%">
      <Container padding="1em">
        <Container height="100%" padding="1em" width="88%">
          <Container height="33%">Are you sure you wanna delete?</Container>
        </Container>
        <Container height="20%" orientation="horizontal" align="right">
          <Button onClick={onCancel} variant="primary">
            CANCEL
          </Button>
          <Button onClick={handleSubmitClick} variant="primary">
            DELETE
          </Button>
        </Container>
      </Container>
    </Modal>
  ) : null;
};
