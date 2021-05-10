import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";

var ReportProperties = function (_props) {
    let _defaultParams = {
        report_id: 0,
        report_name: '',
        description: '',
        date_created: '',
        date_modified: '',
        deleted: 0,
        author_id_user: 0,
        report_help_url: '',
        id_dataview: '',
        id_report_type: 0,
        report_literal: '',
        report_literal_view: '',
        report_guid: '',
        id_document: 0,
        component_count: 0,
        dataviewFields_list: '',
        xml: ''
    };
    _props = ObjectUtils.extend(false, false, _defaultParams, _props);
    this.report_id = _props.report_id;
    this.report_name = _props.report_name;
    this.description = _props.description;
    this.date_created = _props.date_created;
    this.author_id_user = _props.author_id_user;
    this.report_literal = _props.report_literal;
    this.deleted = _props.deleted;
    this.report_help_url = _props.report_help_url;
    this.date_modified = _props.date_modified;
    this.id_report_type = _props.id_report_type;
    this.id_dataview = _props.id_dataview;
    this.report_literal_view = _props.report_literal_view;
    this.report_guid = _props.report_guid;
    this.id_document = _props.id_document;
    this.component_count = _props.component_count;
    this.dataviewFields_list = _props.dataviewFields_list;
    this.xml = _props.xml;
    
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
ReportProperties.prototype.ctor = 'ReportProperties';
export {
    ReportProperties
};