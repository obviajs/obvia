/** CONDITION PARSER */

var logical_operators = {
    "OR": "||",
    "AND": "&&"
};

var variables = 'window.form_variables';

//available conditions declaration
var operators = {
    "equal": function (field, type, value, data, selfcompareType) {
        if (data.hasOwnProperty('component')) {
            switch (data.component) {
                case 'radiogroup':  
                    return "$(\"input[name='" + field + "']\")["+ (value-1) +"].checked";
                    break;
                case 'trippleswitch':
                    return "$('#" + field + "_" + value +"').attr('class').split(/\s+/).length > 1";   
                    break;    
                default:
                    field = variables + '.' + field + '.value';
                    var implicitValue = variables + '.' + value + '.value';
                    return field + "==" + (["double", "integer"].includes(type) || (selfcompareType === 0) ? implicitValue : "'" + value + "'");
                    break;
            }
        } else {
            field = variables + '.' + field + '.value';
            var implicitValue = variables + '.' + value + '.value';
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
                    field = variables + '.' + field + '.value';
                    var implicitValue = variables + '.' + value + '.value';
                    return field + "!=" + (["double", "integer"].includes(type) || (selfcompareType === 0) ? implicitValue : "'" + value + "'");
                    break;
            }
        } else {
            field = variables + '.' + field + '.value';
            var implicitValue = variables + '.' + value + '.value';
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
        field = variables + '.' + field + '.value';
        return field + "<" + (["double", "integer"].includes(type) ? value : "'" + value + "'");
    },
    "less_or_equal": function (field, type, value, data, selfcompareType) {
        field = variables + '.' + field + '.value';
        return field + "<=" + (["double", "integer"].includes(type) ? value : "'" + value + "'");
    },
    "greater": function (field, type, value, data, selfcompareType) {
        field = variables + '.' + field + '.value';
        return field + ">" + (["double", "integer"].includes(type) ? value : "'" + value + "'");
    },
    "greater_or_equal": function (field, type, value, data, selfcompareType) {
        field = variables + '.' + field + '.value';
        return field + ">=" + (["double", "integer"].includes(type) ? value : "'" + value + "'");
    },
    "between": function (field, type, value, data, selfcompareType) {
        field = variables + '.' + field + '.value';
        /*date "2017/07/25"*/ return field + ">=" + (["double", "integer"].includes(type) ? value[0] : "'" + value[0] + "'") + " && " + field + "<=" + (["double", "integer"].includes(type) ? value[1] : "'" + value[1] + "'");
    },
    "not_between": function (field, type, value, data, selfcompareType) {
        field = variables + '.' + field + '.value';
        /*date*/ return field + "<" + (["double", "integer"].includes(type) ? value[0] : "'" + value[0] + "'") + " || " + field + ">" + (["double", "integer"].includes(type) ? value[1] : "'" + value[1] + "'");
    },
    "begins_with": function (field, type, value, data, selfcompareType) {
        field = variables + '.' + field + '.value';
        return field + ".substr(0, " + value.length + ") == '" + value + "'";
    },
    "not_begins_with": function (field, type, value, data, selfcompareType) {
        field = variables + '.' + field + '.value';
        return field + ".substr(0, " + value.length + ") != '" + value + "'";
    },
    "contains": function (field, type, value, data, selfcompareType) {
        if (data.hasOwnProperty('component')) {
            switch (data.component) {
                case 'checkboxgroup':
                    return "$(\"input[name='" + field + "[]']\")[" + (value - 1) + "].checked";
                    break;
                default:
                    field = variables + '.' + field + '.value';
                    return field + ".indexOf('" + value + "')" + "!=-1";
                    break;
            }
        } else {
            field = variables + '.' + field + '.value';
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
                    field = variables + '.' + field + '.value';
                    return field + ".indexOf('" + value + "')" + "==-1";
                    break;
            }
        } else {
            field = variables + '.' + field + '.value';
            return field + ".indexOf('" + value + "')" + "==-1";
        }
    },
    "ends_with": function (field, type, value, data, selfcompareType) {
        field = variables + '.' + field + '.value';
        return field + ".slice(" + -value.length + ") == '" + value + "'";
    },
    "not_ends_with": function (field, type, value, data, selfcompareType) {
        field = variables + '.' + field + '.value';
        return field + ".slice(" + -value.length + ") != '" + value + "'";
    },
    "is_empty": function (field, type, value, data, selfcompareType) {
        if (data.hasOwnProperty('component')) {
            switch (data.component) {
                case 'upload':
                    field = variables + '.' + 'upload_' + data.component_id + '.value';
                    return '$("#treetable_' + data.component_id + '").find("tbody tr")[0] == undefined';
                    break;
                default:
                    field = variables + '.' + field + '.value';
                    return field + " == ''";
                    break;    
            }
        } else {
            field = variables + '.' + field + '.value';
            return field + " == ''";
        }
        
    },
    "is_not_empty": function (field, type, value, data, selfcompareType) {
        if (data.hasOwnProperty('component')) {
            switch (data.component) {
                case 'upload':
                    field = variables + '.' + 'upload_' + data.component_id + '.value';
                    return '$("#treetable_' + data.component_id + '").find("tbody tr")[0] != undefined';
                    break;
                default:
                    field = variables + '.' + field + '.value';
                    return field + " != ''";
                    break;
            }
        } else {
            field = variables + '.' + field + '.value';
            return field + " != ''";
        }
    },
    "is_null": function (field, type, value, data, selfcompareType) {
        return "!" + field;
    },
    "is_not_null": function (field, type, value, data, selfcompareType) {
        field = variables + '.' + field + '.value';
        return field;
    }
};

