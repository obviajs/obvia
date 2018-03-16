/*
 |------------------------------------------------------------
 |  @copyright Kreatx
 |  
 |  The JS objects below are responsible for rendering the FORM LOGIC Section
 |  There are three seperate files responsible for form-logic:
 |  1. form-logic.js responsible for logic inside a single form,
 |  2. forms-logic.php which is a more advanced case because includes logic between processes,
 |  3. validate-form-logic.js which validates conitions in real time at case edit]
 |
 |  Read all the documentation below before adding a new feature or modifying an existing one
 | 
 |------------------------------------------------------------
 |  CONFIG
 |  This section is used for various configuration of other libraries [toaster, queryBuilder, ...]
 |------------------------------------------------------------
 */
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "800",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

var forbiddenFilterFields = [
    'password',
    'phone',
    'img',
    'ccnumber',
    'autocomplete',
    'label',
    'newline',
    'colspan',
    'repeater'
];

/*
 |------------------------------------------------------------
 |  SYNC
 |  The Sync object is used to keep track of conditionBuilder blocks
 |  It increments by one on a single block add action
 |-----------------------------------------------------------
 */
var Sync = {
    conditionBuilderCounter: 0
};

/*
 |---------------------------------------------------------
 |  GUI
 |  An object used for caching jQuery dom selectors
 |----------------------------------------------------------
 */    
var GUI = {
    btns:{
        addLogic: $('#add-logic-btn'),
        saveLogic: $('#save-logic-btn'),
        spinner: $('#add-logic-spinner')
    },
    sections:{
        conditionBuilder: $('#conditon-builder-section'),
        main: $('#form-logic')
    },
    modals:{

    }
};

/*
 |---------------------------------------------------------
 |  AJAX
 |
 |  Responsible for handling AJAX calls to server to get saved blocks
 |  and filters/fields
 |  The pattern uses promises (jQuery implemetnation as well as native JS Promises)
 |  Promises help making asynchronius calls more managable in a synchronius style of programing
 |  See,
 |  jQuery: https://api.jquery.com/jquery.when/
 |  Vanilla Promise: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 |----------------------------------------------------------
 */
var AJAX = {
    getFields: function(id){
        return $.ajax({
            url: '?forms/getFormFields/' + id,
            method: 'post',
            data: {directive: 'no-label'},
            dataType: 'json'
        });
    },

    getSavedBlocks: function (id) {
        return $.ajax({
            url: '?forms/getLogicBlocks/' + id,
            dataType: 'json'
        });
    }
};

/*
 |---------------------------------------------------------
 |  DOM MANIPULATION
 |  The Factory Object handles GUI generation upon events: add block, remove block, ...
 |----------------------------------------------------------
 */
