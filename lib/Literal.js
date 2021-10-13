import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";
import { Injector } from "/obvia/lib/Injector.js";


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
            el = await Injector.getInstance().inject(_literal.ctor, {
                "_props": props
            });
            //el = new _literal.ctor(props);
        }
        catch (error) {
            console.error(error.description || error);
        }
    }
    return el;
};
export {
    Literal
};