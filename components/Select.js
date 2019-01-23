/**
 * This is a Select Html Element
 *
 * Kreatx 2019
 */

//component definition
var Select = function (_props, overrided=false) {
    Object.defineProperty(this, "label",
        {
            get: function label() {
                return _label;
            },
            set: function label(v) {
                if (_label != v && _label !== undefined) {
                    _label = v;
                    if (this.$label)
                        this.$label.html(v);
                }
            }
        });

    Object.defineProperty(this, "value",
        {
            set: function value(v) {
                if (_value != v) {
                    _value = v;
                    this.$select.val(v);
                    this.trigger('change');
                }
            }
        });

    this.beforeAttach = function () {
        if (_embedded)
            this.$select = this.$el;
        else {
            this.$select = this.$el.find("#" + this.domID);
            this.$label = this.$el.find("label");
        }

    };

    this.afterAttach = function (e) {
        this.$select.html(this.renderOptions());
    };

    this.handleChange = function (e) {
        _value = this.$select.val();
    };

    this.template = function () {
        return (!_embedded ? ("<div id='" + this.domID + "-wrapper' class='" + (this.colspan ? "col-sm-" + this.colspan : "") + " form-group rowspan" + this.rowspan + " resizable '>") : "") +
            (!_embedded ? ("<label rv-if='label'><b>"+_label+"</b></label>") : "") +
            "<select data-triggers='change' rv-enabled='"+_enabled+"' rv-class='"+this.cssClass+"' id='" + this.domID + "'>" +
            "</select>" +
            (!_embedded ? ("</div>") : "");
    };

    this.selectByText = function (text) {
        var _self = this;

        this.$select.find('option').each(function () {
            if ($(this).html() == text) {
                _self.setValue($(this).attr('value'));
            }
        });

        return this;
    };

    this.renderOptions = function () {
        var opts = "";

        _dataProvider.forEach(function (option, index) {
            if (option[_valueField] == _value) {
                opts += "<option value=" + option[_valueField] + " selected>" + option[_textField] + "</option>";
            } else {
                opts += "<option value=" + option[_valueField] + ">" + option[_textField] + "</option>";
            }
        }.bind(this));

        return opts;
    };

    var _defaultParams = {
        label: "",
        dataProvider: null,
        textField: "",
        valueField: "",
        value: "",
        class: "form-control",
        enabled: true,
        embedded: false,
        afterAttach: this.afterAttach,
        change: this.handleChange.bind(this)
    };

    _props = extend(false, false, _defaultParams, _props);

    var _embedded = _props.embedded;
    var _label = !_embedded ? _props.label : undefined;
    var _dataProvider = _props.dataProvider;
    var _textField = _props.textField;
    var _valueField = _props.valueField;
    var _value = _props.value;
    var _enabled = _props.enabled;

    Component.call(this, _props);

    if(overrided)
    {
        this.keepBase();
    }
};

//component prototype
Select.type = 'select';