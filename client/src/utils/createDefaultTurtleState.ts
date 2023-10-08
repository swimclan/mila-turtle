export const createDefaultTurtleState = (
  CanvasDimensions: TypeCanvasDimensions
): TypeTurtleState => ({
  x: Math.floor(CanvasDimensions.width / 2),
  y: Math.floor(CanvasDimensions.height / 2),
  theta: 0,
  pen: false,
  color: "GREEN",
  stroke: 2,
});
