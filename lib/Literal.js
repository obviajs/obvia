import { DependencyContainer } from "/flowerui/lib/DependencyContainer.js";



var Literal = function () {
    this.fromLiteral = Literal.fromLiteral;
    this.awaitFromLiteral = Literal.awaitFromLiteral;
};
Literal.SimpleContainer = DependencyContainer.getInstance();
Literal.fromLiteral = async function (_literal) {
    let el = _literal;
    if (_literal && _literal.props && _literal.ctor) {
        let props = _literal.props;
        try {
        if (typeof _literal.ctor == "string") {          
                _literal.ctor = await Literal.SimpleContainer.get(_literal.ctor);           
            }
            el = new _literal.ctor(props);
        }
        catch (error) {
            console.error(error.description);
        }
    }
    return el;
};
export {
    Literal
};