var Factory = {
    //filter fields are stored here
    fields: [],

    /** 
     * finds stored(saved) blocks from previous sessions and renders them
     */
    renderExistingBlocks: function () {
        $.when(
            AJAX.getSavedBlocks($("#id_form").val())
        ).done(function (blocks) { 
            blocks.forEach(function (block, index) {
                Factory.renderConditionBuilder(GUI.sections.conditionBuilder, block, index + 1);
            });    
        })
    },

    /**
     * init/sets the conditions and actions upon rendering an existing block
     * @param {object} block is the saved block received from the ajax call
     * @param {number} index is the block #id/order/counter 1,2 ...
     */
    initExistingBlock: function (block, index) {
        $('#builder-' + index).queryBuilder('setRules', JSON.parse(block.condition));

        var actions = JSON.parse(block.actions);
        for (var i = 0; i < actions.length; i++){
            if (i == 0) {
                $("#action-select-" + index + "-1").val(actions[i].logic.operation);
                $("#field-select-" + index + "-1").select2("val", actions[i].logic.field);
            } else {
                Factory.repeatAction(index, i, actions[i].logic.operation, actions[i].logic.field);
            }
        }
    },

    /**
     * Generates the HTML for a specific form-logic block
     * @param {jQuery selector} container where the html is appended
     * @param {object} block case we are rendering an existing stored block, we pass an object with block data
     * @param {number} blockIndex is the block #id/order/counter 1,2 ...
     */
    renderConditionBuilder: function (container, block, blockIndex, plugins = ['sortable', 'hrc']){
        Sync.conditionBuilderCounter += 1;
        var index = Sync.conditionBuilderCounter;
        var actionCounter = 1;

        $.when(
            AJAX.getFields($("#id_form").val())
        ).done(function(fields){
            Factory.fields = fields;
            var fieldsOptions = '';
            fields.forEach(function(item){
                fieldsOptions +=
                    '<option value="'+item.id+'" data-component="'+item.type+'" data-component-id="'+item.form_field_id+'">' +
                        item.label +
                    '</option>';
            });

            var html =
                '<div id="builder-container-'+index+'" class="row panel panel-white" style="margin-bottom: 20px">' +
                '<div class="col-lg-12" style="padding:0; padding-bottom: 10px; padding-left: 4px; padding-right: 4px">' +
                        '<a href="javascript:void(0)" title="Remove" onclick="Factory.removeConditionBuilder('+index+')" id="remove-builder-'+index+'">' +
                            '<i class="fa fa-times pull-right" aria-hidden="true" style="color:red; padding: 3px"></i>' +
                        '</a>' +
                        '<div style="cursor: pointer;">' +
                            '<i id="codePreview-builder-' + index + '" data-toggle="popover" onclick="Factory.codePreview(' + index + ')" class="fa fa-code pull-right" aria-hidden="true" style="color:red; padding: 3px"></i>' +
                        '</div>' +
                        '<a href= "javascript:void(0)" title="Duplicate" onclick= "Factory.duplicateConditionBuilder(' + index + ')" id= "duplicate-builder-' + index + '" > ' +
                            '<i class="fa fa-files-o pull-right" aria-hidden="true" style="color:red; padding: 3px"></i>' +
                        '</a><br>' +
                    '<span class="lead" style="padding-bottom: 5px; padding-right: 60px; padding-left: 20px; background: white; border-radius: 1px">If</span>' +
                    '<div id="builder-'+index+'"></div><i class="fa fa-arrow-down" aria-hidden="true"></i>' +

                    '<div class="row action-area-'+index+'">' +
                        '<div class="col-lg-12" id="action-area-'+index+'-1" style="margin-bottom: 10px; padding: 0;">' +
                        '<div class="col-lg-2">' +
                            '<select id="action-select-'+index+'-1" class="form-control">' +
                                '<option value="show">Show</option>' +
                                '<option value="scrollTo">Scroll To</option>' +
                                '<option value="hide">Hide</option>' +
                                '<option value="enable">Enable</option>' +
                                '<option value="disable">Disable</option>' +
                            '</select>' +
                        '</div>'+
                        '<div class="col-lg-9">' +
                            '<select id="field-select-'+index+'-'+actionCounter+'">' +
                               fieldsOptions +
                            '</select>' +
                        '</div>'+
                        '<div class="col-lg-1">' +
                            '<a href="javascript:void(0)" id="action-area-add-'+index+'-1" onclick="Factory.repeatAction('+index+', '+actionCounter+')"><i class="fa fa-plus" aria-hidden="true"></i></a>' +
                        '</div>' +
                        '</div>' +
                    '</div>'+

                    '</div>' +

                '</div>'
            ;

            container.append(html);
            Factory.initConditionBuilder(index, fields, actionCounter, block, blockIndex, plugins);
            State.pushNode(index, block);
        });
    },

    /**
     * init/sets the conditions and actions upon rendering a block
     * @param {number} index is the block #id/order/counter 1,2 ... as stored in Sync object
     * @param {array} fields are the fileds that should be used for queryBuilder Init
     * @param {number} counter the action #id/index
     * @param {object} block case we are rendering an existing stored block, we pass an object with block data
     * @param {number} blockIndex is the block #id/order/counter 1,2 ... coupled with block object
     */
    initConditionBuilder: function(index, fields, counter, block, blockIndex, plugins){
        var filters = [];
        $('#builder-'+index).queryBuilder("destroy");

        fields.forEach(function (field) {
            if (forbiddenFilterFields.indexOf(field.type) != -1) {
                return false;    
            }

            var filter = {};
            filter.id = field.id;
            filter.field = field.label;
            switch(field.type){
                case "datetime":
                    filter.type = 'date';
                    filter.validation = {
                        format: 'dd/mm/yyyy'
                    };
                    filter.plugin = 'datepicker';
                    filter.plugin_config = {
                        format: 'dd/mm/yyyy',
                        todayBtn: 'linked',
                        todayHighlight: true,
                        autoclose: true
                    };
                    filter.data = { component_id: field.form_field_id, component: "datetime" };
                    filter.operators= ["equal", "not_equal", "less", "less_or_equal", "greater","greater_or_equal", "is_null",
                        "is_not_null", "between", "not_between", "is_empty", "is_not_empty"];
                    break;
                case "day_month_year":
                    filter.type = 'date';
                    filter.validation = {
                        format: 'yyyy-mm-dd'
                    };
                    filter.plugin = 'datepicker';
                    filter.plugin_config = {
                        format: 'yyyy-mm-dd',
                        todayBtn: 'linked',
                        todayHighlight: true,
                        autoclose: true
                    };
                    filter.data = { component_id: field.form_field_id, component: "day_month_year" };
                    filter.operators = ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "is_null",
                        "is_not_null", "between", "not_between", "is_empty", "is_not_empty"];
                    break;
                case "day_month_year_hour_min":
                    filter.type = 'date';
                    filter.plugin = 'datepicker';
                    filter.plugin_config = {
                        format: {
                            toDisplay: function (date, format, language) {
                                var dateTime = new Date(date);
                                return moment(dateTime).format("YYYY-MM-DD HH:mm");
                            },
                            toValue: function (date, format, language) {
                                console.log('here');
                                var dateTime = new Date(date);
                                return moment(dateTime).format("YYYY-MM-DD HH:mm");
                            }
                        },
                        todayBtn: 'linked',
                        todayHighlight: true,
                        autoclose: true,
                        forceParse: false
                        
                    };
                    filter.data = { component_id: field.form_field_id, component: "day_month_year_hour_min" };
                    filter.operators = ["equal", "not_equal", "less", "less_or_equal", "greater", "greater_or_equal", "is_null",
                        "is_not_null", "between", "not_between", "is_empty", "is_not_empty"];
                    break;
                case "checkbox":
                    filter.type = "string";
                    filter.input = "radio";
                    filter.values = [field.extradata1, field.extradata2];
                    filter.valueGetter = function (rule) {
                        if (rule.$el.find('input[type=radio]')[0].checked) {
                            return "true";
                        } else {
                            return "false";
                        }

                    };
                    filter.valueSetter = function (rule, value) {
                        if (value == "true") {
                            rule.$el.find('input[type=radio]')[0].checked = true;
                        } else {
                            rule.$el.find('input[type=radio]')[1].checked = true;
                        }
                    };
                    filter.data = { component_id: field.form_field_id, component: "checkbox" };
                    filter.operators = ["equal", "not_equal"];
                    break;
                case "trippleswitch":   
                    filter.type = "string";
                    filter.input = "select";
                    filter.values = { 'on': field.extradata1, 'null': 'x (null)', 'off': field.extradata2 };
                    filter.data = { component_id: field.form_field_id, component: "trippleswitch" };
                    filter.operators = ["equal", "not_equal"];
                    break;
                case "combobox":
                    //filter.id = field.id; //id ne tabelen e combobox
                    filter.type="string";
                    filter.input = "select";
                    filter.values = field.combo_values;
                    filter.data = { component_id: field.form_field_id, component: "combobox" };
                    filter.operators= ["equal", "not_equal"];
                    break;
                case "number":
                    var validate = {
                        min: field.extradata1,
                        max: field.extradata2
                    }
                    filter.type="double";
                    filter.input = "text";
                    filter.validation = validate;
                    filter.data = { component_id: field.form_field_id, component: "number" };
                    filter.operators= ["equal", "not_equal", "less", "less_or_equal", "greater","greater_or_equal", "between", "not_between", "is_null", "is_not_null"];
                    break;
                case "upload":
                    filter.type = "string";
                    filter.input = "text";
                    filter.data = {component_id: field.form_field_id, component: "upload"};
                    filter.operators = ["is_empty", "is_not_empty"];
                    break;
                case "radiogroup":
                    filter.type = "string";
                    filter.input = "select";
                    filter.values = field.radio_values;
                    filter.data = { component_id: field.form_field_id, component: "radiogroup"};
                    filter.operators = ["equal", "not_equal"];
                    break;
                case "checkboxgroup":
                    filter.type = "string";
                    filter.input = "select";
                    filter.values = field.checkbox_values;
                    filter.data = { component_id: field.form_field_id, component: "checkboxgroup" };
                    filter.operators = ["contains", "not_contains"];
                    break;
                default:
                    filter.type = "string";
                    filter.input = "text";
                    filter.data = {};
                    filter.operators= ["equal", "not_equal", "contains", "not_contains", "is_empty", "is_not_empty", "ends_with",
                        "not_ends_with", "begins_with", "not_begins_with", "is_null", "is_not_null"];
            }
            
            filters.push(filter);
        });

        $('#builder-' + index).queryBuilder({
            plugins: plugins,
            filters: filters,
            lang_code: 'en'
        });

        //event listener
        if(!block)
            $('#builder-' + index).on('afterUpdateRuleFilter.queryBuilder', function (e, rule) {
               //afterRuleUpdate event goes here
            });

        $("#field-select-" + index + "-" + counter).select2();

        if (block != null) {
            Factory.initExistingBlock(block, blockIndex);
        }

    },

    /**
     * Destroys and removes html of a block with given index/id
     * @param {number} index is the block #id/order/counter 1,2 ... as stored in Sync object
     */
    removeConditionBuilder: function(index){
        $('#builder-'+index).queryBuilder("destroy");
        $('#builder-container-'+index).remove();
        Sync.conditionBuilderCounter -= 1;
        State.removeNode(index);
    },

    /**
     * Function called at action add event that adds the need HTML to display a new action in the block
     * @param {number} index is the block #id/order/counter 1,2 ... as stored in Sync object
     * @param {number} counter the action #id/index
     * @param {string} selectedOperation we pass the operation type value to be pre-selected case we need it
     * @param {string} selectedValue we pass the field value to be pre-selected case we need it
     */
    repeatAction: function(index, counter, selectedOperation, selectedValue){
        counter += 1;
        var fieldsOptions = '';
        Factory.fields.forEach(function(item){
            fieldsOptions +=
            '<option value="' + item.id + '" data-component="' + item.type + '" data-component-id="' + item.form_field_id + '">' +
                item.label +
            '</option>';
        });

        $('.action-area-'+index).append(
            '<div class="col-lg-12" id="action-area-'+index+'-'+counter+'" style="margin-bottom: 10px; padding: 0;">' +
            '<div class="col-lg-2">' +
            '<select id="action-select-'+index+'-'+counter+'" class="form-control">' +
            '<option value="show">Show</option>' +
            '<option value="scrollTo">ScrollTo </option>' +
            '<option value="hide">Hide</option>' +
            '<option value="enable">Enable</option>' +
            '<option value="disable">Disable</option>' +
            '</select>' +
            '</div>'+
            '<div class="col-lg-9">' +
            '<select id="field-select-'+index+'-'+counter+'">' +
                fieldsOptions +
            '</select>' +
            '</div>'+
            '<div class="col-lg-1">' +
            '<a href="javascript:void(0)" id="action-area-add-'+index+'-'+counter+'" onclick="Factory.repeatAction('+index+', '+counter+')"><i class="fa fa-plus" aria-hidden="true"></i></a> ' +
            '<a href="javascript:void(0)" id="action-area-remove-'+index+'-'+counter+'" onclick="Factory.removeAction('+index+', '+counter+')"><i class="fa fa-times" aria-hidden="true"></i></a>' +
            '</div>' +
            '</div>'
        );

        $("#field-select-" + index + "-" + counter).select2();
        if (selectedValue) 
            $("#field-select-" + index + "-" + counter).select2("val", selectedValue);
            
        if (selectedOperation)
            $("#action-select-" + index + "-" + counter).val(selectedOperation);

        var reducer = counter - 1;
        $("#action-area-add-"+index+"-"+reducer).hide();
        $("#action-area-remove-" + index + "-" + reducer).hide();
        
        State.pushAction(index, counter);
    },
    
    /**
     * Function called at action remove event that removes the HTML of a specific actions and destroys it
     * @param {number} index is the block #id/order/counter 1,2 ... as stored in Sync object
     * @param {number} counter the action #id/index
     */
    removeAction: function (index, counter) {
        var reducer = counter - 1;
        $('#action-area-'+index+'-'+counter).remove();
        $("#action-area-add-"+index+"-"+reducer).show();
        $("#action-area-remove-" + index + "-" + reducer).show();
        State.removeAction(index, counter);
    },

    /**
     * Function called at block code preview actions that displays a bootstrap popover with validated block js code
     * @param {number} index is the block #id/order/counter 1,2 ... as stored in Sync object
     */
    codePreview: function (index) {
        var nodes = State.update();
        var code = '';
        for (var i in nodes) {
            if (typeof nodes[i] == 'function')
                continue;    
            if (nodes[i].id == index) {
                code = Validator.evaluate(nodes[i].condition, nodes[i].actions);
            }
        }

        $('#codePreview-builder-' + index).popover('destroy');
        setTimeout(function () { 
            $('#codePreview-builder-' + index).popover({
                content: "<code>" + code + "</code>",
                html: true,
                placement: 'bottom',
                trigger: 'manual',
                title: "<h5>Code Preview <button type='button' class='close' onclick='Factory.hidePopover(" + index + ")' aria-hidden='true'><i class='glyphicon glyphicon-remove'></i></button></h5>"
            });
            $('#codePreview-builder-' + index).popover('show');
        }, 300);
       
    },

    /**
     * Function called at block code preview close event that hides the popover view
     * @param {number} index is the block #id/order/counter 1,2 ... as stored in Sync object
     */
    hidePopover: function (index) {
        $('#codePreview-builder-' + index).popover('hide');
    },

    /**
     * This functionality duplicates an entire block including its condition and actions and prepend it
     * to the dom via the render method of the Factory 
     * @param {number} index is the block #id/order/counter 1,2 ... as stored in Sync object
     */
    duplicateConditionBuilder: function (index) {
        var nodes = State.update();
        for (var i in nodes) {
            if (typeof nodes[i] == 'function')
                continue;    
            
            if (nodes[i].id == index) {
                var obj = {
                    actions: JSON.stringify(nodes[i].actions),
                    condition: JSON.stringify(nodes[i].condition)
                }
                var len = nodes.length + 1;
                Factory.renderConditionBuilder(GUI.sections.conditionBuilder, obj, len, ['sortable', 'invert', 'hrc']);
                setTimeout(function () {
                    $("body").animate({ scrollTop: $("#builder-" + len).parent().offset().top - 100 }, 500);
                },300);
            }
        }
    }
};

