// Multiswitch me 3 gjendje
// Librari per tu shfaqur ne formbuilder
// @jquery.js
// @bootstrap.css

// define main object
var validOptions = [
    "trueLabel", "falseLabel", "id", "colspan", "label"
]

var defaultOptions = {
    trueLabel: "Po",
    falseLabel: "Jo",
    colspan: "col-lg-12"
}

var MultiSwitch = function (options) {
    this.prototype = Object.create(Object.prototype);
    this.options = this.parseOptionParams(options);
}

MultiSwitch.prototype.parseOptionParams = function (options) {

    if( typeof options !== "object") {
        return defaultOptions;
    }

    var opts = defaultOptions;
    $.each(options, function (key, value) {
        if($.inArray(key, validOptions)) {
            opts[key] = value;
        }
    })
    return opts;
}

MultiSwitch.prototype.create = function () {
    var html = "<div class=\" "+ this.options.colspan +" \"> " +
               "    <div class='input-group' " +
               "        <input type=\"hidden\" id="+ this.options.id +">" +
               "        <div class=\"btn btn-group btn-group-sm\" role=\"group\"> " +
               "            <button type=\"button\" id="+ this.options.id + "_on" +" " +
               "                data-target=\""+ this.options.id + "\"" +
               "                onclick=\"handleOnClick(this)\" class=\"btn btn-default\">" +
                                this.options.trueLabel + "</button> " +

               "            <button type=\"button\" id="+ this.options.id + "_null" +
               "                data-target=\""+ this.options.id + "\"" +
               "                onclick=\"handleNullClick(this)\" class=\"btn btn-default\">&nbsp;</button>" +

               "            <button type=\"button\" id="+ this.options.id + "_off" +
               "                data-target=\""+ this.options.id + "\"" +
               "                onclick=\"handleOffClick(this)\" class=\"btn btn-default\">" +
                                this.options.falseLabel + "</button> " +
               "         </div> " +
               "         <span>" + this.options.label + "</span>"
               "    </div>" +
               "</div>";
    return html;
}

function handleOnClick(context) {

    var id = $(context).data("target");
    $("#" + id).val(1);
    $("#" + id + "_off").removeClass("btn-danger");
    $("#" + id + "_null").removeClass("btn-warning");
    $(context).addClass("btn-success");

    toggleSelected(id);

    $(context).trigger('change');
}

function handleNullClick(context) {

    var id = $(context).data("target");
    $("#" + id).val("-1");
    $("#" + id + "_on" ).removeClass("btn-success");
    $("#" + id + "_off" ).removeClass("btn-danger");
    $(context).addClass("btn-warning");

    $(context).trigger('change');
}

function handleOffClick(context) {

    var id = $(context).data("target");
    $("#" + id).val(0);
    $("#" + id + "_on").removeClass("btn-success");
    $("#" + id + "_null").removeClass("btn-warning");
    $(context).addClass("btn-danger");

    toggleSelected(id);

    $(context).trigger('change');
}

// nese elementi ka atributin toggle_selected, do te bejme unselect te gjithe elementet e tjere
// me kete atribut
function toggleSelected(id) {
    var toggleSelected = $('#' + id).attr('data-toggle-selected');
    if( toggleSelected ) {
        $("[data-toggle-selected='" + toggleSelected + "']").each(function(index, element) {
            var elementId = $(element).attr("id");
            if(elementId == id) {
                // this element
                return;
            }
            if($("#" + elementId).val() == 1) {
                $("#" + elementId).val("-1");
                $("#" + elementId + "_on" ).removeClass("btn-success");
                $("#" + elementId + "_null").addClass("btn-warning");
            }
            //$("#" + elementId + "_off" ).removeClass("btn-danger");
        })
    }  
}


