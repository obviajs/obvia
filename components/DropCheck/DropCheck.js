/*
 *
 * This is a DropCheck Element
 *
 *
 */

import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";
import { Button, ButtonSize } from "/obvia/components/Button/Button.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { CheckBox } from "/obvia/components/CheckBox.js";
import { CheckBoxGroup } from "/obvia/components/CheckBoxGroup.js";
import { Repeater } from "/obvia/components/Repeater/Repeater.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";

var DropCheck = function (_props) {
  let _self = this;

  let _dataProvider,
    _btnDD,
    labelConcatenation,
    _label,
    myw,
    _enabled = true;

  Object.defineProperty(this, "labelField", {
    get: function labelField() {
      return _labelField;
    },
    set: function labelField(v) {
      if (_labelField != v) {
        _labelField = v;
        this.components = fnContainerDelayInit();
        this.removeAllRows();
        if (_dataProvider && _dataProvider.length > 0) {
          let dpFields = Object.getOwnPropertyNames(_dataProvider[0]);
          if (
            propDataProvider &&
            dpFields.includes(_labelField) &&
            dpFields.includes(_valueField)
          ) {
            propDataProvider["set"].call(_self, _dataProvider);
          }
        }
      }
    },
    enumerable: true,
  });

  let propDataProvider = Object.getOwnPropertyDescriptor(this, "dataProvider");

  Object.defineProperty(this, "dataProvider", {
    get: function dataProvider() {
      return _dataProvider;
    },
    set: function dataProvider(v) {
      _dataProvider = v;
      this.removeAllRows();

      if (v && v.length > 0) {
        let dpFields = Object.getOwnPropertyNames(v[0]);
        if (dpFields.includes(_labelField) && dpFields.includes(_valueField)) {
          propDataProvider["set"].call(_self, _dataProvider);
        }
      } else {
        propDataProvider["set"].call(_self, _dataProvider);
      }
    },
    enumerable: true,
  });

  Object.defineProperty(this, "valueField", {
    get: function valueField() {
      return _valueField;
    },
    enumerable: true,
  });

  Object.defineProperty(this, "value", {
    get: function value() {
      return _value;
    },
    set: function value(v) {
      if (v) {
        if (_value != v) {
          let m = ArrayUtils.getMatching(_dataProvider, _valueField, v).objects;
          if (m.length > 0) {
            v = m[0];
            _value = v;
            _btnDD.label = v[_labelField];

            const matchedItem = _dataProvider.find(
              (item) => item[_valueField] === v[_valueField]
            );
            if (matchedItem) {
              matchedItem.currentRow.checkBox.checked = true;
            }

            return;
          } else {
            labelConcatenation = _dataProvider
              .filter((item) => item.currentRow.checkBox.checked)
              .map((item) => item[_labelField])
              .join(", ");
            _btnDD.label =
              labelConcatenation.length > 1 ? labelConcatenation : _label;
          }
        }
      } else {
        _dataProvider.forEach((item) => {
          item.currentRow.checkBox.checked = false;
        });
        _btnDD.label = _label;
      }
      this.trigger("change");
      myw.propertyChanged("value", _value, v);
    },
  });
  if (!this.hasOwnProperty("label")) {
    Object.defineProperty(this, "label", {
      get: function label() {
        return _label;
      },
      set: function label(v) {
        _label = v;
      },
      enumerable: true,
    });
  }
  this.endDraw = function (e) {
    if (e.target.id == this.domID) {
      _btnDD = this.button;
      if (_props.label && !this.getBindingExpression("label")) {
        _btnDD.label = this.label = _props.label;
      }
      if (_props.selectedItem && !this.getBindingExpression("selectedItem")) {
        this.selectedItem = _props.selectedItem;
      }
    }
  };

  this.init = function (e) {
    myw = ChangeWatcher.getInstance(_self);
  };

  this.beforeAttach = function (e) {
    if (e.target.id == this.domID) {
    }
  };

  this.afterAttach = function (e) {};

  let fnInitCmpLink = function () {
    let _componentLink = {
      ctor: CheckBox,
      props: {
        id: "checkbox",
        click: _clickHandler,
      },
    };

    if (_hrefField) {
      _componentLink.props.href = "{" + _hrefField + "}";
    }
    if (_labelField) {
      _componentLink.props.label = "{" + _labelField + "}";
    }
    return _componentLink;
  };
  let fnContainerDelayInit = function () {
    let _componentButton = {
      ctor: Button,
      props: {
        id: "button",
        classes: [
          _size,
          _split,
          "btn",
          "btn-secondary",
          "dropdown-toggle",
          "p-0",
        ],
        css: {
          overflow: "hidden",
          "white-space": "nowrap",
          "text-overflow": "ellipsis",
          width: "100%",
          display: "block",
        },
        attr: {
          "data-toggle": "dropdown",
          "aria-haspopup": "true",
          "aria-expanded": "false",
        },
        width: "100%",
      },
    };

    let _componentLink = fnInitCmpLink();

    let _componentRepeaterLit = {
      ctor: "CheckBoxGroup",
      props: {
        type: "",
        valueField: _props.valueField,
        labelField: _props.labelField,
        checkedField: "checkboxChecked",
        rendering: {
          direction: "",
          separator: false,
          wrap: false,
          mode: "append",
        },
        id: "checkboxGroup",
        classes: ["dropdown-menu"],
        dataProvider: _dataProvider,
        css: {
          "max-height": "18em",
          "min-width": "100%",
          padding: "0.25rem",
        },
        click: _clickHandler,
      },
    };
    return [_componentButton, _componentRepeaterLit];
  };

  let _defaultParams = {
    id: "dropcheck",
    dataProvider: [],
    hrefField: null,
    labelField: null,
    valueField: null,
    selectOption: true,
    keyField: "",
    value: null,
    classes: [DropMenuDirection.DROPCHECK],
    label: "",
    size: ButtonSize.SMALL,
    type: "",
    split: DropSplitType.SPLIT,
    guidField: "guid",
  };

  const _clickHandler = function (e, ra) {
    this.display = true;
    _self.value = _self.children.checkboxGroup.value;
    e.stopPropagation();
  };
  ObjectUtils.fromDefault(_defaultParams, _props);
  if (!_props.attr) {
    _props.attr = {};
  }
  _props.attr["data-triggers"] = "change";

  let _hrefField = _props.hrefField;
  let _labelField = _props.labelField;
  let _valueField = _props.valueField;
  let _value = _props.value;
  let _change = _props.change;
  let _size = _props.size;
  let _split = _props.split;
  let _guidField = _props.guidField;

  if (_props.dataProvider && !StringUtils.getBindingExp(_props.dataProvider)) {
    const clonedDataProvider = _props.dataProvider.map((item) => {
      return {
        ...item,
        checked: false,
      };
    });

    _dataProvider = clonedDataProvider;
  }
  _props.components = fnContainerDelayInit();

  let r = Container.call(this, _props, true);

  Object.defineProperty(this, "enabled", {
    get: function enabled() {
      return _enabled;
    },
    set: function enabled(v) {
      if (_enabled != v) {
        _enabled = v;
        if (_btnDD) _btnDD.enabled = _enabled;
      }
    },
    configurable: true,
    enumerable: true,
  });
  return r;
};
DropCheck.prototype.ctor = "DropCheck";
DropCheck.prototype.valueProp = "value";

var DropSplitType = {
  NONE: "",
  SPLIT: "dropcheck-toggle-split",
};
var DropMenuDirection = {
  DROPDOWN: "dropdown",
  DROPUP: "btn-group dropup",
  DROPLEFT: "btn-group dropleft",
  DROPRIGHT: "btn-group dropright",
};
DependencyContainer.getInstance().register(
  "DropCheck",
  DropCheck,
  DependencyContainer.simpleResolve
);
export { DropCheck, DropSplitType, DropMenuDirection };
