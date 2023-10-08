type TypeInstruction = {
  move?: number;
  pen?: "down" | "up";
  right?: number;
  left?: number;
  do?: number;
  end?: void | boolean;
  color?: string;
  center?: void | boolean;
  dir?: "north" | "south" | "east" | "west";
  comment?: string;
  stroke?: number;
};

type TypeCompiled = Array<TypeInstruction>;

type TypeTurtleState = {
  x: number;
  y: number;
  theta: number;
  pen: boolean;
  color: string;
  stroke: number;
};

type TypeCanvasDimensions = {
  height: number;
  width: number;
};

type TypeLine = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  color: string;
  stroke: number;
};

type TypeScript = Array<string>;

type TypeStoredData = { [id: string]: { script: TypeScript; label?: string } };
