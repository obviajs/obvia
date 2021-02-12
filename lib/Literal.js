var Literal = function () {
    this.fromLiteral = function (_literal) {
        let props = _literal.props;
        if (_literal.ctor) {
            if (typeof _literal.ctor == "string") {
                _literal.ctor = window[_literal.ctor];
            }
            let el = new _literal.ctor(props);
            return el;
        }
    };
};