import { useState, useEffect } from "react";

export const useCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>
): { dimensions: TypeCanvasDimensions } => {
  const [dimensions, setDimensions] = useState<TypeCanvasDimensions>({
    height: 0,
    width: 0,
  });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas.getBoundingClientRect();
    // Sync the canvas drawing resolution to its display size so coordinates match pixels
    canvas.width = width;
    canvas.height = height;
    setDimensions({ height, width });
  }, [canvasRef]);
  return { dimensions };
};
