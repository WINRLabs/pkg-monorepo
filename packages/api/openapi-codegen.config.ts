import { defineConfig } from "@openapi-codegen/cli";
import {
  generateReactQueryComponents,
  generateSchemaTypes,
} from "@openapi-codegen/typescript";

export default defineConfig({
  srcAppGeneratedApi: {
    from: {
      source: "url",
      url: "https://gateway-dev.winr.games/docs.json",
    },
    outputDir: "./api-hooks",
    to: async (context) => {
      const filenamePrefix = "srcAppGeneratedApi";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
  apiHooks: {
    from: {
      source: "url",
      url: "https://gateway-dev.winr.games/docs.json",
    },
    outputDir: "./src",
    to: async (context) => {
      const filenamePrefix = "apiHooks";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
  api: {
    from: {
      source: "url",
      url: "https://gateway-dev.winr.games/docs.json",
    },
    outputDir: "./src/",
    to: async (context) => {
      const filenamePrefix = "api";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
