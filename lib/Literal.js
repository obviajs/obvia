import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";



var Literal = function() {
    this.fromLiteral = Literal.fromLiteral;
    this.awaitFromLiteral = Literal.awaitFromLiteral;
};
Literal.SimpleContainer = DependencyContainer.getInstance("SimpleContainer");
Literal.fromLiteral = async function(_literal) {
    let el = _literal;
    if (_literal && _literal.props && _literal.ctor) {
        let props = _literal.props;
        if (typeof _literal.ctor == "string") {
            try {
                _literal.ctor = await Literal.SimpleContainer.get(_literal.ctor);
            } catch (error) {
                console.error(error.description);
            }
        }
        el = new _literal.ctor(props);
    }
    return el;
};
export {
    Literal
};