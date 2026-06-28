import React, { useState, useCallback, createRef, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { configureMonaco, LANGUAGE_ID, THEME_ID } from "../utils/monacoConfig";
import { Layout, Container, SimpleList } from "../components/Layout";
import { TriangleUp } from "../components/Shape";
import { Button, SmallButton } from "../components/Button";
import { Canvas } from "../components/Canvas";
import { useCanvas } from "./hooks/useCanvas";
import { useDrawing } from "./hooks/useDrawing";
import { useExecution } from "./hooks/useExecution";
import { useCompiler } from "./hooks/useCompiler";
import { useStorage } from "./hooks/useStorage";
import { SaveModal } from "../components/SaveModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";

const drawingBoardRef: React.RefObject<HTMLDivElement> = createRef();
const canvasRef: React.RefObject<HTMLCanvasElement> = createRef();

const DEFAULT_SCRIPT = [
  "PEN DOWN",
  "STROKE 5",
  "DO 32",
  "DO 15",
  "COLOR RED",
  "MOVE 10",
  "RIGHT 3",
  "COLOR ORANGE",
  "MOVE 10",
  "RIGHT 3",
  "COLOR GREEN",
  "MOVE 10",
  "RIGHT 3",
  "COLOR BLUE",
  "MOVE 10",
  "RIGHT 3",
  "COLOR PURPLE",
  "MOVE 10",
  "RIGHT 3",
  "END",
  "RIGHT 42",
  "END",
];

export const App = () => {
  /////// STATE ////////////////////////////////////////////////////
  const [script, setScript] = useState<TypeScript>([]);
  const [compileRequested, setCompileRequested] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] =
    useState<boolean>(false);

  /////// HOOKS / ASYNC ///////////////////////////////////////////
  /*  Monoco editor state */
  const monoco = useMonaco();

  /* Get the dimensions of the canvas */
  const { dimensions: CanvasDimensions } = useCanvas(canvasRef);

  /* Imperative canvas drawing — no React state per line */
  const { drawLine, clearCanvas } = useDrawing(canvasRef);

  /* Compile the script */
  const { instructions, clearCompilation, compilationError } = useCompiler({
    script,
    compileRequested,
  });

  /* Execute the runtime */
  const {
    clearExecution,
    turtleState,
    isRunning,
    currentInstruction,
    stopRunning,
    resumeRunning,
  } = useExecution({
    canvasDimensions: CanvasDimensions,
    instructions,
    onFinish: () => setCompileRequested(false),
    onDrawLine: drawLine,
    onClearLines: clearCanvas,
  });

  const { savedData, onSave, onDelete } = useStorage();

  useEffect(() => {
    if (monoco && Object.keys(savedData).length === 0) {
      monoco.editor.getModels()[0]?.setValue(DEFAULT_SCRIPT.join("\n"));
      setScript(DEFAULT_SCRIPT);
      setCompileRequested(true);
    }
  }, [monoco]);

  useEffect(() => {
    if (pendingDeleteId) {
      setShowDeleteConfirmModal(true);
    }
  }, [pendingDeleteId]);

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
      clearExecution();
      clearCompilation();
      setCompileRequested(false);
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

  const handleDeleteConfirmModalCancelClick = useCallback(
    () => setShowDeleteConfirmModal(false),
    [setShowDeleteConfirmModal]
  );

  const createHandleConfirmDeleteSavedScript = (id: string) => () =>
    setPendingDeleteId(id);

  const handleDeleteSavedScript = (id: string | null) => {
    if (!id) return;
    onDelete(id);
    setPendingDeleteId(null);
    setShowDeleteConfirmModal(false);
  };

  const createHandleLoadSavedScript =
    (id: string) => (e: React.SyntheticEvent) => {
      monoco?.editor
        ?.getModels()?.[0]
        ?.setValue(savedData[id].script.join("\n"));
      setScript(savedData[id].script);
      handleRunClick(e);
    };

  /////// THE VIEW /////////////////////////////////////////////////
  return (
    <>
      <SaveModal
        open={showSaveModal}
        onSubmit={handleSaveModalSubmitClicked}
        onCancel={handleSaveModalCancelClick}
      />
      <DeleteConfirmModal
        scriptId={pendingDeleteId}
        open={showDeleteConfirmModal}
        onSubmit={handleDeleteSavedScript}
        onCancel={handleDeleteConfirmModalCancelClick}
      />
      <Layout>
        <Container
          gridarea="header"
          orientation="horizontal"
          align="left"
          border={["bottom"]}
        >
          <Container height="auto" width="80%" align="left">
            Mila Turtle 1.0 &nbsp;|&nbsp;
            <a
              href="https://github.com/swimclan/mila-turtle#readme"
              target="_blank"
              rel="noreferrer"
              style={{ color: "inherit" }}
            >
              Language Guide
            </a>
          </Container>
          <Container height="auto" width="20%" align="right">
            <Button variant="primary" onClick={handleSaveClick}>
              SAVE
            </Button>
          </Container>
        </Container>
        <Container ref={drawingBoardRef} gridarea="canvas" border={["left"]}>
          <TriangleUp width={10} {...turtleState} />
          <Canvas ref={canvasRef} />
        </Container>
        <Container gridarea="editor" width="100%">
          <div>Code Editor</div>
          {compilationError && (
            <div style={{ color: "#f44", padding: "4px 8px", fontSize: "12px", fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
              {compilationError}
            </div>
          )}
          <Editor
            language={LANGUAGE_ID}
            theme={THEME_ID}
            beforeMount={configureMonaco}
            onChange={handleEditorChange}
          />
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
                    <SmallButton
                      onClick={createHandleConfirmDeleteSavedScript(id)}
                    >
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
            currentInstruction < instructions.length - 1 &&
            currentInstruction !== -1 && (
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
