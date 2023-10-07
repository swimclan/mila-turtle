import styled from "styled-components";
import { UI_COLORS } from "../theme";
import { Container } from "./Layout";

export type TypeInputProps = {
  label: string;
  name: string;
  onChange: (value: string) => void;
  width?: string;
};

const StyledInput = styled.input.attrs({ type: "text" })<{ width?: string }>`
  width: ${(props) => props.width ?? "80%"};
  border: 1px solid ${UI_COLORS.FOREGROUND.DEFAULT};
  height: 2em;
  background: none;
  color: ${UI_COLORS.FOREGROUND.DEFAULT};
  &[type="text"] {
    font-family: "Courier New", Courier, monospace;
  }
`;

export const Input = ({ label, name, onChange, width }: TypeInputProps) => {
  const handleOnInput: React.FormEventHandler<HTMLInputElement> = (e) =>
    onChange(e.currentTarget.value);
  return (
    <Container orientation="horizontal" align="left">
      <label>{label}</label>
      <StyledInput
        id={name}
        name={name}
        onInput={handleOnInput}
        width={width}
      />
    </Container>
  );
};