/*
 |---------------------------------------------------------
 |  STATE
 |  The State Object is responsible for storing application data, specifically each block
 |  and its conditions and actions
 |  Only data is manipulated here, dom should be manipulated at the Factory Object
 |----------------------------------------------------------
 */
var State = {
    //an array of logic blocks
    nodes: [],
    
    /**
     * Pushes a block to the nodes pool
     * @param {number} index the #id of node
     * @param {object} block the block raw logic
     */
    pushNode: function (index, block) {
        var actions = [];

        if (block) {
            var actionsUnit = JSON.parse(block.actions);
            for (var i in actionsUnit) {
                if (typeof actionsUnit[i] == 'function')
                    continue;  
                
                actions.push({
                    index: actionsUnit[i].index,
                    logic: null
                });
            }
        } else {
            actions.push({
                index: 1,
                logic: null
            });
        }
        
        this.nodes.push({
            id: index,
            conditionIdentifier: '#builder-' + index,
            condition: null,
            actions: actions
        });
    },

    /**
     * Removes a block from the nodes pool
     * @param {number} index the #id of node
     */
    removeNode: function (index) {
        for (var i = 0; i < this.nodes.length; i++){
            if (this.nodes[i].id == index) {
                this.nodes.splice(i, 1);
            }
        }
    },

    /**
     * Get rules from blocks
     */
    updateConditions: function () {
        for (var i in this.nodes) {
            if (typeof this.nodes[i] == 'function')
                continue;    
            
            this.nodes[i].condition = $(this.nodes[i].conditionIdentifier).queryBuilder('getRules');
        }
    },

    /**
     * Pushes an action entry for the block given its id
     * @param {number} node the #id of block
     * @param {number} index the #id of action
     * @param {object} logic we pass an logic object if the action specifies it, otherwise only an empty entry is added
     */
    pushAction: function (node, index, logic = null) {
        for (var i = 0; i < this.nodes.length; i++) {
            var foundIndex = false;
            if (this.nodes[i].id == node) {
                for (var j = 0; j < this.nodes[i].actions.length; j++){
                    if (this.nodes[i].actions[j] == index) {
                        this.nodes[i].actions[j].logic = logic;
                        foundIndex = true;
                    }
                }
                if(!foundIndex)
                    this.nodes[i].actions.push({
                        index: index,
                        logic: logic
                    });
            }
        }
    },

    /**
     * Removes an action entry for the block given its id
     * @param {number} node the #id of block
     * @param {number} index the #id of action
     */
    removeAction: function (node, index) {
        for (var i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].id == node) {
                for (var j = 0; j < this.nodes[i].actions.length; j++){
                    if (this.nodes[i].actions[j].index == index) {
                        this.nodes[i].actions.splice(j, 1);
                    }
                }
            }
        }
    },

    /**
     * Get actions from blocks
     */
    updateActions: function () {
        for (var i in this.nodes) {
            if (typeof this.nodes[i] == 'function')
                continue;    
            
            for (var j = 0; j < this.nodes[i].actions.length; j++){
                this.nodes[i].actions[j].logic = {
                    operation: $('#action-select-' + this.nodes[i].id + '-' + this.nodes[i].actions[j].index).val(),
                    field: $('#field-select-' + this.nodes[i].id + '-' + this.nodes[i].actions[j].index).val(),
                    data: {
                        component: $('#field-select-' + this.nodes[i].id + '-' + this.nodes[i].actions[j].index).children(":selected").data('component'),
                        component_id: $('#field-select-' + this.nodes[i].id + '-' + this.nodes[i].actions[j].index).children(":selected").data('component-id')
                    }
                }
            }
        }
    },

    /**
     * Update nodes 
     * @return {array} nodes
     */
    update: function () {
        this.updateConditions();
        this.updateActions();
        return this.nodes;
    }
}

