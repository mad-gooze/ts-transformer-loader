import { loader } from "webpack";
import * as ts from "typescript";
import path from "path";
import { getOptions } from "loader-utils";

const printer = ts.createPrinter();

export default function loader(
    this: loader.LoaderContext,
    source: string,
) {

    // Mark the loader as being cacheable since the result should be
    // deterministic.
    this.cacheable && this.cacheable();

    // Loaders can operate in either synchronous or asynchronous mode. Errors in
    // asynchronous mode should be reported using the supplied callback.

    // Will return a callback if operating in asynchronous mode.
    const callback = this.async();

    try {
        const newSource = processResource(this);

        if (!callback) return newSource;
        callback(null, newSource);
        return;
    } catch (e) {
        if (callback) {
            callback(e);
            return;
        }
        throw e;
    }
}

let program: ts.Program | undefined = undefined;


function processResource(context: loader.LoaderContext): string {
    const loaderOptions = getOptions(context) || {};
    const { getTransformers =() => [] } = loaderOptions;

    const configPath = ts.findConfigFile(
        process.cwd(),
        ts.sys.fileExists,
        'tsconfig.json',
    );

    if (program === undefined) {
        const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
        const tsConfigFile = ts.parseJsonConfigFileContent(
            configFile.config,
            ts.sys,
            path.basename(configPath),
            {
                allowJs: true,
            },
            configPath,
        );

        const compilerOptions = tsConfigFile.options;
        program = ts.createProgram(tsConfigFile.fileNames, compilerOptions);
    }

    const sourceFile = program.getSourceFile(context.resourcePath);

    const { transformed: [transformed] } = ts.transform(sourceFile, getTransformers(program));
    return printer.printFile(transformed);
}
