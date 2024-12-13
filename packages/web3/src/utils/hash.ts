"use client";
import { hashMessage } from "viem";

export const generateCommitmentHash = () => {
  const uint8Array = new Uint8Array(32);
  const randomValues = crypto.getRandomValues(uint8Array);

  const hashedMessage = hashMessage({
    raw: randomValues,
  });

  console.log('hashedMessage', hashedMessage);

  return hashedMessage;
};
