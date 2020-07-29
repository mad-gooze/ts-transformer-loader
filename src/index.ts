import { getOptions } from 'loader-utils';
import { loader } from 'webpack';
import { TsTransformerLoaderOptions } from './TsTransformerLoaderOptions';
import * as ts from 'typescript';
import path from 'path';

type ParsedOptions = {
    configName: string;
    getTransformers: (program: ts.Program) => ts.TransformerFactory<ts.SourceFile>[];
};

function parseOptions(context: loader.LoaderContext): ParsedOptions {
    const loaderOptions = (getOptions(context) || {}) as TsTransformerLoaderOptions;
    const { configName = 'tsconfig.json' } = loaderOptions;

    let getTransformers: ParsedOptions['getTransformers'];
    if (typeof loaderOptions.getTransformers === 'function') {
        getTransformers = loaderOptions.getTransformers as ParsedOptions['getTransformers'];
    } else if (typeof loaderOptions.getTransformers === 'string') {
        // allow passing a string if you are using thread-loader
        // see https://github.com/s-panferov/awesome-typescript-loader/pull/531/files
        try {
            getTransformers = require(loaderOptions.getTransformers);
        } catch (err) {
            throw new Error(`Failed to load getTransformers from "${loaderOptions.getTransformers}": ${err.message}`);
        }

        if (typeof getTransformers !== 'function') {
            throw new Error(
                `Custom transformers in "${
                    loaderOptions.getTransformers
                }" should export a function, got ${typeof getTransformers}`,
            );
        }
    }

    return { configName, getTransformers };
}

let program: ts.Program | undefined = undefined;

/**
 * Creates ts.Program or returns already created
 * @param configName - tsconfig filename
 */
function createProgram(configName: string): ts.Program {
    const configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, configName);
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
    return ts.createProgram(tsConfigFile.fileNames, compilerOptions);
}

/**
 * Transforms single resource and applies configured transformers
 */
function processResource(context: loader.LoaderContext, source: string): string {
    const { configName, getTransformers } = parseOptions(context);

    if (!program) {
        program = createProgram(configName);
    }

    const sourceFile = program.getSourceFile(context.resourcePath);
    if (!sourceFile) {
        return source;
    }

    const transformers = getTransformers(program);
    const {
        transformed: [transformed],
    } = ts.transform(sourceFile, transformers);
    const printer = ts.createPrinter();
    return printer.printFile(transformed);
}

export default function loader(this: loader.LoaderContext, source: string): string | void {
    // Mark the loader as being cacheable since the result should be
    // deterministic.
    this.cacheable && this.cacheable();

    // Loaders can operate in either synchronous or asynchronous mode. Errors in
    // asynchronous mode should be reported using the supplied callback.

    // Will return a callback if operating in asynchronous mode.
    const callback = this.async();

    try {
        const newSource = processResource(this, source);

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
