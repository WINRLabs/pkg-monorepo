import fsPromises from "fs/promises";
// import esbuild from "esbuild";
import path from "path";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import { defineConfig } from "tsup";

// esbuild.build({
//   plugins: [
//     CssModulesPlugin({
//       force: true,
//       emitDeclarationFile: true,
//       localsConvention: "camelCaseOnly",
//       namedExports: true,
//       inject: false,
//     }),
//   ],
// });

export default defineConfig({
  entry: ["src/index.ts", "src/lib/game-provider.tsx"],
  loader: {
    // ".svg": "base64",
  },
  esbuildPlugins: [
    {
      name: "css-module",
      setup(build): void {
        build.onResolve(
          { filter: /\.module\.css$/, namespace: "file" },
          (args) => ({
            path: `${args.path}#css-module`,
            namespace: "css-module",
            pluginData: {
              pathDir: path.join(args.resolveDir, args.path),
            },
          })
        );
        build.onLoad(
          { filter: /#css-module$/, namespace: "css-module" },
          async (args) => {
            const { pluginData } = args as {
              pluginData: { pathDir: string };
            };

            const source = await fsPromises.readFile(
              pluginData.pathDir,
              "utf8"
            );

            let cssModule = {};
            const result = await postcss([
              postcssModules({
                getJSON(_, json) {
                  cssModule = json;
                },
              }),
            ]).process(source, { from: pluginData.pathDir });

            return {
              pluginData: { css: result.css },
              contents: `import "${pluginData.pathDir}"; export default ${JSON.stringify(
                cssModule
              )}`,
            };
          }
        );
        build.onResolve(
          { filter: /\.module\.css$/, namespace: "css-module" },
          (args) => ({
            path: path.join(args.resolveDir, args.path, "#css-module-data"),
            namespace: "css-module",
            pluginData: args.pluginData as { css: string },
          })
        );
        build.onLoad(
          { filter: /#css-module-data$/, namespace: "css-module" },
          (args) => ({
            contents: (args.pluginData as { css: string }).css,
            loader: "css",
          })
        );
      },
    },
  ],
  splitting: true,
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  minify: true,
  esbuildOptions: (options) => {
    if (!process.env.DEBUG) {
      options.drop = ["console"];
    }
    return options;
  },
});
