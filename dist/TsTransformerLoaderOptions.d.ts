import { OptionObject } from 'loader-utils';
import * as ts from 'typescript';
export interface TsTransformerLoaderOptions extends OptionObject {
    configName: string;
    getTransformers: (program: ts.Program) => ts.TransformerFactory<ts.SourceFile>[];
}
