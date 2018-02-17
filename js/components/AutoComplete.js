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

    registerEvents: function () {
        this.$modalContainer = this.$el.find('#' + this.id + '-autoselect-modal');
        this.$openModalBtn = this.$el.find('#' + this.id + '_openModal');
        this.$input = this.$el.find('#' + this.id + '_select');
        this.$select2Instance = null;
        this.$modal = null;
        this.$comboCategoryTableSelector = null;
        this.$dataTable = null;

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
        if (e.target.id == this.id + '-wrapper') {
            this.createModal();
            this.renderSelect2(function () {
                var _self = this;
                this.modal.on('creationComplete', function () {
                    //trigger autocomplete complete
                    _self.trigger('creationComplete');
                })
            });
        }
    },

    handleChange: function (e) {
        this.value = [];

        var _self = this;
        this.select2Instance.select2('val').forEach(function (item) {
            var option = _self.dataProvider.filter(function (option) {
                return option.id == item;
            });
            _self.value.push(option[0]);
        });
    },

    createModal: function () {
        this.modal = new Modal({
            id: 'autocomplete-modal-' + this.id,
            size: 'modal-lg',
            title: 'Vlerat e Autocomplete',
            body: '<div class="row">' +
                '<div class="col-md-12">' +
                '<div class="table-responsive" style="margin-left:10px;">' +
                '<table id="combo_category_table_' + this.id + '" class="table table-striped table-bordered table-hover display" style="width: 100%">' +
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
        this.$modalContainer.html(this.$modal);
        this.$modal.on('shown.bs.modal', this.renderTable.bind(this))
    },

    openModal: function (e) {
        this.modal.show();
    },

    renderTable: function (e) {
        if (!$.fn.dataTable.isDataTable(this.$dataTable))
            this.$dataTable = this.$modal.find('#combo_category_table_' + this.id)
                .DataTable({
                    columns: [{ "title": "Emri" }],
                    data: this.tableData
                });
    },

    renderSelect2: function (done) {
        var _self = this;

        this.select2Instance = this.$input.select2({
            multiple: this.multipleSelection,
            minimumInputLength: 2,
            placeholder: 'Search',
            allowClear: true,
            data: this.dataProvider,
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
                !_self.multipleSelection ?
                    callback(_self.value[0]) :
                    callback(_self.value);
            }
        }).select2('val', []);

        this.$input.addClass('form-control');
        done.call(this);
    },

    setValue: function (value) {
        this.value = value;

        this.select2Instance.select2('val', value);
        this.trigger('change');

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