import { memo } from "react";
import { BASE_COLORS, TypeBaseColors } from "../theme";

export const VectorLine = memo(({ x1, x2, y1, y2, color }: TypeLine) => {
  return (
    <line
      x1={x1}
      x2={x2}
      y1={y1}
      y2={y2}
      stroke={BASE_COLORS[color.toUpperCase() as TypeBaseColors]}
      strokeWidth="2"
    />
  );
});
