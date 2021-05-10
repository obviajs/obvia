import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";

var FormProperties = function (_props) {
    let _defaultParams = {
        form_id: 0,
        form_name: '',
        description: '',
        date_created: '',
        date_modified: '',
        deleted: 0,
        author_id_user: 0,
        form_help_url: '',
        id_form_type: 0,
        form_literal: '',
        form_literal_view: '',
        form_guid: null
    };
    _props = ObjectUtils.extend(false, false, _defaultParams, _props);
    this.form_id = _props.form_id;
    this.form_name = _props.form_name;
    this.description = _props.description;
    this.date_created = _props.date_created;
    this.author_id_user = _props.author_id_user;
    this.form_literal = _props.form_literal;
    this.deleted = _props.deleted;
    this.form_help_url = _props.form_help_url;
    this.date_modified = _props.date_modified;
    this.id_form_type = _props.id_form_type;
    this.form_literal_view = _props.form_literal_view;
    this.form_guid = _props.form_guid;

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
export {
    FormProperties
};