/*
 |---------------------------------------------------------
 |  VALIDATOR LOGIC
 |
 |  This object is optional and not code breaking because it is only used as a preview
 |  validation in code-preview feature. The real stuff should happen at validate-form-logic.js
 |
 |  Snapshot of validate-form-logic.js - 3-Oct-2017
 |  Validator object should be a mirror of validator logic, so for every change there
 |  should be a reflection here
 |----------------------------------------------------------
 */
var Validator = {
    //arithmetic mapper
    logical_operators: {
        "OR": "||",
        "AND": "&&"
    },

    //global accessible form variables on a view are located here
    variables: 'window.form_variables',

    //filter operators are mapped here and translated into js statement inside a if paranthesis
    operators: {
        "equal": function (field, type, value, data, selfcompareType) {
            if (data.hasOwnProperty('component')) {
                switch (data.component) {
                    case 'radiogroup':
                        return "$(\"input[name='" + field + "']\")[" + (value - 1) + "].checked";
                        break;
                    case 'trippleswitch':
                        return "$('#" + field + "_" + value + "').attr('class').split(/\s+/).length > 1";
                        break;
                    default:
                        field = Validator.variables + '.' + field + '.value';
                        var implicitValue = Validator.variables + '.' + value + '.value';
                        return field + "==" + (["double", "integer"].includes(type) || (selfcompareType === 0) ? implicitValue : "'" + value + "'");
                        break;
                }
            } else {
                field = Validator.variables + '.' + field + '.value';
                var implicitValue = Validator.variables + '.' + value + '.value';
                return field + "==" + (["double", "integer"].includes(type) || (selfcompareType === 0) ? implicitValue : "'" + value + "'");
            }
        },
        "not_equal": function (field, type, value, data, selfcompareType) {
            if (data.hasOwnProperty('component')) {
                switch (data.component) {
                    case 'radiogroup':
                        return "!$(\"input[name='" + field + "']\")[" + (value - 1) + "].checked";
                        break;
                    case 'trippleswitch':
                        return "$('#" + field + "_" + value + "').attr('class').split(/\s+/).length < 2";
                        break;
                    default:
                        field = Validator.variables + '.' + field + '.value';
                        var implicitValue = Validator.variables + '.' + value + '.value';
                        return field + "!=" + (["double", "integer"].includes(type) || (selfcompareType === 0) ? implicitValue : "'" + value + "'");
                        break;
                }
            } else {
                field = Validator.variables + '.' + field + '.value';
                var implicitValue = Validator.variables + '.' + value + '.value';
                return field + "!=" + (["double", "integer"].includes(type) || (selfcompareType === 0) ? implicitValue : "'" + value + "'");
            }
        },
        "in": function (field, type, value, data, selfcompareType) {
            return "N/A";
        },
        "not_in": function (field, type, value, data, selfcompareType) {
            return "N/A";
        },
        "less": function (field, type, value, data, selfcompareType) {
            field = Validator.variables + '.' + field + '.value';
            return field + "<" + (["double", "integer"].includes(type) ? value : "'" + value + "'");
        },
        "less_or_equal": function (field, type, value, data, selfcompareType) {
            field = Validator.variables + '.' + field + '.value';
            return field + "<=" + (["double", "integer"].includes(type) ? value : "'" + value + "'");
        },
        "greater": function (field, type, value, data, selfcompareType) {
            field = Validator.variables + '.' + field + '.value';
            return field + ">" + (["double", "integer"].includes(type) ? value : "'" + value + "'");
        },
        "greater_or_equal": function (field, type, value, data, selfcompareType) {
            field = Validator.variables + '.' + field + '.value';
            return field + ">=" + (["double", "integer"].includes(type) ? value : "'" + value + "'");
        },
        "between": function (field, type, value, data, selfcompareType) {
            field = Validator.variables + '.' + field + '.value';
        /*date "2017/07/25"*/ return field + ">=" + (["double", "integer"].includes(type) ? value[0] : "'" + value[0] + "'") + " && " + field + "<=" + (["double", "integer"].includes(type) ? value[1] : "'" + value[1] + "'");
        },
        "not_between": function (field, type, value, data, selfcompareType) {
            field = Validator.variables + '.' + field + '.value';
        /*date*/ return field + "<" + (["double", "integer"].includes(type) ? value[0] : "'" + value[0] + "'") + " || " + field + ">" + (["double", "integer"].includes(type) ? value[1] : "'" + value[1] + "'");
        },
        "begins_with": function (field, type, value, data, selfcompareType) {
            field = Validator.variables + '.' + field + '.value';
            return field + ".substr(0, " + value.length + ") == '" + value + "'";
        },
        "not_begins_with": function (field, type, value, data, selfcompareType) {
            field = Validator.variables + '.' + field + '.value';
            return field + ".substr(0, " + value.length + ") != '" + value + "'";
        },
        "contains": function (field, type, value, data, selfcompareType) {
            if (data.hasOwnProperty('component')) {
                switch (data.component) {
                    case 'checkboxgroup':
                        return "$(\"input[name='" + field + "[]']\")[" + (value - 1) + "].checked";
                        break;
                    default:
                        field = Validator.variables + '.' + field + '.value';
                        return field + ".indexOf('" + value + "')" + "!=-1";
                        break;
                }
            } else {
                field = Validator.variables + '.' + field + '.value';
                return field + ".indexOf('" + value + "')" + "!=-1";
            }
        },
        "not_contains": function (field, type, value, data, selfcompareType) {
            if (data.hasOwnProperty('component')) {
                switch (data.component) {
                    case 'checkboxgroup':
                        return "!$(\"input[name='" + field + "[]']\")[" + (value - 1) + "].checked";
                        break;
                    default:
                        field = Validator.variables + '.' + field + '.value';
                        return field + ".indexOf('" + value + "')" + "==-1";
                        break;
                }
            } else {
                field = Validator.variables + '.' + field + '.value';
                return field + ".indexOf('" + value + "')" + "==-1";
            }
        },
        "ends_with": function (field, type, value, data, selfcompareType) {
            field = Validator.variables + '.' + field + '.value';
            return field + ".slice(" + -value.length + ") == '" + value + "'";
        },
        "not_ends_with": function (field, type, value, data, selfcompareType) {
            field = Validator.variables + '.' + field + '.value';
            return field + ".slice(" + -value.length + ") != '" + value + "'";
        },
        "is_empty": function (field, type, value, data, selfcompareType) {
            if (data.hasOwnProperty('component')) {
                switch (data.component) {
                    case 'upload':
                        field = Validator.variables + '.' + 'upload_' + data.component_id + '.value';
                        return '$("#treetable_' + data.component_id + '").find("tbody tr")[0] == undefined';
                        break;
                    default:
                        field = Validator.variables + '.' + field + '.value';
                        return field + " == ''";
                        break;
                }
            } else {
                field = Validator.variables + '.' + field + '.value';
                return field + " == ''";
            }
        },
        "is_not_empty": function (field, type, value, data, selfcompareType) {
            if (data.hasOwnProperty('component')) {
                switch (data.component) {
                    case 'upload':
                        field = Validator.variables + '.' + 'upload_' + data.component_id + '.value';
                        return '$("#treetable_' + data.component_id + '").find("tbody tr")[0] != undefined';
                        break;
                    default:
                        field = Validator.variables + '.' + field + '.value';
                        return field + " != ''";
                        break;
                }
            } else {
                field = Validator.variables + '.' + field + '.value';
                return field + " != ''";
            }
        },
        "is_null": function (field, type, value, data, selfcompareType) {
            field = Validator.variables + '.' + field + '.value';
            return "!" + field;
        },
        "is_not_null": function (field, type, value, data, selfcompareType) {
            field = Validator.variables + '.' + field + '.value';
            return field;
        }
    },

    //action helper functions
    actionMisc: {
        //the next couple of functions return string that will be evaluated
        breadcrumbArrangerOnHide: function (data) {
            return "var currentFormLinks = $('[data-current-form=" + data.form_id + "]').parent().parent();" +
                "var currentPrevId = currentFormLinks.find('[data-prev]').data('prev');" +
                "var currentNextId = currentFormLinks.find('[data-next]').data('next');" +
                "var prevFormLinks = $('[data-current-form=\"' + currentPrevId + '\"]').parent().parent();" +
                "var nextFormLinks = $('[data-current-form=\"' + currentNextId + '\"]').parent().parent();" +

                "prevFormLinks.find('[data-next]').data('next', currentNextId);" +
                "prevFormLinks.find('[data-next]').attr('href', '#form_' + currentNextId);" +
                "prevFormLinks.find('[data-next]').attr('form_id', currentNextId);" +

                "nextFormLinks.find('[data-prev]').data('prev', currentPrevId );" +
                "nextFormLinks.find('[data-prev]').attr('href', '#form_' + currentPrevId );" +
                "nextFormLinks.find('[data-prev]').attr('form_id', currentPrevId);" +

                "if(currentNextId == '' || currentNextId == undefined){" +
                "prevFormLinks.find('[data-next]').parent().hide();" +
                "}" +
                "if(currentPrevId == '' || currentPrevId == undefined){" +
                "currentFormLinks.find('[data-next]').click();" +
                "nextFormLinks.find('[data-prev]').parent().hide();" +
                "}";

        },
        breadcrumbArrangerOnShow: function (data) {
            return "var currentFormLinks = $('[data-current-form=" + data.form_id + "]').parent().parent();" +
                "var currentPrevId = currentFormLinks.find('[data-prev]').data('prev');" +
                "var currentNextId = currentFormLinks.find('[data-next]').data('next');" +
                "var prevFormLinks = $('[data-current-form=\"' + currentPrevId + '\"]').parent().parent();" +
                "var nextFormLinks = $('[data-current-form=\"' + currentNextId + '\"]').parent().parent();" +

                "prevFormLinks.find('[data-next]').data('next', " + data.form_id + ");" +
                "prevFormLinks.find('[data-next]').attr('href', '#form_" + data.form_id + "');" +
                "prevFormLinks.find('[data-next]').attr('form_id'," + data.form_id + ");" +

                "nextFormLinks.find('[data-prev]').data('prev', " + data.form_id + ");" +
                "nextFormLinks.find('[data-prev]').attr('href', '#form_" + data.form_id + "');" +
                "nextFormLinks.find('[data-prev]').attr('form_id', " + data.form_id + ");" +

                "if(currentNextId == '' || currentNextId == undefined){" +
                "prevFormLinks.find('[data-next]').parent().show();" +
                "}" +
                "if(currentPrevId == '' || currentPrevId == undefined){" +
                "nextFormLinks.find('[data-prev]').parent().show();" +
                "}";
        }
    },

    //action operators are mapped here and translated into js statement inside a if block
    actions: {
        "show": function (allForm, field, data) {
            if (allForm) {
                return "$('#view_form_" + data.form_id + "').show();" +
                    "$('#li_form_" + data.form_id + "').show();" +
                    Validator.actionMisc.breadcrumbArrangerOnShow(data);
            } else {
                switch (data.component) {
                    case "upload":
                        field = Validator.variables + '.' + 'upload_' + data.component_id + '.block';
                        return field + ".show(); ";
                        break;
                    case "form_repeater":
                        return "$('#holder_" + field + "')" + ".show(); $('#actions_" + field + "')" + ".show(); ";
                        break;
                    default:
                        field = Validator.variables + '.' + field + '.block';
                        return field + ".show(); ";
                        break;
                }
            }
        },
        "hide": function (allForm, field, data) {
            if (allForm) {
                return "$('#view_form_" + data.form_id + "').hide();" +
                    "$('#li_form_" + data.form_id + "').hide();" +
                    Validator.actionMisc.breadcrumbArrangerOnHide(data);
            } else {
                switch (data.component) {
                    case "upload":
                        field = Validator.variables + '.' + 'upload_' + data.component_id + '.block';
                        return field + ".hide(); ";
                        break;
                    case "form_repeater":
                        return "$('#holder_" + field + "')" + ".hide(); $('#actions_" + field + "')" + ".hide(); ";
                        break;
                    default:
                        field = Validator.variables + '.' + field + '.block';
                        return field + ".hide(); ";
                        break;
                }
            }    
        },
        "scrollTo": function (allForm, field, data) {
            switch (data.component) {
                case "upload":
                    field = Validator.variables + '.' + 'upload_' + data.component_id + '.block';
                    return "$('body').animate({ scrollTop: " + field + ".offset().top - 100 }, 500);";
                    break;
                default:
                    field = Validator.variables + '.' + field + '.block';
                    return "$('body').animate({ scrollTop: " + field + ".offset().top - 100 }, 500);";
                    break;
            }

        },
        "enable": function (allForm, field, data) {
            if (allForm) {
                return "$('#view_form_" + data.form_id + "').show();" +
                    "$('#li_form_" + data.form_id + "').children()[0].style='';" +
                    Validator.actionMisc.breadcrumbArrangerOnShow(data);
            } else {
                switch (data.component) {
                    case "combobox":
                        field = Validator.variables + '.' + field + '.selector';
                        return field + ".parent().find('.multiselect').prop('disabled', false);"
                        break;
                    case "upload":
                        field = Validator.variables + '.' + 'upload_' + data.component_id + '.selector';
                        return field + ".prop('disabled', false); ";
                        break;
                    case "radiogroup":
                        return "$(\"input[name='" + field + "']\").each(function () { $(this).prop('disabled', false); })";
                        break;
                    case "checkboxgroup":
                        return "$(\"input[name='" + field + "[]']\").each(function () { $(this).prop('disabled', false); })";
                        break;
                    case "trippleswitch":
                        return "$('[id^=" + field + "_]').each(function () { $(this).prop('disabled', false); })";
                        break;
                    default:
                        field = Validator.variables + '.' + field + '.selector';
                        return field + ".prop('disabled', false); ";
                        break;
                }
            }

        },
        "disable": function (allForm, field, data) {
            if (allForm) {
                return "$('#view_form_" + data.form_id + "').hide();" +
                    "$('#li_form_" + data.form_id + "').children()[0].style='pointer-events: none; padding:3px; border-radius:5px; background: #d3d3d3; color: white';" +
                    Validator.actionMisc.breadcrumbArrangerOnHide(data);
            } else {
                switch (data.component) {
                    case "combobox":
                        field = Validator.variables + '.' + field + '.selector';
                        return field + ".parent().find('.multiselect').prop('disabled', true);"
                        break;
                    case "upload":
                        field = Validator.variables + '.' + 'upload_' + data.component_id + '.selector';
                        return field + ".prop('disabled', true); ";
                        break;
                    case "radiogroup":
                        return "$(\"input[name='" + field + "']\").each(function () { $(this).prop('disabled', true); })";
                        break;
                    case "checkboxgroup":
                        return "$(\"input[name='" + field + "[]']\").each(function () { $(this).prop('disabled', true); })";
                        break;
                    case "trippleswitch":
                        return "$('[id^=" + field + "_]').each(function () { $(this).prop('disabled', true); })";
                        break;
                    default:
                        field = Validator.variables + '.' + field + '.selector';
                        return field + ".prop('disabled', true); ";
                        break;
                }
            }    
        },
    },    

    /**
     * Builds the condition from a QueryBuilder Rules Object inside if paranthesis recursively
     * @param {querybuilder object} cond the rules of a block
     * @param {string} operator is the filter operator [equals, between, ...]
     */
    buildIf: function (cond, operator) {
        var str_cond = "";
        operator = operator == null ? "" : operator;
        
        if (cond.rules.length > 0) {
            if (cond.rules[0]["condition"] != undefined) {
                str_cond = "(" + this.buildIf(cond.rules[0]) + ")";
            } else {
                str_cond = "(" + this.operators[cond.rules[0].operator](cond.rules[0].field, cond.rules[0].type, cond.rules[0].value, cond.rules[0].data, cond.rules[0].self) + ")";
                cond.rules.splice(0, 1);
                if (cond.rules.length > 0) {
                    str_cond += this.logical_operators[cond.condition] + this.buildIf(cond);
                }   
            }
        }
        return str_cond;
    },

    /**
     * Builds the statements inside if block given a logic block 
     * @param {object} block the logic block
     */
    buildActions: function (block) {
        var str_actions = "";

        for (var i = 0; i < block.length; i++) {
            var action = block[i].logic;
            str_actions += "    " + this.actions[action.operation](action.allForm, action.field, action.data) + "<br>";
        }

        return str_actions;
    },

    /**
     * Aggregates the strings generated from buildIf() and buildActions()
     * into a valid js code block
     * @param {querybuilder object} condition the rules of a block
     * @param {object} actionsBlock the logic block
     */
    evaluate: function evaluate(condition, actionsBlock) {
        return "if (" + this.buildIf(condition) + ") { <br> " + this.buildActions(actionsBlock) + "<br>}";
    }
}

/**
 *  EVENT LISTENERS
 */

function isFormSaved(){
    if($("#id_form").val() == '_NEW_')
        return false;
    return true;
}

//add a condition builder section
GUI.btns.addLogic.on('click', function(){
    if(isFormSaved()){
        GUI.btns.spinner.show();
        Factory.renderConditionBuilder(GUI.sections.conditionBuilder);
        setTimeout(function(){GUI.btns.spinner.hide();}, 600);
    }else{
        bootbox.alert("<p>Kujdes!</p>  Forma nuk eshte ruajtur, sigurohuni qe ta ruani ate perpara se te vazhdoni");
    }
});

GUI.btns.saveLogic.on('click', function(){
    var nodes = State.update();
    
    $.ajax({
        url: '?forms/saveFormLogic',
        type: 'POST',
        dataType: 'json',
        data: {
            nodes: JSON.stringify(nodes),
            form: $("#id_form").val()
        },
        success: function (response) {
            bootbox.alert(response);
        }
    })
});

/*
 |---------------------------------------------------------
 |  INIT
 |----------------------------------------------------------
 */
Factory.renderExistingBlocks();