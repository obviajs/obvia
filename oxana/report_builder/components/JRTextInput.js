var JRTextInput = function (_props) {
  let _defaultParams = {
    width: "",
    height: "",
    fontSize: "",
    color: "",
  };
  _props = extend(false, false, _defaultParams, _props);
  let _width = _props.width;
  let _height = _props.height;
  let _fontSize = _props.fontSize;
  let _color = _props.color;

  Object.defineProperty(this, "width", {
    get: function width() {
      return _width;
    },
    set: function width(v) {
      if ((_width != v) != v) {
        _width = v;
      }
    },
    enumerable: true,
  });

  Object.defineProperty(this, "height", {
    get: function height() {
      return _height;
    },
    set: function height(v) {
      if ((_height != v) != v) {
        _height = v;
      }
    },
    enumerable: true,
  });

  Object.defineProperty(this, "fontSize", {
    get: function fontSize() {
      return _fontSize;
    },
    set: function fontSize(v) {
      if (_fontSize != v) {
        _fontSize = v;
      }
    },
    enumerable: true,
  });

  Object.defineProperty(this, "color", {
    get: function color() {
      return _color;
    },
    set: function color(v) {
      if (_color != v) {
        _color = v;
      }
    },
    enumerable: true,
  });

  let r = TextInput.call(this, _props);

  this.implement(new JRComponent(_props));

  return r;
};
JRTextInput.prototype.ctor = "JRTextInput";
