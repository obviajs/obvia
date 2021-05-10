import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";

var JRComponent = function (_props) {
  let _defaultParams = {
    x: "",
    y: "",
    section: "",
    backgroundColor: "",
    transparent: "",
  };
  var _props = ObjectUtils.extend(false, false, _defaultParams, _props);

  let _x = _props.x;
  let _y = _props.y;
  let _section = _props.section;
  let _backgroundColor = _props.backgroundColor;
  let _transparent = _props.transparent;

  Object.defineProperty(this, "x", {
    get: function x() {
      return _x;
    },
    set: function x(v) {
      if (_x != v) {
        _x = v;
        if (this.$el) {
          if (_x) {
            this.show();
          } else this.hide();
        }
      }
      this.$el[0].style.left = v + "px";
    },
    enumerable: true,
  });

  Object.defineProperty(this, "y", {
    get: function y() {
      return _y;
    },
    set: function y(v) {
      if (_y != v) {
        _y = v;
      }
      this.$el[0].style.top = v + "px";
    },
    enumerable: true,
  });

  Object.defineProperty(this, "section", {
    get: function section() {
      return _section;
    },
    set: function section(v) {
      if (_section != v) {
        _section = v;
      }
    },
    enumerable: true,
  });

  Object.defineProperty(this, "backgroundColor", {
    get: function backgroundColor() {
      return _backgroundColor;
    },
    set: function backgroundColor(v) {
      if (_backgroundColor != v) {
        _backgroundColor = v;
      }
    },
    enumerable: true,
  });

  Object.defineProperty(this, "transparent", {
    get: function transparent() {
      return _transparent;
    },
    set: function transparent(v) {
      if (_transparent != v) {
        _transparent = v;
      }
    },
    enumerable: true,
  });

};
// JRComponent.prototype.ctor = 'JRComponent';
export {
  JRComponent
};