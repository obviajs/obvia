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
import { Repeater } from "/obvia/components/Repeater/Repeater.js";
import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";

var DropCheck = function (_props) {
  let _self = this;

  let _dataProvider,
    _btnDD,
    _componentRepeater,
    _label,
    _selectedItem = [],
    myw,
    _enabled = true;

  Object.defineProperty(this, "labelField", {
    get: function labelField() {
      return _labelField;
    },
    set: function labelField(v) {
      if (_labelField != v) {
        _labelField = v;
        _componentRepeater.components = fnInitCmpLink();
        if (_dataProvider && _dataProvider.length > 0) {
          let dpFields = Object.getOwnPropertyNames(_dataProvider[0]);
          if (dpFields.includes(_labelField)) {
            _componentRepeater.dataProvider = _dataProvider;
          }
        }
      }
    },
    enumerable: true,
  });

  Object.defineProperty(this, "dataProvider", {
    get: function dataProvider() {
      return _dataProvider;
    },
    set: function dataProvider(v) {
      _dataProvider = v;

      if (v && v.length > 0) {
        let dpFields = Object.getOwnPropertyNames(v[0]);
        if (dpFields.includes(_labelField)) {
          _componentRepeater.dataProvider = _dataProvider;
        }
      } else {
        _componentRepeater.dataProvider = _dataProvider;
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

  Object.defineProperty(this, "selectedItem", {
    get: function selectedItem() {
      return _selectedItem;
    },
    set: function selectedItem(v) {
      let oldValue = Array.isArray(_selectedItem) ? [..._selectedItem] : { ..._selectedItem };
      if (v)
      {
        if (_selectedItem != v) {
          let labelConcatenation;

          let existingValue = !Array.isArray(oldValue[_valueField]) ? v[0] : Array.isArray(_selectedItem) && _selectedItem.length > 0 ? v.find((item) => _selectedItem.some((item2) => item[_valueField] !== item2[_valueField])) : v[1] || v[0];
          
          let m = ArrayUtils.getMatching(_componentRepeater.dataProvider, _valueField, v).objects;
          if (m.length > 0)
          {
            v = m[0];
            _selectedItem = v;
            _btnDD.label = v[_labelField];
          
            const matchedItem = _componentRepeater.dataProvider.find(item => item[_valueField] === v[_valueField]);
            if (matchedItem) {
              matchedItem.currentRow.checkbox.checked = true;
            }

            this.trigger("change");
            myw.propertyChanged("selectedItem", oldValue, _selectedItem);

            return;
          } 
          
          
          if (v?.length > 0) 
          {
            let otherSelection = v.some((item) => !Array.isArray(item));

            if (otherSelection && !Array.isArray(existingValue) && !Array.isArray(existingValue[_valueField]))
            {
              _dataProvider[0].currentRow.checkbox.checked = false;
              _selectedItem = v;
              labelConcatenation = _selectedItem
                .filter((item) => item.currentRow.checkbox.checked)
                .map((item) => item[_labelField])
                .join(", ");
              _btnDD.label = labelConcatenation;
            } 
            else 
            {
              _dataProvider.forEach((item, index) => {
                item.currentRow.checkbox.checked = index === 0;
              });
              _selectedItem = v[0];
              _btnDD.label = v[0][_labelField];
            }
          }
          else 
          {
            _selectedItem = [];
            _btnDD.label = _props.label;
            _dataProvider.forEach((item) => {
              item.currentRow.checkbox.checked = false;
            });
          }
          this.trigger("change");
          myw.propertyChanged("selectedItem", oldValue, _selectedItem);
        }
      } else
      {
        _selectedItem = [];
        _btnDD.label = _props.label;
        _dataProvider.forEach((item) => {
          item.currentRow.checkbox.checked = false;
        });
        if (typeof oldValue === "object" || oldValue.length !== 0)
        {
          this.trigger("change");
          myw.propertyChanged("selectedItem", oldValue, _selectedItem);
        }
      }
    }
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
      _componentRepeater = this.repeater;
      _componentRepeater.attr["aria-labelledby"] = _btnDD.domID;
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
        classes: [_size, _split, "btn", "btn-secondary", "dropdown-toggle", "p-0"],
        css: {
          "overflow": "hidden",
          "white-space": "nowrap",
          "text-overflow": "ellipsis",
          "width": "100%",
          display: "block"
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
      ctor: Repeater,
      props: {
        id: "repeater",
        type: "",
        classes: ["dropdown-menu"],
        components: [_componentLink],
        dataProvider: _dataProvider,
        dataProviderUpdate: _addScrollableProp,
        css: {
          "max-height": "18em",
          "min-width": "100%",
          "padding": "0.25rem",
        },
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

  const _addScrollableProp = function (e) {
    if (this.dataProvider.length > 6) {
      this.props.css["overflow-y"] = "scroll";
    } else {
      this.props.css["overflow-y"] = "hidden";
    }
  };

  let _clickHandler = function (e) {
    _self.selectedItem = [..._componentRepeater.dataProvider].filter(
      (item) => item.currentRow?.checkbox?.checked
    );

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
  let _defaultSelectAllLabel = _props.defaultSelectAllLabel || " Select All";

  if (_props.dataProvider && !StringUtils.getBindingExp(_props.dataProvider)) 
  {
    const clonedDataProvider = [..._props.dataProvider];
  
    if (clonedDataProvider.length > 0) {
      clonedDataProvider.unshift({
        [_labelField]: _defaultSelectAllLabel,
        [_valueField]: clonedDataProvider.map((item) => item[this.valueField]),
      });
    }
  
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
DropCheck.prototype.valueProp = "selectedItem";
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