//Misc Action helper functions
var actionMisc = {
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

            "prevFormLinks.find('[data-next]').data('next', "+ data.form_id + ");" +
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
}

//available actions declaration
var actions = {
    "show": function (allForm, field, data) {
        if (allForm) {
            return "$('#view_form_" + data.form_id + "').show();" +
                "$('#li_form_" + data.form_id + "').show();" +
                actionMisc.breadcrumbArrangerOnShow(data);    
        } else {
            switch (data.component) {
                case "upload":
                    field = variables + '.' + 'upload_' + data.component_id + '.block';
                    return field + ".show(); ";
                    break;
                case "form_repeater":
                    return "$('#holder_" + field + "')" + ".show(); $('#actions_" + field + "')" + ".show(); ";
                    break;
                default:
                    field = variables + '.' + field + '.block';
                    return field + ".show(); ";
                    break;
            }
        } 
    },
    "hide": function (allForm, field, data) {
        if (allForm) {
            return "$('#view_form_" + data.form_id + "').hide();" +
                "$('#li_form_" + data.form_id + "').hide();" +
                actionMisc.breadcrumbArrangerOnHide(data);
        } else {
            switch (data.component) {
                case "upload":
                    field = variables + '.' + 'upload_' + data.component_id + '.block';
                    return field + ".hide(); ";
                    break;
                case "form_repeater":
                    return "$('#holder_" + field + "')" + ".hide(); $('#actions_" + field + "')" + ".hide(); ";
                    break;
                default:
                    field = variables + '.' + field + '.block';
                    return field + ".hide(); ";
                    break;
            }
        }    
    },
    "scrollTo": function (allForm, field, data) {
        switch (data.component) {
            case "upload":
                field = variables + '.' + 'upload_' + data.component_id + '.block';
                return "$('body').animate({ scrollTop: " + field + ".offset().top - 100 }, 500);";
                break;
            default:
                field = variables + '.' + field + '.block';
                return "$('body').animate({ scrollTop: " + field + ".offset().top - 100 }, 500);";
                break;
        }
        
    },
    "enable": function (allForm, field, data) {
        if (allForm) {
            return "$('#view_form_" + data.form_id + "').show();" +
                "$('#li_form_" + data.form_id + "').children()[0].style='';" +
                actionMisc.breadcrumbArrangerOnShow(data);
        } else {
            switch (data.component) {
                case "combobox":
                    field = variables + '.' + field + '.selector';
                    return field + ".parent().find('.multiselect').prop('disabled', false);"
                    break;
                case "upload":
                    field = variables + '.' + 'upload_' + data.component_id + '.selector';
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
                    field = variables + '.' + field + '.selector';
                    return field + ".prop('disabled', false); ";
                    break;
            }

        }
        
    },
    "disable": function (allForm, field, data) {
        if (allForm) {
            return "$('#view_form_" + data.form_id + "').hide();" +
                "$('#li_form_" + data.form_id + "').children()[0].style='pointer-events: none; padding:3px; border-radius:5px; background: #d3d3d3; color: white';" +
                actionMisc.breadcrumbArrangerOnHide(data);
        } else {
            switch (data.component) {
                case "combobox":
                    field = variables + '.' + field + '.selector';
                    return field + ".parent().find('.multiselect').prop('disabled', true);"
                    break;
                case "upload":
                    field = variables + '.' + 'upload_' + data.component_id + '.selector';
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
                    field = variables + '.' + field + '.selector';
                    return field + ".prop('disabled', true); ";
                    break;
            }
        }
    }
}

