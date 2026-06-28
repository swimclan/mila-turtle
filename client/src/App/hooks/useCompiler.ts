import { useState, useEffect } from "react";
import { Compiler } from "../../utils/compiler";

const compiler = Compiler();

export const useCompiler = ({
  script,
  compileRequested,
}: {
  script: TypeScript;
  compileRequested: boolean;
}) => {
  const [instructions, setInstructions] = useState<TypeCompiled>([]);
  const [compilationError, setCompilationError] = useState<string | null>(null);

  const clearCompilation = () => {
    setInstructions([]);
    setCompilationError(null);
  };

  useEffect(() => {
    if (compileRequested) {
      try {
        const compiled = compiler.compile(script);
        setCompilationError(null);
        setInstructions(compiled);
      } catch (e) {
        setCompilationError(e instanceof Error ? e.message : String(e));
        setInstructions([]);
      }
    }
  }, [compileRequested]);

  return { instructions, clearCompilation, compilationError };
};
