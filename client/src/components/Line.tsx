import { memo } from "react";
import { BASE_COLORS, TypeBaseColors } from "../theme";

export const VectorLines = memo(({ lines }: { lines: Array<TypeLine> }) => {
  return lines.map((line) => (
    <VectorLine
      key={`${line.x1}-${line.x2}-${line.y1}-${line.y2}`}
      x1={line.x1}
      x2={line.x2}
      y1={line.y1}
      y2={line.y2}
      color={line.color}
      stroke={line.stroke}
    />
  ));
});

export const VectorLine = memo(
  ({ x1, x2, y1, y2, color, stroke }: TypeLine) => {
    return (
      <line
        x1={x1}
        x2={x2}
        y1={y1}
        y2={y2}
        stroke={BASE_COLORS[color.toUpperCase() as TypeBaseColors]}
        strokeWidth={stroke}
      />
    );
  }
);
