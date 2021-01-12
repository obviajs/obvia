/**
 * This is a Filter Component
 *
 * Kreatx 2020
 */

//component definition
var Filter = function (_props) {
    let
        _self = this,
        _dataProvider,
        _valueField,
        _labelField,
        _autocmpDP,
        valueAutoComplete,
        repDP,
        tokens;

    /*  Object.defineProperty(this, "dataProvider", {
       get: function dataProvider() {
         return _autocmpDP;
       },
       set: function dataProvider(v) {
         if (_autocmpDP != v) {
           _autocmpDP = v;
         }
       },
       enumerable: true
     }); */

    /*  let _defaultParams = {
      
     }; */

    /*   this.endDraw = function (e) {
        if (e.target.id == this.domID) {
          if (Array.isArray(_props.dataProvider)) {
            _props.dataProvider = new ArrayEx([]);
          }
        }
      }; */


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
                            dataProvider: _autocmpDP,
                            change: function (e) {
                                valueAutoComplete = this.value;
                                if (!repDP) {
                                    repDP = this.parent.parent.children.filterMainContainer.repeater.dataProvider;
                                }
                                repDP.pushUnique(valueAutoComplete[0])
                            }
                        },
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
                                    },
                                },
                                {
                                    ctor: Container,
                                    props: {
                                        id: 'repeater_container',
                                        classes: ["filter", "repeater-container"],
                                        components: [{
                                                ctor: Label,
                                                props: {
                                                    id: 'filterItemHeading',
                                                    css: {
                                                        margin: 0
                                                    },
                                                    classes: [],
                                                    type: HeadingType.h6,
                                                    align: 'left',
                                                    label: "{?" + _labelField + "}",
                                                },
                                            },
                                            {
                                                ctor: Heading,
                                                props: {
                                                    id: 'filterItemHeading',
                                                    css: {
                                                        fontSize: '16px',
                                                        color: '#1a73e8',
                                                        margin: 0
                                                    },
                                                    align: 'left',
                                                    label: "test",
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        ctor: Container,
                        props: {
                            id: 'logicContainer',
                            classes: ["filter", "logic-container"],
                            contenteditable: true,
                            input: function (e) {
                                let hi = e.keyCode == 13;
                                console.log('hi')
                            }
                        }
                    }
                ],
            },
        }];
    };

    var _getFieldInfoByOrdinal = function (ordinal) {
        return {
            "field": "price",
            "operator": "less",
            "value": ordinal
        };
    };

    var _parse = function (tokens) {
        let len = tokens.length;
        let cond = {
            condition: "",
            rules: []
        };
        let i = 0;
        while (i < len) {
            if (tokens[i].type == "INTEGER") {
                var ti = _getFieldInfoByOrdinal(tokens[i].value);
                cond.rules.splice(cond.rules.length, 0, ti);
                i++;
            } else if (tokens[i].type == "IDENTIFIER") {
                cond.condition = tokens[i].value;
                i++;
            } else if (tokens[i].type == "LEFT_PAREN") {
                let rpi = findRightMatchingRightParenIndex(tokens, i);
                let st = tokens.slice(i + 1, rpi);
                cond.rules.splice(cond.rules.length, 0, _parse(st));
                i = rpi + 1;
            }
        }
        return cond;
    };

    var _defaultParams = {
        value: "",
        dataProvider: [],
        labelField: undefined,
        valueField: undefined,
        typeField: undefined
    };

    _props = extend(false, false, _defaultParams, _props);
    _autocmpDP = _props.dataProvider;
    _valueField = _props.valueField;
    _labelField = _props.labelField;

    fnContainerDelayInit();
    _props.components = _cmps;

    let r = Container.call(this, _props);
    return r;
};
Filter.prototype.ctor = 'Filter';