import React, {
  useState,
  useEffect,
  useCallback,
  createRef,
  memo,
} from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import {
  Layout,
  RightAlignedCenteredContainer,
  LeftAlignedCenteredContainer,
  Container,
  SimpleList,
} from "../components/Layout";
import { TriangleUp } from "../components/Shape";
import { Button, SmallButton } from "../components/Button";
import { VectorLine } from "../components/Line";
import { Canvas } from "../components/Canvas";
import { useCanvas } from "./hooks/useCanvas";
import { useExecution } from "./hooks/useExecution";
import { useCompiler } from "./hooks/useCompiler";
import { useStorage } from "./hooks/useStorage";
import { SaveModal } from "../components/SaveModal";

const drawingBoardRef: React.RefObject<HTMLDivElement> = createRef();
const canvasRef: React.RefObject<SVGSVGElement> = createRef();

export const App = () => {
  /////// STATE ////////////////////////////////////////////////////
  const [script, setScript] = useState<TypeScript>([]);
  const [compileRequested, setCompileRequested] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
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
  const {
    clearExecution,
    turtleState,
    lines,
    isRunning,
    currentInstruction,
    stopRunning,
    resumeRunning,
  } = useExecution({
    canvasDimensions: CanvasDimensions,
    instructions,
    onFinish: () => setCompileRequested(false),
  });

  const { savedData, onSave } = useStorage();

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
      clearExecution();
      clearCompilation();
    },
    [setScript, monoco, CanvasDimensions]
  );

  const handlePauseResumeClick = useCallback(
    (e: React.SyntheticEvent) => {
      if (isRunning) {
        stopRunning();
      } else {
        resumeRunning();
      }
    },
    [isRunning]
  );

  const handleSaveClick = useCallback(() => {
    setShowSaveModal(true);
  }, []);

  const handleSaveModalCancelClick = useCallback(
    () => setShowSaveModal(false),
    [setShowSaveModal]
  );

  const handleSaveModalSubmitClicked = useCallback(
    (label: string) => {
      setShowSaveModal(false);
      onSave(label, script);
    },
    [setShowSaveModal, script]
  );

  const createHandleLoadSavedScript =
    (id: string) => (e: React.SyntheticEvent) => {
      monoco?.editor
        ?.getModels()?.[0]
        ?.setValue(savedData[id].script.join("\n"));
      setScript(savedData[id].script);
    };

  /////// THE VIEW /////////////////////////////////////////////////
  return (
    <>
      {showSaveModal && (
        <SaveModal
          open={showSaveModal}
          onSubmit={handleSaveModalSubmitClicked}
          onCancel={handleSaveModalCancelClick}
        />
      )}
      <Layout>
        <Container
          gridarea="header"
          orientation="horizontal"
          align="left"
          border={["bottom"]}
        >
          <Container height="auto" width="80%" align="left">
            Mila Turtle 1.0
          </Container>
          <Container height="auto" width="20%" align="right">
            <Button variant="primary" onClick={handleSaveClick}>
              SAVE
            </Button>
          </Container>
        </Container>
        <Container ref={drawingBoardRef} gridarea="canvas" border={["left"]}>
          <TriangleUp width={10} {...turtleState} />
          <Canvas ref={canvasRef}>
            {lines.map((line) => (
              <VectorLine
                x1={line.x1}
                x2={line.x2}
                y1={line.y1}
                y2={line.y2}
                color={line.color}
              />
            ))}
          </Canvas>
        </Container>
        <Container gridarea="editor" width="100%">
          <Editor theme="vs-dark" onChange={handleEditorChange} />
        </Container>
        <Container gridarea="browser" border={["top"]}>
          <div>File Browser</div>
          <Container>
            <SimpleList>
              {Object.entries(savedData).map(([id, data]) => {
                return (
                  <li key={id}>
                    {data.label}
                    <SmallButton onClick={createHandleLoadSavedScript(id)}>
                      [LOAD]
                    </SmallButton>
                    <SmallButton onClick={() => console.log("CLICK!")}>
                      [DEL]
                    </SmallButton>
                  </li>
                );
              })}
            </SimpleList>
          </Container>
        </Container>
        <Container
          gridarea="footer"
          orientation="horizontal"
          align="right"
          border={["top"]}
        >
          {instructions.length > 0 &&
            currentInstruction < instructions.length - 1 && (
              <Button variant="primary" onClick={handlePauseResumeClick}>
                {isRunning ? "PAUSE" : "RESUME"}
              </Button>
            )}
          <Button variant="primary" onClick={handleClearClick}>
            CLEAR
          </Button>
          <Button variant="primary" onClick={handleRunClick}>
            RUN
          </Button>
        </Container>
      </Layout>
    </>
  );
};
