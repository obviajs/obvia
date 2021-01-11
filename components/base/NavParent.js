var NavParent = function (_props) {
    let _self = this,
        _selectedIndex;

    Object.defineProperty(this, "selectedIndex", {
        get: function selectedIndex() {
            return _selectedIndex;
        },
        set: function selectedIndex(v) {
            if (_selectedIndex != v) {
                let event = jQuery.Event("change");
                this.trigger(event, [_selectedIndex, v]);
                if (!event.isDefaultPrevented()) {
                    _selectedIndex = v;
                    event = jQuery.Event("changed");
                    this.trigger(event, [_selectedIndex, v]);
                }
            }
        }
    });

    let _init = this.init;
    this.init = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _init == 'function')
                _init.apply(this, arguments);
        }
    };

    let _endDraw = this.endDraw;
    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _endDraw == 'function')
                _endDraw.apply(this, arguments);

            if (this.components && Array.isArray(this.components)) {
                let len = this.components.length;
                for (let i = 0; i < len; i++) {
                    let cmpInstance = this.children[this.csorted[i]];
                    if (_self.$navigation && cmpInstance.$header) {
                        cmpInstance.$header.on("click", (e) => {
                            _childClicked(e, i);
                        });
                        _self.$navigation.append(cmpInstance.$header);
                    }
                }
            }
        }
    };

    let _beforeAttach = this.beforeAttach;
    this.beforeAttach = function (e) {
        if (e.target.id == this.domID) {
            if (typeof _beforeAttach == 'function')
                _beforeAttach.apply(this, arguments);
            if (_props.selectedIndex != null)
                this.selectedIndex = _props.selectedIndex;
        }
    };

    let _childClicked = function (e, index) {
        _self.selectedIndex = index;
    };

    this.$navigation = null;
    let _defaultParams = {
        selectedIndex: 0
    };
    _props = extend(false, false, _defaultParams, _props);

    if (!_props.attr) {
        _props.attr = {};
    }
    let myDtEvts = ["change", "changed"];
    if (!Object.isEmpty(_props.attr) && _props.attr["data-triggers"] && !Object.isEmpty(_props.attr["data-triggers"])) {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++) {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");

    let r = Container.call(this, _props);
    return r;
};
NavParent.prototype.ctor = 'NavParent';