import { loader } from 'webpack';
import { processResource } from './processResource';

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
