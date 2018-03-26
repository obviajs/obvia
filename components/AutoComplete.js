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
        }
    },

    beforeAttach: function () {
        this.$modalContainer = this.$el.find('#' + this.domID + '-autoselect-modal');
        this.$openModalBtn = this.$el.find('#' + this.domID + '_openModal');
        this.$input = this.$el.find('#' + this.domID + '_select');
        this.$select2Instance = null;
        this.$modal = null;
        this.$comboCategoryTableSelector = null;
        this.$dataTable = null;
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.$input, events: {
                    'change': this.handleChange.bind(this)
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
        if (e.target.id == this.domID + '-wrapper') {
            if(this.displayTable)
                this.createModal();
            this.renderSelect2();
        }
    },

    handleChange: function (e) {
        this.value = [];
        if (this.select2Instance.select2('data').length > 0)
            this.select2Instance.select2('data').forEach(function (item) {
                var option = this.dataProvider.filter(function (option) {
                    return option.id == item.id;
                });
                this.value.push(option[0]);
            }.bind(this));

        this.validate();
    },

    createModal: function () {
        this.modal = new Modal({
            id: 'autocomplete-modal-' + this.domID,
            size: 'modal-lg',
            title: 'Vlerat e Autocomplete',
            body: '<div class="row">' +
                '<div class="col-sm-12">' +
                '<div class="table-responsive" style="margin-left:10px;">' +
                '<table id="combo_category_table_' + this.domID + '" class="table table-striped table-bordered table-hover display" style="width: 100%">' +
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

        this.modal.render();
        this.modal.parent = this;
        this.modal.parentType = 'autocomplete';
        
        this.$modal = this.modal.$el;
        var _self = this;
        this.modal.on('creationComplete', function (e) {
            //trigger autocomplete complete
            e.stopPropagation();
            _self.trigger('creationComplete');
        })
    
        this.$modalContainer.html(this.$modal);
        this.$modal.on('shown.bs.modal', this.renderTable.bind(this))
    },

    openModal: function (e) {
        this.modal.show();
    },

    renderTable: function (e) {
        if (!$.fn.dataTable.isDataTable(this.$dataTable))
            this.$dataTable = this.$modal.find('#combo_category_table_' + this.domID)
                .DataTable({
                    columns: [{ "title": "Emri" }],
                    data: this.tableData
                });
    },

    renderSelect2: function () {
        var _self = this;

        this.select2Instance = this.$input.select2({
            multiple: this.multipleSelection,
            placeholder: 'Search',
            allowClear: true,
            data: this.dataProvider,
            formatSelection: function (data) {
                if (data != undefined)
                    return data.text;
            },
            separator: ',',
            width: (this.displayTable) ? '90%' : '100%',
        });

        if (this.value == "" || this.value == undefined)
            this.value = [];    
        this.$input.val(this.value.map(function (item) { return item.id })).trigger('change');

        if (!this.displayTable) {
            this.trigger('creationComplete');
        }
    },

    validate: function () {
        if (this.required && this.value.length == 0) {
            this.errorList = [
                KxGenerator.getErrorList().call(this)['empty']
            ];

            this.$el.find('.select2-selection__rendered').addClass('invalid');
            return false;
        } else {
            this.errorList = [];
            this.$el.find('.select2-selection__rendered').removeClass('invalid');
            return true;
        }
    },

    setValue: function (value) {
        this.$input
            .val(value.map(function (item) { return item.id }))
            .trigger('change');

        return this;
    },

    destruct: function () {
        this.select2Instance.select2('destroy');
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
        return "<div id='" + this.domID + "-wrapper' class='form-group col-sm-" + this.colspan + " rowspan" + this.rowspan + " resizable'>" +
                    "<label rv-style='versionStyle' rv-for='domID'><b>{label}</b> <span rv-if='required'>*</span></label>" +
                    "<div class='form-group'>" +
                        "<span rv-if='model.blockProcessAttr' class='block-process'> * </span>" +
                        "<select type='hidden' name='" + this.domID + "_select[]' id='" + this.domID + "_select'></select>" +
                        "<button rv-if='displayTable' type='button' class='btn btn-primary' id='" + this.domID + "_openModal'>" +
                            "<i class='far fa-folder-open'></i> " +
                        "</button>" +
                    "</div>" +
              
                "<div id='" + this.domID + "-autoselect-modal'></div>" +
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