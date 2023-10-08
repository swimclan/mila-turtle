import { useState, useEffect } from "react";
import { createDefaultTurtleState } from "../../utils/createDefaultTurtleState";

export const useExecution = ({
  canvasDimensions,
  instructions,
  onFinish,
}: {
  canvasDimensions: TypeCanvasDimensions;
  instructions: TypeCompiled;
  onFinish: () => void;
}) => {
  const [lines, setLines] = useState<Array<TypeLine>>([]);
  const [turtleState, setTurtleState] = useState<TypeTurtleState>(
    createDefaultTurtleState({ width: 0, height: 0 })
  );
  const [currentInstruction, setCurrentInstruction] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const clearExecution = () => {
    setIsRunning(false);
    setTurtleState(createDefaultTurtleState(canvasDimensions));
    setCurrentInstruction(-1);
    setLines([]);
  };

  const stopRunning = () => {
    setIsRunning(false);
  };

  const resumeRunning = () => {
    setIsRunning(true);
  };

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
          Math.sin(turtleState.theta * (Math.PI / 180)) * nextInstruction.move;
        const nextY =
          turtleState.y -
          Math.cos(turtleState.theta * (Math.PI / 180)) * nextInstruction.move;
        setTurtleState({
          ...turtleState,
          x: nextX,
          y: nextY,
        });
        if (
          turtleState.pen &&
          !lines.find(
            (line) =>
              line.x1 === currentX &&
              line.x2 === nextX &&
              line.y1 === currentY &&
              line.y2 === nextY
          )
        ) {
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
        }
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
          x: Math.floor(canvasDimensions.width / 2),
          y: Math.floor(canvasDimensions.height / 2),
        });
      } else if (nextInstruction.dir) {
        const dir = { north: 0, south: 180, east: 90, west: 270 };
        setTurtleState({
          ...turtleState,
          theta: dir[nextInstruction.dir],
        });
      }
      if (!instructions[currentInstruction + 1]) {
        onFinish();
        setIsRunning(false);
      }
      instructions[currentInstruction + 1] &&
        isRunning &&
        setTimeout(() => setCurrentInstruction(currentInstruction + 1), 1);
    }
  }, [currentInstruction, instructions, isRunning]);

  return {
    lines,
    turtleState,
    currentInstruction,
    clearExecution,
    isRunning,
    stopRunning,
    resumeRunning,
  };
};
