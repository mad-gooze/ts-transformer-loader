"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var loader_utils_1 = require("loader-utils");
var path_1 = __importDefault(require("path"));
var ts = __importStar(require("typescript"));
var program = undefined;
var printer = ts.createPrinter();
var noopGetTransformers = function () { return []; };
function processResource(context, source) {
    var loaderOptions = (loader_utils_1.getOptions(context) || {});
    var _a = loaderOptions.getTransformers, getTransformers = _a === void 0 ? noopGetTransformers : _a, _b = loaderOptions.configName, configName = _b === void 0 ? 'tsconfig.json' : _b;
    if (program === undefined) {
        var configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, configName);
        var configFile = ts.readConfigFile(configPath, ts.sys.readFile);
        var tsConfigFile = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path_1.default.basename(configPath), {
            allowJs: true,
        }, configPath);
        var compilerOptions = tsConfigFile.options;
        program = ts.createProgram(tsConfigFile.fileNames, compilerOptions);
    }
    var sourceFile = program.getSourceFile(context.resourcePath);
    if (!sourceFile) {
        return source;
    }
    var transformers = getTransformers(program);
    var _c = __read(ts.transform(sourceFile, transformers).transformed, 1), transformed = _c[0];
    return printer.printFile(transformed);
}
exports.processResource = processResource;
//# sourceMappingURL=processResource.js.map