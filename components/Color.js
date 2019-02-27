/**
 * This is a Color Element
 *
 * Kreatx 2018
 */

var Color = function (_props, overrided = false) {

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            if (_value != v) {
                if (typeof v == "object") {
                    v = JSON.stringify(v);
                }
                _value = v;
            }
        }
    });


    this.beforeAttach = function () {
        this.$input = this.$el.attr('id') == this.domID ? this.$el : this.$el.find("#" + this.domID);
    };

    this.afterAttach = function (e) {
        if (e.target.id == this.$el.attr('id') && !this.attached) {
            //init input mask
            if (this.hasOwnProperty('mask')) {
                var mask;
                try {
                    mask = JSON.parse(this.mask);
                } catch (error) {
                    mask = this.mask;
                }

                this.$input.inputmask(mask);
            }

            if (typeof this.onafterAttach == 'function'){
                this.onafterAttach.apply(this, arguments);
            }
        }
    };

    this.changeHandler = function () {
        if (typeof this.onchange == 'function')
            this.onchange.apply(this, arguments);
        this.validate();
    };

    this.validate = function () {
        if (this.required) {
            if (this.value == "" || this.value == undefined) {
                this.errorList = [
                    KxGenerator.getErrorList().call(this)['empty']
                ];

                this.$input.addClass('invalid');

                return false;
            } else {
                this.errorList = [];
                this.$input.removeClass('invalid');
                return true;
            }
        } else
            return true;
    };

    this.changeHandler = function () {
        if (typeof this.onchange == 'function')
            this.onchange.apply(this, arguments);
        this.validate();
    };

    this.focus = function(){
        if(this.$input != null)
        {
            this.$input.focus();
        }
    };

    this.template = function () {
        return '<input data-triggers="change" type="color" id="' + this.domID + '" style = "width:20px;height:20px">';
    };

    var _defaultParams = {
        id: 'color1',
        afterAttach: this.afterAttach
    };

    _props = extend(false, false, _defaultParams, _props);

    var _id = _props.id;
    var _value = _props.value;

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }

};