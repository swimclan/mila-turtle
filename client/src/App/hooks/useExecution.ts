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

  const clearExecution = () => {
    setTurtleState(createDefaultTurtleState(canvasDimensions));
    setCurrentInstruction(-1);
    setLines([]);
  };

  useEffect(() => {
    setTurtleState(createDefaultTurtleState(canvasDimensions));
  }, [canvasDimensions]);

  useEffect(() => {
    if (instructions.length > 0) {
      setCurrentInstruction(0);
    }
  }, [instructions]);

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
      !instructions[currentInstruction + 1] && onFinish();
      instructions[currentInstruction + 1] &&
        setTimeout(() => setCurrentInstruction(currentInstruction + 1), 2);
    }
  }, [currentInstruction, instructions]);

  return { lines, turtleState, currentInstruction, clearExecution };
};
