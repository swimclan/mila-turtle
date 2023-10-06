import { useState, useEffect } from "react";

export const useCanvas = (
  canvasRef: React.RefObject<SVGSVGElement>
): { dimensions: TypeCanvasDimensions } => {
  const [dimensions, setDimensions] = useState<{
    height: number;
    width: number;
  }>({ height: 0, width: 0 });
  useEffect(() => {
    const boundingRect = canvasRef?.current?.getBoundingClientRect();
    setDimensions({
      height: boundingRect?.height ?? 0,
      width: boundingRect?.width ?? 0,
    });
  }, [canvasRef]);
  return { dimensions };
};
