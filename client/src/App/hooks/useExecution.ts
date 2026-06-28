import { useState, useEffect, useRef } from "react";
import { createDefaultTurtleState } from "../../utils/createDefaultTurtleState";

export const useExecution = ({
  canvasDimensions,
  instructions,
  onFinish,
  onDrawLine,
  onClearLines,
}: {
  canvasDimensions: TypeCanvasDimensions;
  instructions: TypeCompiled;
  onFinish: () => void;
  onDrawLine: (line: TypeLine) => void;
  onClearLines: () => void;
}) => {
  const [turtleState, setTurtleState] = useState<TypeTurtleState>(
    createDefaultTurtleState({ width: 0, height: 0 })
  );
  const [currentInstruction, setCurrentInstruction] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const drawnLines = useRef(new Set<string>());

  const clearExecution = () => {
    setIsRunning(false);
    setTurtleState(createDefaultTurtleState(canvasDimensions));
    setCurrentInstruction(-1);
    drawnLines.current.clear();
    onClearLines();
  };

  const stopRunning = () => setIsRunning(false);
  const resumeRunning = () => setIsRunning(true);

  useEffect(() => {
    setTurtleState(createDefaultTurtleState(canvasDimensions));
  }, [canvasDimensions]);

  useEffect(() => {
    if (instructions.length > 0) {
      setCurrentInstruction(0);
      setIsRunning(true);
    }
  }, [instructions]);

  useEffect(() => {
    if (currentInstruction > -1 && instructions.length > 0 && isRunning) {
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
          Number(
            (
              Math.sin(turtleState.theta * (Math.PI / 180)) *
              nextInstruction.move
            ).toFixed(1)
          );
        const nextY =
          turtleState.y -
          Number(
            (
              Math.cos(turtleState.theta * (Math.PI / 180)) *
              nextInstruction.move
            ).toFixed(1)
          );
        setTurtleState({ ...turtleState, x: nextX, y: nextY });
        if (turtleState.pen) {
          const key = `${currentX},${nextX},${currentY},${nextY},${turtleState.stroke}`;
          if (!drawnLines.current.has(key)) {
            drawnLines.current.add(key);
            onDrawLine({
              x1: currentX,
              x2: nextX,
              y1: currentY,
              y2: nextY,
              color: turtleState.color,
              stroke: turtleState.stroke,
            });
          }
        }
      } else if (nextInstruction.pen) {
        setTurtleState({
          ...turtleState,
          pen: nextInstruction.pen === "down",
        });
      } else if (nextInstruction.color) {
        setTurtleState({ ...turtleState, color: nextInstruction.color });
      } else if (nextInstruction.center) {
        setTurtleState({
          ...turtleState,
          x: Math.floor(canvasDimensions.width / 2),
          y: Math.floor(canvasDimensions.height / 2),
        });
      } else if (nextInstruction.dir) {
        const dir = { north: 0, south: 180, east: 90, west: 270 };
        setTurtleState({ ...turtleState, theta: dir[nextInstruction.dir] });
      } else if (nextInstruction.stroke) {
        setTurtleState({ ...turtleState, stroke: nextInstruction.stroke });
      }
      if (!instructions[currentInstruction + 1]) {
        onFinish();
        setIsRunning(false);
      }
      instructions[currentInstruction + 1] &&
        isRunning &&
        setTimeout(() => setCurrentInstruction(currentInstruction + 1), 0);
    }
  }, [currentInstruction, instructions, isRunning]);

  return {
    turtleState,
    currentInstruction,
    clearExecution,
    isRunning,
    stopRunning,
    resumeRunning,
  };
};
