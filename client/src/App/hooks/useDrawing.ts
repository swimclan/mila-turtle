import { RefObject, useCallback } from "react";
import { BASE_COLORS, TypeBaseColors } from "../../theme";

export const useDrawing = (canvasRef: RefObject<HTMLCanvasElement>) => {
  const drawLine = useCallback(
    (line: TypeLine) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.strokeStyle = BASE_COLORS[line.color.toUpperCase() as TypeBaseColors];
      ctx.lineWidth = line.stroke;
      ctx.lineCap = "round";
      ctx.stroke();
    },
    [canvasRef]
  );

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  return { drawLine, clearCanvas };
};
