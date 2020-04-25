const ts = require('typescript');

// simple transformer that converts numbers to string literals
function numberTransformer() {
    return context => {
        const visit = node => {
            if (ts.isNumericLiteral(node)) {
                return ts.createStringLiteral(node.text);
            }
            return ts.visitEachChild(node, child => visit(child), context);
        };

        return node => ts.visitNode(node, visit);
    };
}

module.exports = function getTransformers(program) {
    return [numberTransformer(program)];
};
