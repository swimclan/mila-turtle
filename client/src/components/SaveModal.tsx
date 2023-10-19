import { useState } from "react";
import { Modal } from "./Modal";
import { Container } from "./Layout";
import { Button } from "./Button";
import { Input } from "./Input";

type TypeSaveModalProps = {
  open: boolean;
  onSubmit?: (label: string) => void;
  onCancel?: () => void;
};

export const SaveModal = ({ open, onSubmit, onCancel }: TypeSaveModalProps) => {
  const [label, setLabel] = useState<string>("");
  const handleSaveClick = (e: React.SyntheticEvent) => onSubmit?.(label);

  return open ? (
    <Modal onBlur={onCancel} height="33%" width="25%">
      <Container padding="1em">
        <Container height="80%" padding="1em" width="88%">
          <Container height="33%">Please name your script</Container>
          <Container height="66%" orientation="vertical" align="center">
            <Input
              label="Script name"
              name="script-name"
              onChange={setLabel}
              width="66%"
            />
          </Container>
        </Container>
        <Container height="20%" orientation="horizontal" align="right">
          <Button onClick={onCancel} variant="primary">
            CANCEL
          </Button>
          <Button onClick={handleSaveClick} variant="primary">
            SAVE
          </Button>
        </Container>
      </Container>
    </Modal>
  ) : null;
};
