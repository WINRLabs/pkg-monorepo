"use client";

import React from "react";

export enum KeyCode {
  SPACE = "Space",
}

interface UseKeyPress {
  key: KeyCode;
  callback: () => void;
}

export const useKeyPress = ({ key, callback }: UseKeyPress) => {
  const handleKeyPress = (e: any) => {
    e.preventDefault();
    console.log("hi e");

    if (e.code == key) {
      console.log("inner");
      callback();
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
};
