/**
 * This is a TrippleSwitch component
 *
 * Kreatx 2019
 */

var TrippleSwitch = function (_props, overrided = false) {
    var _self = this;

    Object.defineProperty(this, "value", {
        get: function value() {
            return _value;
        },
        set: function value(v) {
            _value = v;

            if (_value == "1") {
                _btnLeft = _mappings.btnLeft;
                _btnRight = _mappings.default;
                _btnMiddle = _mappings.default;
            } else if (_value == "0") {
                _btnRight = _mappings.btnRight;
                _btnLeft = _mappings.default;
                _btnMiddle = _mappings.default;
            } else {
                _btnLeft = _mappings.default;
                _btnRight = _mappings.default;
                _btnMiddle = _mappings.btnMiddle;
            }
            this.trigger('change');
        }
    });

    this.beforeAttach = function () {
        this.$btnLeft = this.$el.find("#btnLeft-" + this.domID);
        this.$btnMiddle = this.$el.find("#btnMiddle-" + this.domID);
        this.$btnRight = this.$el.find("#btnRight-" + this.domID);
    };

    this.afterAttach = function (e) {
        this.trigger('creationComplete');
    };

    this.handleClick = function (e, btn) {
        this.value = (btn == 'btnLeft') ? "1" :
            (btn == 'btnRight') ? "0" : "-1";

        this.trigger('change');
    };

    this.template = function () {
        return "<div id='" + this.domID + "' class='btn btn-group' role='group' style='padding:0'>" +
            "<button class='btn btn-success' type='button'  id='btnLeft-" + this.domID + "'>left</button> " +
            "<button class='btn btn-default' type='button'  id='btnMiddle-" + this.domID + "'>mid</button>" +
            "<button class='btn btn-default' type='button' id='btnRight-" + this.domID + "'>right</button>" +
            "</div>";
    };

    var _defaultParams = {
        id: 'trippleswitch',
        colspan: '3',
        label: '',
        versionStyle: "",
        blockProcessAttr: false,
        required: false,
        dataProvider: {},
        value: "1" //1,-1,0
    };

    _props = extend(false, false, _defaultParams, _props);

    var _mappings = {
        'btnLeft': 'btn btn-success',
        'btnMiddle': 'btn btn-warning',
        'btnRight': 'btn btn-danger',
        'default': 'btn btn-default'
    };

    var _value = _props.value;
    var _click = _props.click;

    _props.click = function () {
        if (typeof _click == 'function')
            _click.apply(this, arguments);

        var e = arguments[0];
        if (!e.isDefaultPrevented()) {
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            if (arguments[0].target.id == myTrippleswitch.$btnLeft.attr('id')) {
                myTrippleswitch.$btnLeft.attr('class', _mappings['btnLeft']);
                myTrippleswitch.$btnMiddle.attr('class', _mappings['default']);
                myTrippleswitch.$btnRight.attr('class', _mappings['default']);
                args.splice(1, 0, 'btnLeft');
                _self.handleClick.apply(this, args);
            } else if (arguments[0].target.id == myTrippleswitch.$btnMiddle.attr('id')) {
                myTrippleswitch.$btnLeft.attr('class', _mappings['default']);
                myTrippleswitch.$btnMiddle.attr('class', _mappings['btnMiddle']);
                myTrippleswitch.$btnRight.attr('class', _mappings['default']);
                args.splice(1, 0, 'btnMiddle');
                _self.handleClick.apply(this, args);
            } else {
                myTrippleswitch.$btnLeft.attr('class', _mappings['default']);
                myTrippleswitch.$btnMiddle.attr('class', _mappings['default']);
                myTrippleswitch.$btnRight.attr('class', _mappings['btnRight']);
                args.splice(1, 0, 'btnRight');
                _self.handleClick.apply(this, args);
            }
        }
    };

    Component.call(this, _props);

    if (overrided) {
        this.keepBase();
    }
};

TrippleSwitch.prototype.type = 'TrippleSwitch';