import { useState, useEffect } from "react";

const STORAGE_KEY = "MILA_TURTLE_1_0";

const convertLabelToId = (label: string) => {
  return `${label.toLowerCase().replace(/\s/g, "_")}_${Date.now()}`;
};

const findOverwriteId = (
  datum: TypeStoredData,
  label: string
): string | null => {
  let overwriteId: string | null = null;
  Object.entries(datum).forEach(([id, data]) => {
    if (data.label === label) {
      overwriteId = id;
    }
  });
  return overwriteId;
};

const getSavedData = (): TypeStoredData => {
  let savedData = {};
  try {
    savedData =
      JSON.parse(window.localStorage.getItem(STORAGE_KEY) as string) ?? {};
  } catch (error) {
    console.error("Something went wrong while getting saved data");
  }
  return savedData;
};

const storeSavedData = (data: TypeStoredData): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Something went wrong while saving data");
  }
};

export const useStorage = () => {
  const [savedData, setSavedData] = useState<TypeStoredData>(
    getSavedData() ?? {}
  );

  const onSave = (label: string, script: TypeScript) => {
    try {
      const dataToSave = { ...savedData };
      const id =
        findOverwriteId(dataToSave, label) ?? convertLabelToId(label as string);
      dataToSave[id] = { label, script };
      storeSavedData(dataToSave);
      setSavedData(dataToSave);
    } catch (error) {
      console.error("Saving script has failed");
    }
  };

  const onDelete = (id: string) => {
    try {
      const { [id]: data, ...rest } = savedData;
      storeSavedData(rest);
      setSavedData(rest);
    } catch (e) {
      console.error("Deleting file errored");
    }
  };
  return { savedData, onSave, onDelete };
};
