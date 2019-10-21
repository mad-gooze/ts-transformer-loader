import { getOptions } from 'loader-utils';
import path from 'path';
import { loader } from 'webpack';
import * as ts from 'typescript';
import { TsTransformerLoaderOptions } from './TsTransformerLoaderOptions';

let program: ts.Program | undefined = undefined;
const printer = ts.createPrinter();

const noopGetTransformers: TsTransformerLoaderOptions['getTransformers'] = () => [];

export function processResource(context: loader.LoaderContext, source: string): string {
    const loaderOptions = (getOptions(context) || {}) as TsTransformerLoaderOptions;
    const { getTransformers = noopGetTransformers, configName = 'tsconfig.json' } = loaderOptions;

    if (program === undefined) {
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
        program = ts.createProgram(tsConfigFile.fileNames, compilerOptions);
    }

    const sourceFile = program.getSourceFile(context.resourcePath);
    if (!sourceFile) {
        return source;
    }

    const transformers = getTransformers(program);
    const {
        transformed: [transformed],
    } = ts.transform(sourceFile, transformers);
    return printer.printFile(transformed);
}
