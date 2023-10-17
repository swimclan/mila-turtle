import * as React from "react";
import { render, screen } from "@testing-library/react";
import { useCompiler } from "../useCompiler";

describe("useCompiler hook", () => {
  const Wrapper = ({
    compile = false,
    clear = false,
  }: {
    compile: boolean;
    clear: boolean;
  }) => {
    const script: TypeScript = ["MOVE 30", "DO 2", "RIGHT 3", "END"];
    React.useEffect(() => {
      if (clear) {
        clearCompilation();
      }
    }, [clear]);
    const { instructions, clearCompilation } = useCompiler({
      script,
      compileRequested: compile,
    });
    return instructions.map((instruction) => (
      <div>
        {`${Object.keys(instruction)[0]}:${Object.values(instruction)[0]}`}
      </div>
    ));
  };

  it("Will create the instructions when compileRequested is set to true", () => {
    render(<Wrapper compile={true} clear={false} />);
    expect(screen.queryByText("move:30")).not.toBeNull();
    expect(screen.queryAllByText("right:3")).toHaveLength(2);
  });
  it("Will clear the compilation", async () => {
    const props = { compile: true, clear: false };
    const { rerender } = render(<Wrapper {...props} />);
    const newProps = { compile: true, clear: true };
    rerender(<Wrapper {...newProps} />);
    expect(screen.queryByText("move:30")).toBeNull();
    expect(screen.queryAllByText("right:3")).toHaveLength(0);
  });
});
