import { useState, useCallback, createRef, useEffect } from "react";
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
import { Compiler } from "../utils/compiler";
import { BASE_COLORS, TypeBaseColors, UI_COLORS } from "../theme";

const drawingBoardRef: React.RefObject<HTMLDivElement> = createRef();
const canvasRef: React.RefObject<SVGSVGElement> = createRef();
const compiler = Compiler();

// HELPERS
const createDefaultTurtleState = (
  CanvasDimensions: TypeCanvasDimensions
): TypeTurtleState => ({
  x: Math.floor(CanvasDimensions.width / 2),
  y: Math.floor(CanvasDimensions.height / 2),
  theta: 0,
  pen: false,
  color: "GREEN",
});

export const App = () => {
  // STATE
  const [script, setScript] = useState<Array<string>>([]);
  const [instructions, setInstructions] = useState<TypeCompiled>([]);
  const [lines, setLines] = useState<Array<TypeLine>>([]);
  const [turtleState, setTurtleState] = useState<TypeTurtleState>(
    createDefaultTurtleState({ width: 0, height: 0 })
  );
  const [currentInstruction, setCurrentInstruction] = useState<number>(-1);
  // HOOKS / ASYNC
  /*  Monoco editor state */
  const monoco = useMonaco();

  /* Get the dimensions of the canvas */
  const { dimensions: CanvasDimensions } = useCanvas(canvasRef);

  /* Initialize the turtle position and direction */
  useEffect(() => {
    setTurtleState(createDefaultTurtleState(CanvasDimensions));
  }, [CanvasDimensions]);

  /* Listen for instructions assignment reset currentInstruction to 0 */
  useEffect(() => {
    if (instructions.length > 0) {
      setCurrentInstruction(0);
    }
  }, [instructions]);

  /* Execute current instruction and increment */
  useEffect(() => {
    if (currentInstruction > -1) {
      const nextInstruction: TypeInstruction = instructions[currentInstruction];
      if (nextInstruction.right) {
        setTurtleState({
          ...turtleState,
          theta: turtleState.theta + nextInstruction.right,
        });
      } else if (nextInstruction.left) {
        setTurtleState({
          ...turtleState,
          theta: turtleState.theta - nextInstruction.left,
        });
      } else if (nextInstruction.move) {
        const currentX = turtleState.x;
        const currentY = turtleState.y;
        const nextX =
          turtleState.x +
          Math.sin(turtleState.theta * (Math.PI / 180)) * nextInstruction.move;
        const nextY =
          turtleState.y -
          Math.cos(turtleState.theta * (Math.PI / 180)) * nextInstruction.move;
        setTurtleState({
          ...turtleState,
          x: nextX,
          y: nextY,
        });
        turtleState.pen &&
          setLines([
            ...lines,
            {
              x1: currentX,
              x2: nextX,
              y1: currentY,
              y2: nextY,
              color: turtleState.color,
            },
          ]);
      } else if (nextInstruction.pen) {
        setTurtleState({
          ...turtleState,
          pen: nextInstruction.pen === "down",
        });
      } else if (nextInstruction.color) {
        setTurtleState({
          ...turtleState,
          color: nextInstruction.color,
        });
      } else if (nextInstruction.center) {
        setTurtleState({
          ...turtleState,
          x: Math.floor(CanvasDimensions.width / 2),
          y: Math.floor(CanvasDimensions.height / 2),
        });
      } else if (nextInstruction.dir) {
        const dir = { north: 0, south: 180, east: 90, west: 270 };
        setTurtleState({
          ...turtleState,
          theta: dir[nextInstruction.dir],
        });
      }
      instructions[currentInstruction + 1] &&
        setTimeout(() => setCurrentInstruction(currentInstruction + 1), 2);
    }
  }, [currentInstruction, instructions]);

  // HANDLERS
  const handleEditorChange = useCallback(
    (raw: string | undefined) => {
      setScript(raw?.split("\n") ?? []);
    },
    [setScript]
  );

  const handleRunClick = useCallback(
    (e: React.SyntheticEvent) => {
      const compiled = compiler.compile(script);
      setInstructions(compiled);
    },
    [compiler, script]
  );

  const handleClearClick = useCallback(
    (e: React.SyntheticEvent) => {
      setScript([]);
      monoco?.editor?.getModels()?.[0]?.setValue("");
      setTurtleState(createDefaultTurtleState(CanvasDimensions));
      setCurrentInstruction(-1);
      setInstructions([...instructions]);
      setLines([]);
    },
    [setScript, monoco, CanvasDimensions]
  );

  // VIEW
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
