/**
 * This is an AutoComplete Element
 * 
 * Kreatx 2018
 */

//component definition
var AutoComplete = KxGenerator.createComponent({
    //component data
    initModel: function () {
        return {
            blockProcessAttr: this.required ? false : this.blockProcessAttr,
            optionsData: this.dataProvider,
            selectedOptions: this.value
        }
    },

    registerEvents: function () {
        // var _self = this;
        // var model = this.getModel();

        // this.$el.on('change', function (e) {
        //     model.selectedOptions = [];
        //     var selected = $('#' + _self.fieldName + '_select').val().split(",");
        //     if (selected[0] != "")
        //         selected.forEach(function (item) {
        //             var option = model.optionsData.filter(function (option) {
        //                 return option.id == item;
        //             });
        //             model.selectedOptions.push(option[0]);
        //         });

        //     _self.value = model.selectedOptions;
        //     _self.setModelValue('selectedOptions', _self.value);
        // });

        this.$modalContainer = $('#' + this.id + '-autoselect-modal');
        this.$openModalBtn = this.$el.find('#' + this.id + '_openModal');

        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.$openModalBtn, events: {
                    'click': this.openModal.bind(this)
                }
            }
        ]
    },

    afterAttach: function (e) {
        this.createModal();
        this.renderSelect2();

        this.trigger('creationComplete');
    },

    createModal: function () {
        this.modal = new Modal({
            id: 'autocomplete-modal-' + this.id,
            size: 'modal-lg',
            title: 'Vlerat e Autocomplete',
            body: '<div class="row">' +
                '<div class="col-md-12">' +
                '<div class="table-responsive" style="margin-left:10px;">' +
                '<table id="combo_category_table" class="table table-striped table-bordered table-hover display" style="width: 100%">' +
                '<thead>' +
                '<tr>' +
                '<th>Emri</th>' +
                '</tr>' +
                '</thead>' +
                '</table>' +

                '</div>' +
                '</div>' +
                '</div>'
        });

        this.$modalContainer.html(
            this.modal.render()
        );
      
    },

    openModal: function (e) {
        var $combo_category_table;
        $('#combo_category_table').DataTable().destroy();
        $combo_category_table = $('#combo_category_table').DataTable({
            columns: [
                {"title": "Emri"},
            ],
            data: this.tableData
        });
        
        this.modal.show();
    },

    renderSelect2: function () {
        var _self = this;

        this.select2Instance = $('#' + this.fieldName + '_select').select2({
            multiple: _self.getModelValue('multipleSelection'),
            minimumInputLength: 2,
            placeholder: 'Search',
            allowClear: true,
            data: _self.getModelValue('optionsData'),
            formatResult: function (data) {
                return '<div class=\"select2-user-result\">' + data.text + '</div>';
            },
            formatSelection: function (data) {
                if (data != undefined)
                    return data.text;
            },
            separator: ',',
            width: 'off',
            initSelection: function (element, callback) {
                !_self.getModelValue('multipleSelection') ?
                    callback(_self.getModelValue('selectedOptions')[0]) :
                    callback(_self.getModelValue('selectedOptions'));
            }
        });

        $('#' + this.fieldName + '_select').select2('val', '222');
        $('#' + this.fieldName + '_select').addClass('form-control');
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (value) {
        
        var values = value.map(function (obj) {
            return obj.id;
        }).join(",");

        $('#' + this.fieldName + '_select').val(values);
        this.$el.trigger('change');
    },

    destruct: function () {
        $('#' + this.fieldName + '_select').select2('destroy');
        this.$el.remove();
    },

    enable: function () {
        this.select2Instance.enable(true);
        return this;
    },

    disable: function () {
        this.select2Instance.enable(false);
        return this;
    },

    template: function () {
        return "<div id='" + this.id + "-wrapper'>" +
                    "<div class='form-group col-lg-" + this.colspan + "' rowspan" + this.rowspan + " resizable' id='" + this.id + "_container' >" +
                    "<label rv-style='versionStyle' rv-for='fieldName'>{label} <span rv-if='required'>*</span></label>" +
                    "<div class='input-group'>" +
                        "<span rv-if='blockProcessAttr' class='block-process'> * </span>" +
                        "<input type='hidden' name='" + this.id + "_select[]' id='" + this.id + "_select' />" +
                        "<span class='input-group-btn'>" +
                            "<button type='button' style='margin-left: 5px;'" +
                                "class='glyphicon glyphicon-folder-open btn btn-default'" +
                                "title='go' id='" + this.id + "_openModal'>" +
                                "<b class='caret'></b>" +
                            "</button>" +
                        "</span>" +
                    "</div>" +
                "</div>" +
                "<div id='" + this.id + "-autoselect-modal'></div>" +
            "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
AutoComplete.type = 'autocomplete';

//register dom element for this component
KxGenerator.registerDOMElement(AutoComplete, 'kx-autocomplete');