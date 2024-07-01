import sharedConfig from "@winrlabs/tailwind-config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "prefix" | "presets" | "content" | "corePlugins"> = {
  content: ["./src/**/*.tsx"],
  prefix: "wr-",
  presets: [sharedConfig],
  corePlugins: {
    // preflight: false,
  },
};

export default config;