//generate if condtion according to block rules

function buildIf(cond, operator) {
    var cond_clone = jQuery.extend(true, {}, cond);
    var str_cond = "";
    operator = operator == null ? "" : operator;

    if (cond_clone.rules.length > 0) {
        if (cond_clone.rules[0]["condition"] != undefined) {
            str_cond = "(" + buildIf(cond_clone.rules[0]) + ")";
        } else {
            str_cond = "(" + operators[cond_clone.rules[0].operator](cond_clone.rules[0].field, cond_clone.rules[0].type, cond_clone.rules[0].value, cond_clone.rules[0].data, cond_clone.rules[0].self) + ")";
            cond_clone.rules.splice(0, 1);
            if (cond_clone.rules.length > 0) {
                str_cond += logical_operators[cond_clone.condition] + buildIf(cond_clone);
            }
        }
    }
    
    return str_cond;
}

//generate actions according to block actions
function buildActions(block) {
    var str_actions = "";

    for (var i = 0; i < block.length; i++){
        var action = block[i].logic;
        str_actions += actions[action.operation](action.allForm, action.field, action.data);
    }  
    
    return str_actions;
}   

//evaluate dynamic generated code
function evaluate(condition, actionsBlock) {
    var stringToeval = "if (" + buildIf(condition) + ") {" + buildActions(actionsBlock) + "}";
    console.log(stringToeval);
    eval(stringToeval);
}

//update form variables inside global window object
function updateFormVariables() {
    for (var variable in window.form_variables) {
        if (typeof window.form_variables[variable] == 'function')
            continue;    
        
        window.form_variables[variable].value = eval(window.form_variables[variable].source);
    };
}

//validate form at load and on change event
function validate(blocks) {
    var forms = {};

    for (var i = 0; i < blocks.length; i++) {
        //evaluate block logic
        var block = blocks[i];
        
        if (!forms.hasOwnProperty(block.id_form))
            forms[block.id_form] = {};
        
        forms[block.id_form][i] = {
            'condition': block.condition,
            'actions': block.actions
        };
        
        updateFormVariables();
        evaluate(block.condition, block.actions);
    }

    
    $('[id^=view_form_]').each(function () {
        var currentForm = this.id.split('_')[2];
        
        $(this).on('change dp.change', function () {
            updateFormVariables();
           
            for (var j in forms[currentForm]) {
                if (typeof forms[currentForm][j] == 'function')
                    continue;    
                
                evaluate(forms[currentForm][j]['condition'], forms[currentForm][j]['actions']);
            }
            for (var j in forms['-1']) {
                if (typeof forms['-1'][j] == 'function')
                    continue;    
                
                evaluate(forms['-1'][j]['condition'], forms['-1'][j]['actions']);
            }
        });
    });
  
}

/** VALIDATION */

$.when(
    $.ajax({
        url: '?forms/getProcessLogicBlocks/' + id_process_value,
        dataType: 'json'
    })
).done(function (blocks) {
    validate(blocks);
});


 


