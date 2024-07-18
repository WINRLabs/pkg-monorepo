import { UseFormReturn } from "react-hook-form";

export type CrashFormFields = {
  wager: number;
  multiplier: number;
};

export type CrashForm = UseFormReturn<CrashFormFields, any, undefined>;

export type Participant = {
  avatar: string;
  name: string;
  multiplier: number;
  bet: number;
};
