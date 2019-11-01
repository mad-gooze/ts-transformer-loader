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
var loader_utils_1 = require("loader-utils");
var ts = __importStar(require("typescript"));
var path_1 = __importDefault(require("path"));
function parseOptions(context) {
    var loaderOptions = (loader_utils_1.getOptions(context) || {});
    var _a = loaderOptions.configName, configName = _a === void 0 ? 'tsconfig.json' : _a;
    var getTransformers;
    if (typeof loaderOptions.getTransformers === 'function') {
        getTransformers = loaderOptions.getTransformers;
    }
    else if (typeof loaderOptions.getTransformers === 'string') {
        // allow passing a string if you are using thread-loader
        // see https://github.com/s-panferov/awesome-typescript-loader/pull/531/files
        try {
            getTransformers = require(loaderOptions.getTransformers);
        }
        catch (err) {
            throw new Error("Failed to load getTransformers from \"" + loaderOptions.getTransformers + "\": " + err.message);
        }
        if (typeof getTransformers !== 'function') {
            throw new Error("Custom transformers in \"" + loaderOptions.getTransformers + "\" should export a function, got " + typeof getTransformers);
        }
    }
    return { configName: configName, getTransformers: getTransformers };
}
var program = undefined;
function createProgram(configName) {
    var configPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, configName);
    var configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    var tsConfigFile = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path_1.default.basename(configPath), {
        allowJs: true,
    }, configPath);
    var compilerOptions = tsConfigFile.options;
    return ts.createProgram(tsConfigFile.fileNames, compilerOptions);
}
function processResource(context, source) {
    var _a = parseOptions(context), configName = _a.configName, getTransformers = _a.getTransformers;
    if (!program) {
        program = createProgram(configName);
    }
    var sourceFile = program.getSourceFile(context.resourcePath);
    if (!sourceFile) {
        return source;
    }
    var transformers = getTransformers(program);
    var _b = __read(ts.transform(sourceFile, transformers).transformed, 1), transformed = _b[0];
    var printer = ts.createPrinter();
    return printer.printFile(transformed);
}
function loader(source) {
    // Mark the loader as being cacheable since the result should be
    // deterministic.
    this.cacheable && this.cacheable();
    // Loaders can operate in either synchronous or asynchronous mode. Errors in
    // asynchronous mode should be reported using the supplied callback.
    // Will return a callback if operating in asynchronous mode.
    var callback = this.async();
    try {
        var newSource = processResource(this, source);
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
//# sourceMappingURL=index.js.map