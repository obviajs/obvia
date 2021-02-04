/**
 * This is a Filter Component
 *
 * Kreatx 2020
 */

//component definition
var Filter = function (_props) {
    let
        _self = this,
        _valueField,
        _labelField,
        _operatorsField,
        _itemEditorField,
        _dataProvider,
        valueAutoComplete,
        repDp,
        _tokens,
        _expression,
        _expressionContainer,
        _rules,
        _valid = true,
        _defaultOperators = new ArrayEx([{
                value: "equal",
                label: "equals",
                friendly: "equals to {value}",
                inputVisible: true,
                rangeInput: false
            },
            {
                value: "not_equal",
                label: "is not equal",
                friendly: "is not equal to {value}",
                inputVisible: true,
                rangeInput: false
            },
            {
                value: "in",
                label: "in",
                friendly: "in ({value})",
                inputVisible: true,
                rangeInput: false
            },
            {
                value: "not_in",
                label: "not in",
                friendly: "not in ({value})",
                inputVisible: true,
                rangeInput: false
            },
            {
                value: "less",
                label: "is less than",
                friendly: "is less than {value}",
                inputVisible: true,
                rangeInput: false
            },
            {
                value: "less_or_equal",
                label: "is less or equal than",
                friendly: "is less or equal than {value}",
                inputVisible: true,
                rangeInput: false
            },
            {
                value: "greater",
                label: "is greater than",
                friendly: "is greater than {value}",
                inputVisible: true,
                rangeInput: false
            },
            {
                value: "greater_or_equal",
                label: "is greater or equal than",
                friendly: "is greater or equal than {value}",
                inputVisible: true,
                rangeInput: false
            },
            {
                value: "between",
                label: "is between",
                friendly: "is between {min} and {max}",
                inputVisible: true,
                rangeInput: true
            },
            {
                value: "not_between",
                label: "is not between",
                friendly: "is not between {min} and {max}",
                inputVisible: true,
                rangeInput: true
            },
            {
                value: "is_null",
                label: "is null",
                friendly: "is null",
                inputVisible: false,
                rangeInput: false
            },
            {
                value: "is_not_null",
                label: "is not null",
                friendly: "is not null",
                inputVisible: false,
                rangeInput: false
            }
        ]),
        _operatorsDp = _defaultOperators;

    /*  Object.defineProperty(this, "dataProvider", {
       get: function dataProvider() {
         return _dataProvider;
       },
       set: function dataProvider(v) {
         if (_dataProvider != v) {
           _dataProvider = v;
         }
       },
       enumerable: true
     }); */

    Object.defineProperty(this, "rules", {
        get: function rules() {
            return _rules;
        },
        set: function rules(v) {
            if (_rules != v) {
                _rules = v;
            }
        },
        enumerable: true
    });

    this.endDraw = function (e) {
        if (e.target.id == this.domID) {
            _expressionContainer = this.filterMainContainer.expressionContainer;
        }
    };

    let _updateTokens = function () {
        let cp = getCaretPosition(_expressionContainer.$el[0]);
        _tokens = tokenize(_expression).all();
        let pr = _parse(_tokens);
        _rules = pr.cond;
        let len = pr.badTokens.length;
        if (len > 0) {

            for (let i = 0; i < len; i++) {
                let id = _self.domID + "_span_" + i;
                _expression = _highlightUnknown(_expression, id, pr.badTokens[i].token.value, pr.badTokens[i].msg);
            }
            _expressionContainer.$el.html(_expression);
            for (let i = 0; i < len; i++) {
                let id = "#" + _self.domID + "_span_" + i;
                $(id).tooltip({
                    trigger: 'hover'
                });
            }
        } else {
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
    let _expressionInput = function (e) {
        _expression = _expressionContainer.$el.text().toUpperCase();
        _updateTokens();
    };

    let _update = function () {
        let len = repDp.length;
        let a = [];
        for (let i = 1; i <= len; i++) {
            a.push(i);
        }
        _expression = a.join(" AND ");
        _expressionContainer.$el.html(_expression);
        _updateTokens();
    };

    let _removeFilterItem = function (e, ra) {
        repDp.splice(ra.currentIndex, 1);
        _update();
    };

    let _addFilterItem = function (e) {
        valueAutoComplete = e.newValue;
        if (!repDp) {
            repDp = this.parent.parent.children.filterMainContainer.repeater.dataProvider;
        }
        let i = deepCopy(valueAutoComplete[0]);
        delete i.guid;
        repDp.push(i);
        e.preventDefault();
        this.proxyMaybe.tokenContainer.tokenInput.value = "";
    };

    let _editFilter = function (e, ra) {
        let filterItemEditor = ra.currentItem[_itemEditorField];
        let isRangeInput;
        if (ra.currentRow.repeater_container.filterEditorContainer.headerRow.mainCol.fOperator.operator.selectedItem)
            isRangeInput = ra.currentRow.repeater_container.filterEditorContainer.headerRow.mainCol.fOperator.operator.selectedItem.rangeInput;
        if (isRangeInput) {
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
                    "classes": ["form-row"],
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
                                            "validationGroup": _props.guid,
                                            "enabled": "{currentItem.deleted == null || currentItem.deleted == false}",
                                            "visible": false
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
                                            "validationGroup": _props.guid,
                                            "enabled": "{currentItem.deleted == null || currentItem.deleted == false}",
                                            "visible": false
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            };
        } else {
            filterItemEditor.props.id = "valueInput";
            filterItemEditor = {
                "ctor": "Container",
                "props": {
                    "type": "",
                    "classes": [],
                    "components": [
                        filterItemEditor,
                        {
                            "ctor": "RequiredFieldValidator",
                            "props": {
                                "id": "valueValidator",
                                "controlToValidate": "valueInput",
                                "errorMessage": "Please enter a value.",
                                "validationGroup": _props.guid,
                                "visible": false
                            }
                        }
                    ]
                }
            };
        }


        filterItemEditor = Component.fromLiteral(filterItemEditor);
        let reqFieldValidator;
        if (ra.currentItem[_operatorsField]) {
            _operatorsDp.splicea(0, _operatorsDp.length, ra.currentItem[_operatorsField]);
        } else {
            _operatorsDp.splicea(0, _operatorsDp.length, _defaultOperators);
        }
        ra.currentRow.repeater_container.filterItemHeading.hide();
        ra.currentRow.repeater_container.filterEditorContainer.headerRow.mainCol.fOperator.label = ra.currentItem[_labelField];
        let oldInput = ra.currentRow.repeater_container.filterEditorContainer.mainRow.mainCol.fItemEditor.input;
        if (oldInput) {
            if (oldInput.valueValidator)
                oldInput.valueValidator.destruct();
            else {
                oldInput.colMax.maxValueValidator.destruct();
                oldInput.colMin.minValueValidator.destruct();
            }
        }
        ra.currentRow.repeater_container.filterEditorContainer.mainRow.mainCol.fItemEditor.input = filterItemEditor;
        filterItemEditor.render().then(() => {
            if (isRangeInput) {
                filterItemEditor.colMin.minInput.on("change", _filerValueChange);
                filterItemEditor.colMax.maxInput.on("change", _filerValueChange);
                if (ra.currentItem.value) {
                    if (filterItemEditor.colMin.minInput.valueProp) {
                        filterItemEditor.colMin.minInput[filterItemEditor.colMin.minInput.valueProp] = ra.currentItem.value.min;
                        filterItemEditor.colMax.maxInput[filterItemEditor.colMax.maxInput.valueProp] = ra.currentItem.value.max;
                    } else {
                        filterItemEditor.colMin.minInput.value = ra.currentItem.value.min;
                        filterItemEditor.colMax.maxInput.value = ra.currentItem.value.max;
                    }
                }
            } else {
                filterItemEditor.valueInput.on("change", _filerValueChange);
                if (ra.currentItem.value) {
                    if (filterItemEditor.valueInput.valueProp) {
                        filterItemEditor.valueInput[filterItemEditor.valueInput.valueProp] = ra.currentItem.value.value;
                    } else {
                        filterItemEditor.valueInput.value = ra.currentItem.value.value;
                    }
                }
            }
            ra.currentRow.filterActionLabel.faRemove.visible = false;
            ra.currentRow.filterActionLabel.faAccept.visible = true;
            ra.currentRow.repeater_container.filterEditorContainer.show();
        });
    };

    let _getValue = function (ra) {
        let input = ra.currentRow.repeater_container.filterEditorContainer.mainRow.mainCol.fItemEditor.input;
        let isRangeInput;
        if (ra.currentRow.repeater_container.filterEditorContainer.headerRow.mainCol.fOperator.operator.selectedItem)
            isRangeInput = ra.currentRow.repeater_container.filterEditorContainer.headerRow.mainCol.fOperator.operator.selectedItem.rangeInput;
        let value = {};
        if (isRangeInput) {
            value.min = input.colMin.minInput.valueProp ? input.colMin.minInput[input.colMin.minInput.valueProp] : input.colMin.minInput.value;
            value.max = input.colMax.maxInput.valueProp ? input.colMax.maxInput[input.colMax.maxInput.valueProp] : input.colMax.maxInput.value;
        } else
            value.value = input.valueInput.valueProp ? input[input.valueInput.valueProp] : input.valueInput.value;
        return value;
    };

    let _filerValueChange = function (e, ra) {
        ra.currentItem.value = _getValue(ra);
    };

    let _operatorChange = function (e, ra) {
        ra.currentItem.operator = this.selectedItem;
        _editFilter(e, ra);
    };

    this.validate = function () {
        return ValidationManager.getInstance().validate(_props.guid).then((result) => {
            let len = result.length;
            _valid = true;
            for (let i = 0; i < len; i++) {
                if (!result[i]) {
                    _valid = false;
                    break;
                }
            }
            return _valid;
        });
    };

    let _acceptFilterItem = function (e, ra) {
        _self.validate().then((valid) => {
            if (valid) {
                ra.currentItem.value = _getValue(ra);
                let operator = ra.currentItem.operator;
                let label = operator.friendly.formatUnicorn(ra.currentItem.value);

                ra.currentRow.repeater_container.filterItemHeading.label = label;

                ra.currentRow.filterActionLabel.faRemove.visible = true;
                ra.currentRow.filterActionLabel.faAccept.visible = false;
                ra.currentRow.repeater_container.filterEditorContainer.hide();
                ra.currentRow.repeater_container.filterItemHeading.show();
                _update();
            }
        });
    };

    let _cmps;

    let fnContainerDelayInit = function () {

        _cmps = [{
            ctor: Container,
            props: {
                id: 'filterMainContainer',
                classes: ["filter", "main-container"],
                type: ContainerType.NONE,
                components: [{
                        ctor: AutoCompleteEx,
                        props: {
                            classes: ["filter", "main_autocomplete"],
                            id: 'filterAutocomplete',
                            fieldName: 'autocomplete',
                            multiSelect: false,
                            valueField: _valueField,
                            labelField: _labelField,
                            maxSuggestionsCount: 1,
                            dataProvider: _dataProvider,
                            beforeChange: _addFilterItem
                        }
                    },
                    {
                        ctor: Repeater,
                        props: {
                            id: 'repeater',
                            dataProvider: new ArrayEx([]),
                            rendering: {
                                direction: 'vertical',
                                wrap: true,
                            },
                            classes: ["filter", "repeater"],
                            components: [{
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
                                    ctor: Container,
                                    props: {
                                        id: 'repeater_container',
                                        classes: ["filter", "repeater-container"],
                                        type: "",
                                        width: "100%",
                                        components: [{
                                                ctor: Label,
                                                props: {
                                                    id: 'fieldItemHeading',
                                                    css: {
                                                        margin: 0
                                                    },
                                                    classes: [],
                                                    type: HeadingType.h6,
                                                    align: 'left',
                                                    label: "{?" + _labelField + "}",
                                                }
                                            },
                                            {
                                                ctor: Heading,
                                                props: {
                                                    id: 'filterItemHeading',
                                                    classes: ["item-heading"],
                                                    align: 'left',
                                                    label: "Click to edit filter",
                                                    click: _editFilter
                                                }
                                            },
                                            {
                                                ctor: Container,
                                                props: {
                                                    id: 'filterEditorContainer',
                                                    visible: false,
                                                    components: [{
                                                            ctor: Container,
                                                            props: {
                                                                id: 'headerRow',
                                                                classes: ["form-row"],
                                                                type: "",
                                                                components: [{
                                                                    ctor: Container,
                                                                    props: {
                                                                        id: 'mainCol',
                                                                        classes: ["col"],
                                                                        type: "",
                                                                        components: [{
                                                                                "ctor": "FormField",
                                                                                "props": {
                                                                                    "name": "operator",
                                                                                    "id": "fOperator",
                                                                                    "size": "form-control-sm",
                                                                                    "component": {
                                                                                        "ctor": "DropDown",
                                                                                        "props": {
                                                                                            "id": "operator",
                                                                                            "labelField": "label",
                                                                                            "valueField": "value",
                                                                                            "dataProvider": _operatorsDp,
                                                                                            //"selectedItem": "{?operator}",
                                                                                            "change": _operatorChange
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            {
                                                                                "ctor": "RequiredFieldValidator",
                                                                                "props": {
                                                                                    "id": "operatorValidator",
                                                                                    "controlToValidate": "{currentRow.repeater_container.filterEditorContainer.headerRow.mainCol.fOperator.operator.id}",
                                                                                    "errorMessage": "Please select a value for the operator.",
                                                                                    "validationGroup": _props.guid,
                                                                                    "enabled": "{currentItem.deleted == null || currentItem.deleted == false}",
                                                                                    "visible": false
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }]
                                                            }
                                                        },
                                                        {
                                                            ctor: Container,
                                                            props: {
                                                                id: 'mainRow',
                                                                classes: ["form-row"],
                                                                type: "",
                                                                components: [{
                                                                    ctor: Container,
                                                                    props: {
                                                                        type: "",
                                                                        id: 'mainCol',
                                                                        classes: ["col"],
                                                                        components: [{
                                                                            "ctor": "FormField",
                                                                            "props": {
                                                                                "label": "Value",
                                                                                "id": "fItemEditor",
                                                                                "size": "form-control-sm",
                                                                                "visible": "{?currentRow.repeater_container.filterEditorContainer.headerRow.mainCol.fOperator.operator.selectedItem.inputVisible}"
                                                                            }
                                                                        }]
                                                                    }
                                                                }]
                                                            }
                                                        },
                                                        {
                                                            ctor: Container,
                                                            props: {
                                                                id: 'footerRow',
                                                                classes: ["form-row"],
                                                                type: "",
                                                                components: [{
                                                                    ctor: Container,
                                                                    props: {
                                                                        classes: ["col"],
                                                                        type: "",
                                                                        components: []
                                                                    }
                                                                }]
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    ctor: Label,
                                    props: {
                                        id: 'filterActionLabel',
                                        css: {
                                            margin: 0,
                                        },
                                        classes: ["filter", "close"],
                                        components: [{
                                                ctor: Link,
                                                props: {
                                                    id: 'faRemove',
                                                    label: "",
                                                    href: "#",
                                                    target: "",
                                                    classes: ["fas", "fa-times"],
                                                    css: {
                                                        "text-decoration": "none"
                                                    },
                                                    click: _removeFilterItem
                                                }
                                            },
                                            {
                                                ctor: Link,
                                                props: {
                                                    id: 'faAccept',
                                                    label: "",
                                                    href: "#",
                                                    target: "",
                                                    visible: false,
                                                    classes: ["fas", "fa-check"],
                                                    css: {
                                                        "text-decoration": "none"
                                                    },
                                                    click: _acceptFilterItem
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        ctor: Container,
                        props: {
                            id: 'expressionContainer',
                            classes: ["filter", "expression-container"],
                            contenteditable: true,
                            input: _expressionInput
                        }
                    }
                ]
            }
        }];
    };

    var _getFieldInfoByOrdinal = function (ordinal) {
        let t = null;
        if (ordinal <= repDp.length && ordinal > 0) {
            let f = repDp[ordinal - 1];
            t = {
                "field": f[_valueField],
                "operator": f.operator.value,
                "value": null
            };
            if (f.operator.rangeInput) {
                t.value = [f.value.min, f.value.max];
            } else
                t.value = f.value.value;
        }
        return t;
    };

    let _highlightUnknown = function (str, id, what, tooltip) {
        let ewhat = escapeRegExp(what);
        let regex;
        if (ewhat == what)
            regex = new RegExp('\\b' + what + '\\b');
        else
            regex = new RegExp(ewhat);
        let spantag = `<span id="${id}" data-toggle="tooltip" title="${tooltip}" data-placement="bottom" style='color:red'>${what}</span>`;
        return str.replace(regex, spantag);
    };

    let _condOperators = ["AND", "OR"];

    let _parse = function (tokens) {
        let len = tokens.length;
        let cond = {
            condition: "AND",
            rules: []
        };
        let i = 0,
            bt = [];
        while (i < len) {
            if (tokens[i].type == "INTEGER") {
                var ti = _getFieldInfoByOrdinal(tokens[i].value);
                if (ti != null) {
                    cond.rules.splice(cond.rules.length, 0, ti);
                } else {
                    bt.push({
                        "token": tokens[i],
                        "msg": "Ordinal out of range"
                    });
                }
                i++;
            } else if (tokens[i].type == "IDENTIFIER") {
                if (_condOperators.includes(tokens[i].value)) {
                    cond.condition = tokens[i].value;
                } else {
                    bt.push({
                        "token": tokens[i],
                        "msg": "Unknown identifier"
                    });
                }
                i++;
            } else if (tokens[i].type == "LEFT_PAREN") {
                let rpi = findRightMatchingRightParenIndex(tokens, i);
                if (rpi > -1) {
                    let st = tokens.slice(i + 1, rpi);
                    let rp = _parse(st);
                    bt.splicea(bt.length, 0, rp.badTokens);
                    cond.rules.splice(cond.rules.length, 0, rp.cond);
                    i = rpi + 1;
                } else {
                    bt.push({
                        "token": tokens[i],
                        "msg": "Right matching paren not found"
                    });
                    i += 1;
                }
            } else if (tokens[i].type == "RIGHT_PAREN") {
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
    let = {};
    var _defaultParams = {
        value: "",
        dataProvider: new ArrayEx([]),
        labelField: undefined,
        valueField: undefined,
        typeField: undefined,
        operatorsField: undefined,
        itemEditorField: undefined,
        guid: StringUtils.guid()
    };

    _props = extend(false, false, _defaultParams, _props);
    _dataProvider = Array.isArray(_props.dataProvider) ? new ArrayEx(_props.dataProvider) : _props.dataProvider;
    _valueField = _props.valueField;
    _labelField = _props.labelField;
    _operatorsField = _props.operatorsField;
    _itemEditorField = _props.itemEditorField;

    fnContainerDelayInit();
    _props.components = _cmps;

    let r = Container.call(this, _props);
    return r;
};
Filter.prototype.ctor = 'Filter';