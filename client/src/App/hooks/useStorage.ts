import { useState, useEffect } from "react";

const STORAGE_KEY = "MILA_TURTLE_1_0";

const convertLabelToId = (label: string) => {
  return `${label.toLowerCase().replace(/\s/g, "_")}_${Date.now()}`;
};

const getInitialSavedData = (): TypeStoredData => {
  let savedData = {};
  try {
    savedData =
      JSON.parse(window.localStorage.getItem(STORAGE_KEY) as string) ?? {};
  } catch (error) {
    console.error("Something went wrong while getting saved data");
  }
  return savedData;
};

export const useStorage = () => {
  const [savedData, setSavedData] = useState<TypeStoredData>(
    getInitialSavedData() ?? {}
  );

  const onSave = (label: string, script: TypeScript) => {
    // Define onSave based on the latest version of scripts
    let parsedData = {};
    try {
      const parsedData: TypeStoredData = savedData;
      const id = convertLabelToId(label as string);
      parsedData[id] = { label, script };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
      setSavedData(parsedData);
    } catch (error) {
      console.error("Saving script has failed");
    }
  };
  return { savedData, onSave };
};
