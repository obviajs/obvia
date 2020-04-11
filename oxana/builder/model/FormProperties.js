var FormProperties = function (_props) {
    let _defaultParams = {
        form_id:0,
        form_name: '',
        description: '',
        date_created: '',
        author: ''        
    };
    _props = extend(false, false, _defaultParams, _props);
    this.form_id = _props.form_id;
    this.form_name = _props.form_name;
    this.description = _props.description;
    this.date_created = _props.date_created;
    this.author = _props.author;
    this.form_literal = _props.form_literal;
    
    Object.defineProperty(this, "props", {
        get: function props() {
            let obj = {};
            for (let prop in _props) {
                if (this.hasOwnProperty(prop) && this.propertyIsEnumerable(prop) && (typeof _props[prop] != 'function') && (prop != "ownerDocument"))
                    obj[prop] = this[prop];
            }
            return obj;
        },
        configurable: true
    });
};
FormProperties.prototype.ctor = 'FormProperties';