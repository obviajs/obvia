import {Label} from "/flowerui/components/Label.js";
import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";

var JRLabel = function (_props) {
  // _props.components = {ctor: JRBand, props: {
  //     id: 'jr_resizer',
  //     type : "CONTAINER_FLUID",
  //     classes: ["resizable"]
  // }}
  let _defaultParams = {
    width: "",
    height: "",
    fontSize: "",
    color: "",
  };

  _props = ObjectUtils.extend(false, false, _defaultParams, _props);
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

  let _beforeAttach = this.beforeAttach;
  this.beforeAttach = function (e) {
    if (e.target.id == this.domID) {
      if (typeof _beforeAttach == 'function') _beforeAttach.apply(this, arguments);
      if (_props.x) this.x = _props.x;
      if (_props.y) this.y = _props.y;
    }
  };

  let r = Label.call(this, _props);
  // let resizeBtn = new JRBand({
  //   id: "jr_resizer",
  //   type: "CONTAINER_FLUID",
  //   classes: ["resizable"],
  // });
  this.implement(new JRComponent(_props));
  // this.add(resizeBtn, 0);

  return r;
};
JRLabel.prototype.ctor = "JRLabel";
export {
  JRLabel
};
