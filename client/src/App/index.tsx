import { useState, useCallback, createRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import {
  Layout,
  LayoutContainer,
  RightAlignedCenteredLayoutContainer,
  LeftAlignedCenteredLayoutContainer,
} from "../components/Layout";
import { TriangleUp } from "../components/Shape";
import { Button } from "../components/Button";
import { Canvas } from "../components/Canvas";
import { useCanvas } from "./hooks/useCanvas";
import { BASE_COLORS, TypeBaseColors } from "../theme";
import { useExecution } from "./hooks/useExecution";
import { useCompiler } from "./hooks/useCompiler";

const drawingBoardRef: React.RefObject<HTMLDivElement> = createRef();
const canvasRef: React.RefObject<SVGSVGElement> = createRef();
// const compiler = Compiler();

export const App = () => {
  /////// STATE ////////////////////////////////////////////////////
  const [script, setScript] = useState<Array<string>>([]);
  const [compileRequested, setCompileRequested] = useState<boolean>(false);
  // const [instructions, setInstructions] = useState<TypeCompiled>([]);

  /////// HOOKS / ASYNC ///////////////////////////////////////////
  /*  Monoco editor state */
  const monoco = useMonaco();

  /* Get the dimensions of the canvas */
  const { dimensions: CanvasDimensions } = useCanvas(canvasRef);

  /* Compile the script */
  const { instructions, clearCompilation } = useCompiler({
    script,
    compileRequested,
  });

  /* Execute the runtime */
  const { clearExecution, turtleState, lines } = useExecution({
    canvasDimensions: CanvasDimensions,
    instructions,
    onFinish: () => setCompileRequested(false),
  });

  /////// HANDLERS ////////////////////////////////////////////////
  const handleEditorChange = useCallback(
    (raw: string | undefined) => {
      setScript((raw?.split("\n") ?? []).filter((s) => Boolean(s)));
    },
    [setScript]
  );

  const handleRunClick = useCallback(
    (e: React.SyntheticEvent) => {
      setCompileRequested(true);
    },
    [setCompileRequested]
  );

  const handleClearClick = useCallback(
    (e: React.SyntheticEvent) => {
      setScript([]);
      monoco?.editor?.getModels()?.[0]?.setValue("");
      // setInstructions([...instructions]);
      clearExecution();
    },
    [setScript, monoco, CanvasDimensions]
  );

  /////// THE VIEW /////////////////////////////////////////////////
  return (
    <Layout>
      <LeftAlignedCenteredLayoutContainer>
        Mila Turtle 1.0
      </LeftAlignedCenteredLayoutContainer>
      <LayoutContainer ref={drawingBoardRef}>
        <TriangleUp width={10} {...turtleState} />
        <Canvas ref={canvasRef}>
          {lines.map((line) => (
            <line
              x1={line.x1}
              x2={line.x2}
              y1={line.y1}
              y2={line.y2}
              stroke={BASE_COLORS[line.color.toUpperCase() as TypeBaseColors]}
              strokeWidth="2"
            />
          ))}
        </Canvas>
      </LayoutContainer>
      <LayoutContainer>
        <Editor theme="vs-dark" options={{}} onChange={handleEditorChange} />
      </LayoutContainer>
      <RightAlignedCenteredLayoutContainer>
        <Button variant="secondary" onClick={handleClearClick}>
          CLEAR
        </Button>
        <Button variant="secondary" onClick={handleRunClick}>
          RUN
        </Button>
      </RightAlignedCenteredLayoutContainer>
    </Layout>
  );
};
