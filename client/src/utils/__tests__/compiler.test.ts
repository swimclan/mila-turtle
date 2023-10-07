import { Compiler } from "../compiler";

describe("compiler tests", () => {
  const compiler = Compiler();
  it("Will compile a move instruction", () => {
    expect(compiler.compile(["MOVE 200"])).toEqual([{ move: 200 }]);
  });
  it("Will compile a turn instruction", () => {
    expect(compiler.compile(["RIGHT 90"])).toEqual([{ right: 90 }]);
  });
  it("Will compile and ignore a comment", () => {
    expect(compiler.compile(["# This is a comment"])).toEqual([]);
  });
  it("Will compile a set of basic instructions", () => {
    expect(
      compiler.compile(["MOVE 100", "RIGHT 90", "PEN DOWN", "COLOR GREEN"])
    ).toEqual([
      { move: 100 },
      { right: 90 },
      { pen: "down" },
      { color: "green" },
    ]);
  });
  it("Will compile instructions in two loops in series", () => {
    expect(
      compiler.compile([
        "MOVE 100",
        "DO 2",
        "RIGHT 90",
        "END",
        "DO 2",
        "MOVE 10",
        "END",
      ])
    ).toEqual([
      { move: 100 },
      { right: 90 },
      { right: 90 },
      { move: 10 },
      { move: 10 },
    ]);
  });
  it("Will compile nested loops", () => {
    expect(
      compiler.compile(["DO 2", "DO 2", "MOVE 10", "END", "RIGHT 90", "END"])
    ).toEqual([
      { move: 10 },
      { move: 10 },
      { right: 90 },
      { move: 10 },
      { move: 10 },
      { right: 90 },
    ]);
  });
});
