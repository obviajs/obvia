var Literal = function () {
    this.fromLiteral = Literal.fromLiteral;
    this.awaitFromLiteral = Literal.awaitFromLiteral;
};
Literal.fromLiteral = function (_literal) {
    let el = _literal;
    if (_literal && _literal.props && _literal.ctor) {
        let props = _literal.props;
        if (typeof _literal.ctor == "string") {
            _literal.ctor = window[_literal.ctor];
        }
        el = new _literal.ctor(props);
    }
    return el;
};