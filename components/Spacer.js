/**
 * This is a Spacing Definition Element
 * 
 * Kreatx 2018
 */

//component definition
var Spacer = KxGenerator.createComponent({
    beforeAttach: function () {
        this.$inputContainer = this.$el.find('.input-container');
    },

    registerEvents: function () {
        return [
            {
                registerTo: this.$el, events: {
                    'afterAttach': this.afterAttach.bind(this)
                }
            },
            {
                registerTo: this.$inputContainer, events: {
                    'change': this.handleChange.bind(this)
                }
            }
        ]
    },

    handleChange: function (e) {
        this.value.mb = this.mbSelect.getValue();
        this.value.mt = this.mtSelect.getValue();
        this.value.offset = this.offsetSelect.getValue();
    },

    attached: false,

    afterAttach: function (e) {
        if (e.target.id == this.domID + '-wrapper' && !this.attached) {
            if (this.value == null || this.value == undefined || this.value == "") {
                this.value = { mb: 0, mt: 0, offset: 0 };
            }

            this.$inputContainer.append(this.renderMbSelect(this.value.mb));  
            this.$inputContainer.append(this.renderMtSelect(this.value.mt));
            this.$inputContainer.append(this.renderOffsetSelect(this.value.offset));            

            this.attached = true;
            this.trigger('creationComplete');
        }
    },

    renderMbSelect: function (selected) {
        this.mbSelect = new Select({
            // label: "Margin Bottom",
            id: 'mbSelect-' + this.id,
            dataProvider: [{ text: "mb-0", id: "0" }, { text: "mb-1", id: "1" }, { text: "mb-2", id: "2" }, { text: "mb-3", id: "3" }, { text: "mb-4", id: "4" }, { text: "mb-5", id: "5" }],
            textField: this.labelField || "text",
            valueField: this.valueField || "id",
            value: selected,
        });

        this.mbSelect.on('creationComplete', function (e) {
            e.stopPropagation();
            this.$select.css({ 'width': '32%', 'float': 'left', 'margin-right': '2%'});
        });

        return this.mbSelect.render();
    },

    renderMtSelect: function (selected) {
        this.mtSelect = new Select({
            // label: "Margin Top",
            id: 'mtSelect-' + this.id,
            dataProvider: [{ text: "mt-0", id: "0" }, { text: "mt-1", id: "1" }, { text: "mt-2", id: "2" }, { text: "mt-3", id: "3" }, { text: "mt-4", id: "4" }, { text: "mt-5", id: "5" }],
            textField: this.labelField || "text",
            valueField: this.valueField || "id",
            value: selected,
        });

        this.mtSelect.on('creationComplete', function (e) {
            e.stopPropagation();
            this.$select.css({ 'width': '32%', 'float': 'left', 'margin-right': '2%' });
        });

        return this.mtSelect.render();
    },

    renderOffsetSelect: function (selected) {
        this.offsetSelect = new Select({
            id: 'offsetSelect-' + this.id,
            // label: "Offset",
            dataProvider: [
                { text: "offset-sm-0", id: "0" },
                { text: "offset-sm-1", id: "1" },
                { text: "offset-sm-2", id: "2" },
                { text: "offset-sm-3", id: "3" },
                { text: "offset-sm-4", id: "4" },
                { text: "offset-sm-5", id: "5" },
                { text: "offset-sm-6", id: "6" },
                { text: "offset-sm-7", id: "7" },
                { text: "offset-sm-8", id: "8" },
                { text: "offset-sm-9", id: "9" },
                { text: "offset-sm-10", id: "10" },
                { text: "offset-sm-11", id: "11" }
            ],
            textField: this.labelField || "text",
            valueField: this.valueField || "id",
            value: selected,
        });

        this.offsetSelect.on('creationComplete', function (e) {
            e.stopPropagation();
            this.$select.css({ 'width': '32%', 'float': 'left'});
        });

        return this.offsetSelect.render();
    },

    setValue: function (value) {
        this.value.mb = value.mb;
        this.value.mt = value.mt;
        this.value.offset = value.offset;

        this.mbSelect.setValue(value.mb);
        this.mtSelect.setValue(value.mt);
        this.offsetSelect.setValue(value.offset);

        return this;
    },

    enable: function () {
        this.mbSelect.enable();
        this.mtSelect.enable();
        this.offsetSelect.enable();
        this.enabled = true;
        return this;
    },

    disable: function () {
        this.mbSelect.disable();
        this.mtSelect.disable();
        this.offsetSelect.disable();
        this.enabled = false;
        return this;
    },

    template: function () {
        return "<div id='" + this.domID + "-wrapper' class='form-group col-sm-" + this.colspan + "'>" +
            "<label rv-style='versionStyle' rv-for='domID'><b>{label}</b> <span rv-if='required'>*</span></label>" +
            "<div class='input-container'>" +

            "</div>" +
            "</div>";
    },

    render: function () {
        return this.$el;
    }
});

//component prototype
Spacer.type = 'spacer';

//register dom element for this component
KxGenerator.registerDOMElement(Spacer, 'kx-spacer');

