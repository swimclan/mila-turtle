const POSITION_INSTRUCTION_PATTERN = /^(MOVE|RIGHT|LEFT)\s(\d+)$/i;
const DYNAMIC_POSITION_PATTERN = /^(MOVE|RIGHT|LEFT)\s([a-zA-Z].*)$/i;
const PEN_INSTRUCTION_PATTERN = /^(PEN)\s(UP|DOWN)$/i;
const LOOP_INSTRUCTION_PATTERN = /^(DO)\s(\d+)$/i;
const END_PATTERN = /^(END)$/i;
const COLOR_PATTERN =
  /^(COLOR)\s(GREEN|BLUE|RED|WHITE|PURPLE|PINK|ORANGE|YELLOW)$/i;
const CENTER_PATTERN = /^(CENTER)$/i;
const DIRECTION_PATTERN = /^(DIR)\s(NORTH|SOUTH|EAST|WEST)$/i;
const COMMENT_PATTERN = /^(#)(.+)$/;
const STROKE_PATTERN = /^(STROKE)\s(\d+)$/i;
const ASSIGNMENT_PATTERN = /^([a-zA-Z].*)\s?=\s?(\d+)$/i;
const INCREMENT_PATTERN = /^([a-zA-Z].*)\+\+$/i;
const DECREMENT_PATTERN = /^([a-zA-Z].*)\-\-$/i;

const MEM_CACHE: { [v: string]: number } = {};

export function Compiler() {
  return {
    compile(script: Array<string>): TypeCompiled {
      let ret: TypeCompiled = [];
      let cursor = 0;
      while (cursor < script.length) {
        const line = script[cursor];
        const currentLine = LineCompiler(line);
        if (!currentLine || currentLine.comment) {
          cursor++;
          continue;
        }
        if (currentLine.do) {
          const iterCount = currentLine.do;
          const exploded = ExplodeLoop(script.slice(cursor));
          cursor = cursor += exploded.length / iterCount + 2; // Add 2 to account for DO and END
          ret = [...ret, ...this.compile(exploded)];
          continue;
        }
        ret = [...ret, currentLine];
        cursor++;
      }
      return ret;
    },
  };
}

const LineCompiler = (line: string): TypeInstruction | void => {
  const positionMatcher = line.match(POSITION_INSTRUCTION_PATTERN);
  const penMatcher = line.match(PEN_INSTRUCTION_PATTERN);
  const loopMatcher = line.match(LOOP_INSTRUCTION_PATTERN);
  const endMatcher = line.match(END_PATTERN);
  const colorMatcher = line.match(COLOR_PATTERN);
  const centerMatcher = line.match(CENTER_PATTERN);
  const directionMatcher = line.match(DIRECTION_PATTERN);
  const strokeMatcher = line.match(STROKE_PATTERN);
  const commentMatcher = line.match(COMMENT_PATTERN);
  const assignmentMatcher = line.match(ASSIGNMENT_PATTERN);
  const incrementMatcher = line.match(INCREMENT_PATTERN);
  const decrementMatcher = line.match(DECREMENT_PATTERN);
  const dynamicPositionMatcher = line.match(DYNAMIC_POSITION_PATTERN);
  const matcher =
    positionMatcher ||
    penMatcher ||
    loopMatcher ||
    endMatcher ||
    colorMatcher ||
    centerMatcher ||
    directionMatcher ||
    strokeMatcher;
  if (commentMatcher) {
    return {
      comment: commentMatcher[2],
    };
  }
  if (assignmentMatcher) {
    MEM_CACHE[assignmentMatcher[1]] = Number(assignmentMatcher[2]);
    return;
  }
  if (incrementMatcher) {
    MEM_CACHE[incrementMatcher[1]] = (MEM_CACHE[incrementMatcher[1]] ?? 0) + 1;
    return;
  }
  if (decrementMatcher) {
    MEM_CACHE[decrementMatcher[1]] = (MEM_CACHE[decrementMatcher[1]] ?? 0) - 1;
    return;
  }
  if (dynamicPositionMatcher) {
    return {
      [dynamicPositionMatcher[1]]: MEM_CACHE[dynamicPositionMatcher[2] ?? 0],
    };
  }
  if (matcher) {
    return {
      [matcher[1].toLowerCase() as keyof TypeInstruction]: !isNaN(
        Number(matcher[2])
      )
        ? Number(matcher[2])
        : matcher[2]?.toLowerCase() ?? true,
    };
  }
  throw new TypeError(`Compiler error! Syntax error at ${line}`);
};

// ---------------------------------------------------------------------------
// Validation (real-time Monaco markers)
// ---------------------------------------------------------------------------

type ValidationError = {
  lineNumber: number;  // 1-based
  startColumn: number; // 1-based, inclusive
  endColumn: number;   // 1-based, exclusive
  message: string;
};

export function validateScript(script: Array<string>): Array<ValidationError> {
  // Pass 1: collect every variable name that is assigned anywhere in the script
  const declaredVars = new Set<string>();
  script.forEach((raw) => {
    const m = raw.trim().match(ASSIGNMENT_PATTERN);
    if (m) declaredVars.add(m[1].trim().toLowerCase());
  });

  const errors: ValidationError[] = [];

  // Pass 2: validate each line
  script.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();
    if (!line) return;

    if (COMMENT_PATTERN.test(line)) return;
    if (ASSIGNMENT_PATTERN.test(line)) return;
    if (INCREMENT_PATTERN.test(line)) return;
    if (DECREMENT_PATTERN.test(line)) return;
    if (END_PATTERN.test(line)) return;
    if (CENTER_PATTERN.test(line)) return;
    if (POSITION_INSTRUCTION_PATTERN.test(line)) return;
    if (PEN_INSTRUCTION_PATTERN.test(line)) return;
    if (LOOP_INSTRUCTION_PATTERN.test(line)) return;
    if (COLOR_PATTERN.test(line)) return;
    if (DIRECTION_PATTERN.test(line)) return;
    if (STROKE_PATTERN.test(line)) return;
    if (STROKE_PATTERN.test(line)) return;

    // Dynamic position (variable reference) — valid only if var was declared
    const dynMatch = line.match(DYNAMIC_POSITION_PATTERN);
    if (dynMatch) {
      const varName = dynMatch[2].trim().toLowerCase();
      if (!declaredVars.has(varName)) {
        const leadingSpaces = rawLine.length - rawLine.trimStart().length;
        const argStart = leadingSpaces + dynMatch[1].length + 2; // after "CMD "
        errors.push({
          lineNumber,
          startColumn: argStart,
          endColumn: rawLine.length + 1,
          message: `"${dynMatch[2]}" has not been declared — assign it first, e.g. ${dynMatch[2]} = 10`,
        });
      }
      return;
    }

    errors.push(buildError(line, lineNumber, rawLine));
  });

  return errors;
}

