"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var processResource_1 = require("./processResource");
function loader(source) {
    // Mark the loader as being cacheable since the result should be
    // deterministic.
    this.cacheable && this.cacheable();
    // Loaders can operate in either synchronous or asynchronous mode. Errors in
    // asynchronous mode should be reported using the supplied callback.
    // Will return a callback if operating in asynchronous mode.
    var callback = this.async();
    try {
        var newSource = processResource_1.processResource(this, source);
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