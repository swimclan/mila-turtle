import { useState, useEffect } from "react";
import { Compiler } from "../../utils/compiler";

const compiler = Compiler();

export const useCompiler = ({
  script,
  compileRequested,
}: {
  script: Array<string>;
  compileRequested: boolean;
}) => {
  const [instructions, setInstructions] = useState<TypeCompiled>([]);

  const clearCompilation = () => {
    setInstructions([]);
  };

  useEffect(() => {
    if (compileRequested) {
      const compiled = compiler.compile(script);
      setInstructions(compiled);
    }
  }, [compileRequested]);

  return { instructions, clearCompilation };
};