function buildError(line: string, lineNumber: number, rawLine: string): ValidationError {
  const leadingSpaces = rawLine.length - rawLine.trimStart().length;
  const cmdWord = (line.match(/^([^\s]+)/)?.[1] ?? "").toUpperCase();
  const cmdStart = leadingSpaces + 1;
  const cmdEnd = cmdStart + cmdWord.length;   // exclusive
  const argStart = cmdEnd + 1;                // after the space
  const lineEnd = rawLine.length + 1;         // exclusive
  const hasArg = argStart <= rawLine.length;
  const argText = line.slice(cmdWord.length).trim();

  switch (cmdWord) {
    case "MOVE":
    case "RIGHT":
    case "LEFT":
      return hasArg
        ? { lineNumber, startColumn: argStart, endColumn: lineEnd,
            message: `"${argText}" is not valid — ${cmdWord} expects a number (e.g. ${cmdWord} 100)` }
        : { lineNumber, startColumn: cmdStart, endColumn: cmdEnd,
            message: `${cmdWord} requires a number argument` };

    case "PEN":
      return hasArg
        ? { lineNumber, startColumn: argStart, endColumn: lineEnd,
            message: `"${argText}" is not valid — PEN expects UP or DOWN` }
        : { lineNumber, startColumn: cmdStart, endColumn: cmdEnd,
            message: `PEN requires UP or DOWN` };

    case "DO":
      return hasArg
        ? { lineNumber, startColumn: argStart, endColumn: lineEnd,
            message: `"${argText}" is not valid — DO expects a number (e.g. DO 10)` }
        : { lineNumber, startColumn: cmdStart, endColumn: cmdEnd,
            message: `DO requires a number argument` };

    case "COLOR":
      return hasArg
        ? { lineNumber, startColumn: argStart, endColumn: lineEnd,
            message: `"${argText}" is not a valid color — expected RED, GREEN, BLUE, WHITE, PURPLE, PINK, ORANGE, or YELLOW` }
        : { lineNumber, startColumn: cmdStart, endColumn: cmdEnd,
            message: `COLOR requires a color name` };

    case "DIR":
      return hasArg
        ? { lineNumber, startColumn: argStart, endColumn: lineEnd,
            message: `"${argText}" is not a valid direction — expected NORTH, SOUTH, EAST, or WEST` }
        : { lineNumber, startColumn: cmdStart, endColumn: cmdEnd,
            message: `DIR requires a direction` };

    case "STROKE":
      return hasArg
        ? { lineNumber, startColumn: argStart, endColumn: lineEnd,
            message: `"${argText}" is not valid — STROKE expects a number (e.g. STROKE 5)` }
        : { lineNumber, startColumn: cmdStart, endColumn: cmdEnd,
            message: `STROKE requires a number argument` };

    case "END":
    case "CENTER":
      return { lineNumber, startColumn: argStart, endColumn: lineEnd,
               message: `${cmdWord} does not take any arguments` };

    default:
      return { lineNumber, startColumn: cmdStart, endColumn: cmdEnd || lineEnd,
               message: `Unknown instruction "${cmdWord || line}"` };
  }
}

const ExplodeLoop = (script: Array<string>): Array<string> => {
  const ret = [];
  const loopIterationCount = Number(
    script[0].match(LOOP_INSTRUCTION_PATTERN)?.[2] ?? 0
  );
  let dosFound = 1;
  let lastEndPos: number | null = null;
  let cursor = 1;
  while (cursor < script.length) {
    if (script[cursor].match(LOOP_INSTRUCTION_PATTERN)) {
      // We found another DO !!!
      dosFound++;
    }
    if (script[cursor].match(END_PATTERN)) {
      if (dosFound > 1) {
        dosFound--;
        cursor++;
        continue;
      } else {
        lastEndPos = cursor;
        break;
      }
    }
    cursor++;
  }
  if (!lastEndPos) {
    return [];
  }
  for (let i = 0; i < loopIterationCount; i++) {
    for (let j = 1; j < lastEndPos; j++) {
      ret.push(script[j]);
    }
  }
  return ret;
};
