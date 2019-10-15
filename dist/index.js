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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = __importStar(require("typescript"));
var path_1 = __importDefault(require("path"));
var loader_utils_1 = require("loader-utils");
var printer = ts.createPrinter();
function loader(source) {
    // Mark the loader as being cacheable since the result should be
    // deterministic.
    this.cacheable && this.cacheable();
    // Loaders can operate in either synchronous or asynchronous mode. Errors in
    // asynchronous mode should be reported using the supplied callback.
    // Will return a callback if operating in asynchronous mode.
    var callback = this.async();
    try {
        var newSource = processResource(this);
        if (!callback)
            return newSource;
        callback(null, newSource);
        return;
    }
    catch (e) {
        if (callback) {
            callback(e);
            return;
        }
        throw e;
    }
}
exports.default = loader;
var program = undefined;
function processResource(context) {
    var loaderOptions = loader_utils_1.getOptions(context) || {};
    var _a = loaderOptions.getTransformers, getTransformers = _a === void 0 ? function () { return []; } : _a;
    var configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');
    if (program === undefined) {
        var configFile = ts.readConfigFile(configPath, ts.sys.readFile);
        var tsConfigFile = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path_1.default.basename(configPath), {
            allowJs: true,
        }, configPath);
        var compilerOptions = tsConfigFile.options;
        program = ts.createProgram(tsConfigFile.fileNames, compilerOptions);
    }
    var sourceFile = program.getSourceFile(context.resourcePath);
    var _b = __read(ts.transform(sourceFile, getTransformers(program)).transformed, 1), transformed = _b[0];
    return printer.printFile(transformed);
}
//# sourceMappingURL=index.js.map