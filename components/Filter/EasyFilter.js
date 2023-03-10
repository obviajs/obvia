/**
 * This is a EasyFilter Component
 *
 * Kreatx 2020
 */
import { Container } from "/obvia/components/Container.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
import { ValidationManager } from "/obvia/components/Validation/ValidationManager.js";
import { ArrayEx } from "/obvia/lib/ArrayEx.js";
import { StringUtils } from "/obvia/lib/StringUtils.js";
import { ArrayUtils } from "/obvia/lib/ArrayUtils.js";
import { Heading, HeadingType } from "/obvia/components/Heading.js";
import { AutoCompleteEx } from "/obvia/components/AutoComplete/AutoCompleteEx.js";
import { Repeater } from "/obvia/components/Repeater/Repeater.js";
import { Label, LabelType } from "/obvia/components/Label.js";
import { Button } from "/obvia/components/Button/Button.js";
import { Component } from "/obvia/components/base/Component.js";
import { getCaretPosition, setCaretPosition } from "/obvia/lib/my.js";
import { tokenize, findRightMatchingRightParenIndex } from "/obvia/lib/Tokenizer.js";
import { DependencyContainer } from "/obvia/lib/DependencyContainer.js";

var EasyFilter = function (_props)
{
    let
        _self = this,
        _valueField,
        _labelField,
        _operatorsField,
        _itemEditorField,
        _getLabelField,
        _getValueField,
        _operatorEnabledField,
        _requiredField,
        _dataProvider,
        valueAutoComplete,
        repDp,
        _tokens,
        _expression,
        _expressionContainer,
        _rules, _initialRules,
        _valid = true,
        _advancedMode, _validationGroupUID = StringUtils.guid(),
        _showOperator,
        _defaultOperators = new ArrayEx([{
            value: "contains",
            operatorLabel: "contains",
            friendly: "contains ({value})",
            inputVisible: true,
            rangeInput: false
        }, {
            value: "equal",
            operatorLabel: "equals",
            friendly: "equals to {value}",
            inputVisible: true,
            rangeInput: false
        },
        {
            value: "not_equal",
            operatorLabel: "is not equal",
            friendly: "is not equal to {value}",
            inputVisible: true,
            rangeInput: false
        },
        {
            value: "in",
            operatorLabel: "in",
            friendly: "in ({value})",
            inputVisible: true,
            rangeInput: false
        },
        {
            value: "not_in",
            operatorLabel: "not in",
            friendly: "not in ({value})",
            inputVisible: true,
            rangeInput: false
        },
        {
            value: "less",
            operatorLabel: "is less than",
            friendly: "is less than {value}",
            inputVisible: true,
            rangeInput: false
        },
        {
            value: "less_or_equal",
            operatorLabel: "is less or equal than",
            friendly: "is less or equal than {value}",
            inputVisible: true,
            rangeInput: false
        },
        {
            value: "greater",
            operatorLabel: "is greater than",
            friendly: "is greater than {value}",
            inputVisible: true,
            rangeInput: false
        },
        {
            value: "greater_or_equal",
            operatorLabel: "is greater or equal than",
            friendly: "is greater or equal than {value}",
            inputVisible: true,
            rangeInput: false
        },
        {
            value: "between",
            operatorLabel: "is between",
            friendly: "is between {min} and {max}",
            inputVisible: true,
            rangeInput: true
        },
        {
            value: "not_between",
            operatorLabel: "is not between",
            friendly: "is not between {min} and {max}",
            inputVisible: true,
            rangeInput: true
        },
        {
            value: "is_null",
            operatorLabel: "is null",
            friendly: "is null",
            inputVisible: false,
            rangeInput: false
        },
        {
            value: "is_not_null",
            operatorLabel: "is not null",
            friendly: "is not null",
            inputVisible: false,
            rangeInput: false
        }
        ]),
        _operatorsDp = _defaultOperators;

    Object.defineProperty(this, "dataProvider", {
        get: function dataProvider()
        {
            return _dataProvider;
        },
        set: function dataProvider(v)
        {
            if (_dataProvider != v)
            {
                _dataProvider = v;
                if (_self.attached)
                    _initDefaultFilters();
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "rules", {
        get: function rules()
        {
            return _rules;
        },
        set: function rules(v)
        {
            if (_rules != v)
            {
                _rules = v;
                _initialRules = {};
                ObjectUtils.fromDefault(v, _initialRules);
            }
        },
        enumerable: true
    });

    Object.defineProperty(this, "validationGroupUID", {
        get: function validationGroupUID()
        {
            return _validationGroupUID;
        },
        enumerable: true
    });

    this.endDraw = function (e)
    {
        if (e.target.id == this.domID)
        {
            _expressionContainer = this.expressionContainer;
        }
    };

    this.beforeAttach = function (e)
    {
        if (e.target.id == this.domID)
        {
            _initDefaultFilters();
        }
    };

    let _updateTokens = function ()
    {
        let cp = getCaretPosition(_expressionContainer.$el[0]);
        _tokens = tokenize(_expression).all();
        let pr = _parse(_tokens);
        _rules = pr.cond;
        let len = pr.badTokens.length;
        if (len > 0)
        {

            for (let i = 0; i < len; i++)
            {
                let id = _self.domID + "_span_" + i;
                _expression = _highlightUnknown(_expression, id, pr.badTokens[i].token.value, pr.badTokens[i].msg);
            }
            _expressionContainer.$el.html(_expression);
            for (let i = 0; i < len; i++)
            {
                let id = "#" + _self.domID + "_span_" + i;
                $(id).tooltip({
                    trigger: 'hover'
                });
            }
        } else
        {
            _expressionContainer.$el.html(_expression);
        }
        if (cp && cp.length > 0)
            setCaretPosition(_expressionContainer.$el[0], cp[0]);
    };

    /*
        validate:
        -ordinals between 1 and len of repDp
        -allow paren (left|right)
        -allow and or and not(?)
        -matching paren found?
    */
    let _expressionInput = function (e)
    {
        _expression = _expressionContainer.$el.text().toUpperCase();
        _updateTokens();
    };
    let _update = function ()
    {
        let len = repDp.length;
        let a = [];
        for (let i = 1; i <= len; i++)
        {
            a.push(i);
        }
        _expression = a.join(" AND ");
        _expressionContainer.$el.html(_expression);
        _updateTokens();
    };

    let _editFilter = async function (e, ra)
    {
        let filterItemEditor = ra.currentItem[_itemEditorField];
        let isRangeInput;
        if (ra.currentRow.repeater_container.mainCol.operator.selectedItem)
            isRangeInput = ra.currentRow.repeater_container.mainCol.operator.selectedItem.rangeInput;
        if (isRangeInput)
        {
            let minLit = Object.assign({}, filterItemEditor);
            let maxLit = Object.assign({}, filterItemEditor);
            minLit.props = Object.assign({}, filterItemEditor.props);
            maxLit.props = Object.assign({}, filterItemEditor.props);
            minLit.props.id = "minInput";
            maxLit.props.id = "maxInput";

            filterItemEditor = {
                "ctor": "Container",
                "props": {
                    "type": "",
                    "id": "formFieldInputRow",
                    "classes": ["form-row-easy", "no-form-control"],
                    "css": { "width": "100%", "font-size": "14px" },
                    "components": [{
                        "ctor": "Container",
                        "props": {
                            "type": "",
                            "id": "colMin",
                            "classes": ["col"],
                            "components": [
                                minLit,
                                {
                                    "ctor": "RequiredFieldValidator",
                                    "props": {
                                        "id": "minValueValidator",
                                        "controlToValidate": "minInput",
                                        "errorMessage": "Please enter a value for the lower boundary.",
                                        "validationGroup": _validationGroupUID,
                                        "enabled": (ra.currentItem.deleted == null || ra.currentItem.deleted == false) && ra.currentItem[_requiredField],
                                        "display": false,
                                        "css": { "color": "red" }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "ctor": "Container",
                        "props": {
                            "type": "",
                            "id": "colMax",
                            "classes": ["col"],
                            "components": [
                                maxLit,
                                {
                                    "ctor": "RequiredFieldValidator",
                                    "props": {
                                        "id": "maxValueValidator",
                                        "controlToValidate": "maxInput",
                                        "errorMessage": "Please enter a value for the upper boundary.",
                                        "validationGroup": _validationGroupUID,
                                        "enabled": (ra.currentItem.deleted == null || ra.currentItem.deleted == false) && ra.currentItem[_requiredField],
                                        "display": false,
                                        "css": { "color": "red" }
                                    }
                                }
                            ]
                        }
                    }
                    ]
                }
            };
        } else
        {
            filterItemEditor.props.id = "valueInput";
            filterItemEditor.props.classes = [];
            filterItemEditor.props.classes.push("no-form-control");
            if (!filterItemEditor.props.css)
                filterItemEditor.props.css = {};
            filterItemEditor.props.css["font-size"] = "14px";
            filterItemEditor.props.css["width"] = "12rem";
            filterItemEditor = {
                "ctor": "Container",
                "props": {
                    "type": "",
                    "classes": [],
                    "css": { "width": "100%" },
                    "components": [
                        filterItemEditor,
                        {
                            "ctor": "RequiredFieldValidator",
                            "props": {
                                "enabled": ra.currentItem[_requiredField],
                                "id": "valueValidator",
                                "controlToValidate": "valueInput",
                                "errorMessage": "Please enter a value.",
                                "validationGroup": _validationGroupUID,
                                "display": false,
                                "css": { "color": "red" }
                            }
                        }
                    ]
                }
            };
        }

        filterItemEditor = await Component.fromLiteral(filterItemEditor);
        if (ra.currentItem[_operatorsField])
        {
            _operatorsDp.splicea(0, _operatorsDp.length, ra.currentItem[_operatorsField]);
        } else
        {
            _operatorsDp.splicea(0, _operatorsDp.length, _defaultOperators);
        }
        let oldInput = ra.currentRow.repeater_container.mainRow.childAtIndex(0);
        if (oldInput)
        {
            if (oldInput.valueValidator)
                oldInput.valueValidator.destruct();
            else
            {
                oldInput.colMax.maxValueValidator.destruct();
                oldInput.colMin.minValueValidator.destruct();
            }
        }

        ra.currentRow.repeater_container.mainRow.removeChild(oldInput);
        ra.currentRow.repeater_container.mainRow.addChild(filterItemEditor);

        filterItemEditor.render().then(() =>
        {
            if (isRangeInput)
            {
                filterItemEditor.colMin.minInput.on("change", _filerValueChange);
                filterItemEditor.colMax.maxInput.on("change", _filerValueChange);
                if (ra.currentItem.value)
                {
                    if (filterItemEditor.colMin.minInput.valueProp)
                    {
                        filterItemEditor.colMin.minInput[filterItemEditor.colMin.minInput.valueProp] = ra.currentItem.value.min;
                        filterItemEditor.colMax.maxInput[filterItemEditor.colMax.maxInput.valueProp] = ra.currentItem.value.max;
                    } else
                    {
                        filterItemEditor.colMin.minInput.value = ra.currentItem.value.min;
                        filterItemEditor.colMax.maxInput.value = ra.currentItem.value.max;
                    }
                }
            } else
            {
                filterItemEditor.valueInput.on("change", _filerValueChange);
                if (ra.currentItem.value)
                {
                    if (filterItemEditor.valueInput.valueProp)
                    {
                        filterItemEditor.valueInput[filterItemEditor.valueInput.valueProp] = ra.currentItem.value.value;
                    } else
                    {
                        if (ra.currentItem.value.value != null)
                            filterItemEditor.valueInput.value = ra.currentItem.value.value;
                    }
                }
            }
            ra.currentRow.repeater_container.show();
        });
    };

    let _getValue = function (ra)
    {
        let ret = {};
        let input = ra.currentRow.repeater_container.mainRow.childAtIndex(0);
        let isRangeInput;
        if (ra.currentRow.repeater_container.mainCol.operator.selectedItem)
            isRangeInput = ra.currentRow.repeater_container.mainCol.operator.selectedItem.rangeInput;
        let value = {}, label = {};
        if (isRangeInput)
        {
            value.min = input.colMin.minInput.valueProp ? input.colMin.minInput[input.colMin.minInput.valueProp] : input.colMin.minInput.value;
            value.max = input.colMax.maxInput.valueProp ? input.colMax.maxInput[input.colMax.maxInput.valueProp] : input.colMax.maxInput.value;
            label.min = value.min;
            label.max = value.max;
            if (ra.currentItem[_getLabelField])
            {
                label.min = ra.currentItem[_getLabelField].call(input.colMin.minInput, value.min);
                label.max = ra.currentItem[_getLabelField].call(input.colMax.maxInput, value.max);
            }
            if (ra.currentItem[_getValueField])
            {
                value.min = label.min = ra.currentItem[_getValueField].call(input.colMin.minInput, value.min);
                value.max = label.max = ra.currentItem[_getValueField].call(input.colMax.maxInput, value.max);
            }
        } else
        {
            value.value = input.valueInput.valueProp ? input.valueInput[input.valueInput.valueProp] : input.valueInput.value;
            label.value = value.value;
            if (ra.currentItem[_getLabelField])
            {
                label.value = ra.currentItem[_getLabelField].call(input.valueInput, value.value);
            }
            if (ra.currentItem[_getValueField])
            {
                value.value = ra.currentItem[_getValueField].call(input.valueInput, value.value);
            }
        }
        ret.label = label;
        ret.value = value;
        return ret;
    };

    let _filerValueChange = function (e, ra)
    {
        // _self.validate().then((valid) =>
        // {
        //     if (valid)
        //     {
        let ret = _getValue(ra);
        ra.currentItem.value = ret.value;
        let operator = ra.currentItem.operatorItem;
        let label = operator.friendly.formatUnicorn(ret.label);
        //ra.currentRow.repeater_container.filterItemHeading.label = label;
        ra.currentItem.filterHeading = label;
        _update();
        //     }
        // });
    };

    let _operatorChange = function (e, ra)
    {
        ra.currentItem.operatorItem = this.selectedItem;
        if (ra.currentRow.repeater_container.mainRow)
            _editFilter(e, ra);
    };

    this.validate = function ()
    {
        return ValidationManager.getInstance().validate(_validationGroupUID).then((result) =>
        {
            let len = result.length;
            _valid = true;
            for (let i = 0; i < len; i++)
            {
                if (!result[i])
                {
                    _valid = false;
                    break;
                }
            }
            return _valid;
        });
    };

    let _cmps;

    let fnContainerDelayInit = function ()
    {
        _cmps = [
            {
                ctor: Repeater,
                props: {
                    id: 'repeater',
                    dataProvider: new ArrayEx([]),
                    rendering: {
                        direction: 'horizontal',
                        wrap: false,
                    },
                    width: "100%",
                    classes: ["filter", "repeater-easy", "mb-2"],
                    components: [
                        {
                            ctor: Container,
                            props: {
                                id: 'repeater_container',
                                classes: ["filter"],
                                type: "",
                                components: [
                                    {
                                        ctor: Container,
                                        props: {
                                            id: 'headerRow',
                                            classes: ["form-row-easy", "col"],
                                            type: "",
                                            components: [
                                                {
                                                    ctor: Label,
                                                    props: {
                                                        id: 'indexLabel',
                                                        css: {
                                                            margin: 0,
                                                        },
                                                        classes: ["filter", "index"],
                                                        type: HeadingType.h6,
                                                        label: "{currentIndex + 1}",
                                                    }
                                                },
                                                {
                                                    ctor: Label,
                                                    props: {
                                                        id: 'fieldItemHeading',
                                                        css: {
                                                            margin: 0,
                                                            "white-space": "nowrap"
                                                        },
                                                        classes: [],
                                                        type: HeadingType.h6,
                                                        align: 'left',
                                                        "bindingDefaultContext": "{currentItem}",
                                                        label: "{" + _labelField + "}",
                                                    }
                                                }]
                                        }
                                    },
                                    {
                                        ctor: Container,
                                        props: {
                                            id: 'mainCol',
                                            classes: ["form-row-easy", "col"],
                                            type: "",
                                            display: _showOperator,
                                            components: [
                                                {
                                                    "ctor": "DropDown",
                                                    "props": {
                                                        "id": "operator",
                                                        "css": { "width": "200px" },
                                                        "labelField": "operatorLabel",
                                                        "valueField": "value",
                                                        "dataProvider": _operatorsDp,
                                                        "selectedItem": "{operatorItem}",
                                                        "enabled": "{" + _operatorEnabledField + "}",
                                                        "change": _operatorChange
                                                    }
                                                },
                                                {
                                                    "ctor": "RequiredFieldValidator",
                                                    "props": {
                                                        "id": "operatorValidator",
                                                        "controlToValidate": "{currentRow.repeater_container.mainCol.operator.id}",
                                                        "errorMessage": "Please select a value for the operator.",
                                                        "validationGroup": _validationGroupUID,
                                                        "enabled": "{currentItem.deleted == null || currentItem.deleted == false}",
                                                        "display": false,
                                                        "css": { "color": "red" }
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        ctor: Container,
                                        props: {
                                            id: 'mainRow',
                                            classes: ["form-row-easy", "col"],
                                            type: "",
                                            css: {
                                                // "width": "200px"
                                            },
                                            "bindingDefaultContext": "{currentItem}",
                                            "beforeAttach": _editFilter,
                                            "display": "{currentRow.repeater_container.mainCol.operator.selectedItem.inputVisible}",
                                            keyup: function (e)
                                            {
                                                if (e.keyCode == 13)
                                                    _filter();
                                            },
                                            components: []
                                        }
                                    }]
                            }
                        }
                    ]
                }
            },
            {
                ctor: Container,
                props: {
                    id: 'expressionContainer',
                    classes: ["filter", "expression-container-easy"],
                    contenteditable: true,
                    input: _expressionInput,
                    display: _advancedMode
                }
            },
            {
                ctor: Container,
                props: {
                    type: "",
                    css: {
                        "display": "flex",
                        "margin-top": "auto",
                        'margin-right': '.25rem',
                        'gap': '.15rem',
                        'padding': '7px'
                    },
                    components: [
                        {
                            ctor: Button,
                            props: {
                                id: 'apply',
                                classes: ["filter", "apply-easy"],
                                click: _filter,
                                css: {
                                    "height": '1.5rem',
                                    "width": '2rem',
                                    "display": "flex",
                                    "align-items": "center",
                                    "justify-content": "center"
                                },
                                components: [
                                    {
                                        ctor: Label,
                                        props: {
                                            id: 'faAccept',
                                            labelType: "i",
                                            label: "",
                                            classes: ["fas", "fa-check"],
                                            css: {
                                                "text-decoration": "none"
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            ctor: Button,
                            props: {
                                id: 'clearFilters',
                                classes: ["filter", "apply-easy"],
                                css: {
                                    "height": "1.5rem",
                                    "width": '2rem',
                                    "display": "flex",
                                    "align-items": "center",
                                    "justify-content": "center"
                                },
                                click: _self.clear,
                                components: [
                                    {
                                        ctor: Label,
                                        props: {
                                            id: 'faClear',
                                            labelType: "i",
                                            label: "",
                                            classes: ["fa", "fa-eraser"],
                                            css: {
                                                "text-decoration": "none"
                                            },
                                        }
                                    }
                                ]
                            }
                        }]
                }
            }
        ];
    };
    this.clear = function (e)
    {
        _self.rules.rules.forEach((el) =>
        {
            el.value = null;
        });
        _self.children.repeater.dataProvider.forEach((el) =>
        {
            el.value.value = null;
        });
        _self.children.repeater.rowItems.forEach((el) =>
        {
            let filter = el.repeater_container.children.mainRow.childAtIndex(0).children.valueInput;
            let valueProp = filter.valueProp;
            filter[valueProp] = null;
        });
        _filter(e);
    };

    let _filter = async function (e)
    {
        ValidationManager.getInstance().reset(_self.validationGroupUID);
        let updatedRules;
        for (let i = 0; i < _self.rules.rules.length; i++)
        {
            if (_self.rules.rules[i].value)
            {
                updatedRules = _self.rules;
                break;
            }
        }

        /* called from clear button, no need to validate filters*/
        if (!e.originalContext.id.startsWith('clearFilters'))
        {
            const valid = await _self.validate();
            if (valid == false) return;
        }

        let evt = jQuery.Event("filter");
        evt.rules = ObjectUtils.deepCopy(updatedRules);
        evt.originalEvent = e;
        _self.trigger(evt);
    };

    let _getFieldInfoByOrdinal = function (ordinal)
    {
        let t = null;
        if (ordinal <= repDp.length && ordinal > 0)
        {
            let f = repDp[ordinal - 1];
            t = {
                "field": f[_valueField],
                "operator": f.operatorItem.value,
                "value": null
            };
            if (_rules.rules)
            {
                let or = ArrayUtils.arrayHierarchyGetMatching(_initialRules.rules, "field", t.field, "rules");
                ObjectUtils.fromDefault(or, t);
            }
            if (f.operatorItem.rangeInput)
            {
                t.value = [f.value.min, f.value.max];
            } else
                t.value = f.value.value;
        }
        return t;
    };

    let _highlightUnknown = function (str, id, what, tooltip)
    {
        let ewhat = StringUtils.escapeRegExp(what);
        let regex;
        if (ewhat == what)
            regex = new RegExp('\\b' + what + '\\b');
        else
            regex = new RegExp(ewhat);
        let spantag = `<span id="${id}" data-toggle="tooltip" title="${tooltip}" data-placement="bottom" style='color:red'>${what}</span>`;
        return str.replace(regex, spantag);
    };

    let _condOperators = ["AND", "OR"];

    let _initDefaultFilters = function ()
    {
        let ret = _build(_rules);
        _expressionContainer.$el.text(ret.cond);
        repDp = _self.children.repeater.dataProvider = ret.dataProvider;
        //_expressionInput();
    };

    let _build = function (crules, i = 0)
    {
        let ret = { cond: "", dataProvider: new ArrayEx() };
        if (crules?.rules && crules.rules.length > 0)
        {
            let j = 0;
            while (j < crules.rules.length)
            {
                console.log("49 " + i)
                let iret = _build(crules.rules[j], ++i);
                if (crules.rules[j].hasOwnProperty("condition") && crules.rules[j].condition != null)
                {
                    ret.cond += " (" + iret.cond + ")";
                } else
                    ret.cond += " " + iret.cond + " " + (j < crules.rules.length - 1 ? crules.condition : "");
                ret.dataProvider.splicea(ret.dataProvider.length, 0, iret.dataProvider);
                ++j;
            }
        } else if (crules && crules.field != null)
        {
            let obj = {};
            let ind = ArrayUtils.indexOfObject(_dataProvider, "field", crules.field, 0);
            obj[_labelField] = _dataProvider[ind][_labelField];
            obj[_valueField] = _dataProvider[ind][_valueField];
            obj[_itemEditorField] = _dataProvider[ind][_itemEditorField];
            obj[_getValueField] = _dataProvider[ind][_getValueField];
            obj[_getLabelField] = _dataProvider[ind][_getLabelField];
            obj[_operatorEnabledField] = _dataProvider[ind][_operatorEnabledField];
            obj[_requiredField] = _dataProvider[ind][_requiredField] == false ? false : true;
            let dpInd = ind;
            if (Array.isArray(crules.value))
            {
                _dataProvider[dpInd].value = obj.value = { "min": crules.value[0], "max": crules.value[1] };
            } else
                _dataProvider[dpInd].value = obj.value = { "value": crules.value };
            ind = ArrayUtils.indexOfObject(_defaultOperators, "value", crules.operator, 0);
            _dataProvider[dpInd]["operatorItem"] = obj["operatorItem"] = _defaultOperators[ind];
            _dataProvider[dpInd]["filterHeading"] = obj["filterHeading"] = "";
            ret.dataProvider.splice(ret.dataProvider.length, 0, obj);
            ret.cond = i;
        }
        return ret;
    };

    let _parse = function (tokens)
    {
        let len = tokens.length;
        let cond = {
            condition: "AND",
            rules: []
        };
        let i = 0,
            bt = [];
        while (i < len)
        {
            if (tokens[i].type == "INTEGER")
            {
                let ti = _getFieldInfoByOrdinal(tokens[i].value);
                if (ti != null)
                {
                    cond.rules.splice(cond.rules.length, 0, ti);
                } else
                {
                    bt.push({
                        "token": tokens[i],
                        "msg": "Ordinal out of range"
                    });
                }
                i++;
            } else if (tokens[i].type == "IDENTIFIER")
            {
                if (_condOperators.includes(tokens[i].value))
                {
                    cond.condition = tokens[i].value;
                } else
                {
                    bt.push({
                        "token": tokens[i],
                        "msg": "Unknown identifier"
                    });
                }
                i++;
            } else if (tokens[i].type == "LEFT_PAREN")
            {
                let rpi = findRightMatchingRightParenIndex(tokens, i);
                if (rpi > -1)
                {
                    let st = tokens.slice(i + 1, rpi);
                    let rp = _parse(st);
                    bt.splicea(bt.length, 0, rp.badTokens);
                    cond.rules.splice(cond.rules.length, 0, rp.cond);
                    i = rpi + 1;
                } else
                {
                    bt.push({
                        "token": tokens[i],
                        "msg": "Right matching paren not found"
                    });
                    i += 1;
                }
            } else if (tokens[i].type == "RIGHT_PAREN")
            {
                bt.push({
                    "token": tokens[i],
                    "msg": "Unexpected right paren found"
                });
                i += 1;
            }
        }
        return {
            "cond": cond,
            "badTokens": bt
        };
    };
    let _defaultParams = {
        value: "",
        dataProvider: new ArrayEx([]),
        labelField: undefined,
        valueField: undefined,
        typeField: undefined,
        operatorsField: undefined,
        itemEditorField: "itemEditor",
        getLabelField: "getLabel",
        getValueField: "getValue",
        operatorEnabledField: "operatorEnabled",
        requiredField: "required",
        advancedMode: false,
        showOperator: false,
        clearButton: false,
        css: {
            "margin-bottom": "10px",
            "display": "flex"
        },
        type: "",
        classes: ["filter"]
    };
    ObjectUtils.fromDefault(_defaultParams, _props);
    //_props = ObjectUtils.extend(false, false, _defaultParams, _props);
    _dataProvider = Array.isArray(_props.dataProvider) ? new ArrayEx(_props.dataProvider) : _props.dataProvider;
    _valueField = _props.valueField;
    _labelField = _props.labelField;
    _operatorsField = _props.operatorsField;
    _itemEditorField = _props.itemEditorField;
    _getLabelField = _props.getLabelField;
    _getValueField = _props.getValueField;
    _operatorEnabledField = _props.operatorEnabledField;
    _requiredField = _props.requiredField;
    _advancedMode = _props.advancedMode;
    _showOperator = _props.showOperator;

    fnContainerDelayInit();
    _props.components = _cmps;

    if (!_props.attr)
    {
        _props.attr = {};
    }
    let myDtEvts = ["filter"];
    if (!ObjectUtils.isEmpty(_props.attr) && _props.attr["data-triggers"] && !ObjectUtils.isEmpty(_props.attr["data-triggers"]))
    {
        let dt = _props.attr["data-triggers"].split(" ");
        for (let i = 0; i < dt.length; i++)
        {
            myDtEvts.pushUnique(dt[i]);
        }
    }
    _props.attr["data-triggers"] = myDtEvts.join(" ");

    let r = Container.call(this, _props);
    return r;
};
EasyFilter.prototype.ctor = 'EasyFilter';
DependencyContainer.getInstance().register("EasyFilter", EasyFilter, DependencyContainer.simpleResolve);
export
{
    EasyFilter
};