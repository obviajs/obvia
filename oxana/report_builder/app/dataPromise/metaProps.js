Builder.initMetaProps = function () {
  Builder.metaProps = {
    form_name: {
      ctor: "TextInput",
      label: "Form Name",
      required: true,
      index: 1,
      props: {
        change: function () {
          this.parent.parent.instance.form_name = this.value;
        },
      },
    },
    description: {
      ctor: "TextArea",
      label: "Description",
      required: false,
      index: 1,
      props: {
        change: function () {
          this.parent.parent.instance.description = this.value;
        },
      },
    },
    date_created: {
      ctor: "Label",
      label: "Date Created",
      required: false,
      index: 1,
      props: {},
    },
    author_id_user: {
      ctor: "Label",
      label: "Author",
      required: false,
      index: 1,
      props: {},
    },
    id: {
      ctor: "TextInput",
      label: "Component ID",
      required: true,
      index: 1,
      props: {
        change: function () {
          this.parent.parent.instance.id = this.value;
        },
      },
    },
    name: {
      ctor: "TextInput",
      label: "Component Name",
      required: true,
      index: 2,
      props: {
        change: function () {
          this.parent.parent.instance.name = this.value;
        },
      },
    },
    label: {
      ctor: "TextInput",
      label: "Label",
      required: true,
      index: 6,
      props: {
        change: function () {
          this.parent.parent.instance.label = this.value;
        },
      },
    },
    href: {
      ctor: "TextInput",
      label: "URL",
      required: true,
      index: 3,
      props: {
        change: function () {
          this.parent.parent.instance.href = this.value;
        },
      },
    },
    target: {
      ctor: "Select",
      label: "Target",
      index: 3,
      props: {
        dataProvider: new ArrayEx(
          getMembersCollection(LinkTarget, "text", "value")
        ),
        change: function () {
          this.parent.parent.instance.target = this.value;
        },
      },
    },
    width: {
      ctor: "TextInput",
      label: "Width",
      required: true,
      index: 4,
      props: {
        change: function () {
          this.parent.parent.instance.css.width = this.value;
        },
      },
    },
    height: {
      ctor: "TextInput",
      label: "Height",
      required: true,
      index: 5,
      props: {
        change: function () {
          this.parent.parent.instance.css.height = this.value;
        },
      },
    },
    visible: {
      ctor: "Toggle",
      label: "Visible",
      index: 7,
      props: {
        change: function () {
          this.parent.parent.instance.visible = this.value;
        },
      },
    },
    enabled: {
      ctor: "Toggle",
      label: "Enabled",
      index: 8,
      props: {
        change: function () {
          this.parent.parent.instance.enabled = this.value;
        },
      },
    },
    x: {
      ctor: "TextInput",
      label: "x-coordinate",
      index: 2,
      props: {
        change: function () {
          this.parent.parent.instance.x = this.value;
        },
      },
    },
    y: {
      ctor: "TextInput",
      label: "y-coordinate",
      index: 3,
      props: {
        change: function () {
          this.parent.parent.instance.y = this.value;
        },
      },
    },

    //new
    fontSize: {
      ctor: "TextInput",
      label: "Font Size",
      index: 4,
      props: {
        change: function () {
          this.parent.parent.instance.fontSize = this.value;
          this.parent.parent.instance.$el[0].style.fontSize = this.value + "px";
        },
      },
    },
    backgroundColor: {
      ctor: "Color",
      label: "Background Color",
      index: 5,
      props: {
        change: function () {
          this.parent.parent.instance.backgroundColor = this.value;
          this.parent.parent.instance.$el[0].style.backgroundColor = this.value;
        },
      },
    },
    color: {
      ctor: "Color",
      label: "Text Color",
      index: 6,
      props: {
        change: function () {
          this.parent.parent.instance.color = this.value;
          this.parent.parent.instance.$el[0].style.color = this.value;
        },
      },
    },
    transparent: {
      ctor: "CheckBox",
      label: "Transparent",
      index: 7,
      props: {
        change: function () {
          if (this.checked) {
            this.parent.parent.instance.transparent = "Transparent";
            this.parent.parent.instance.$el[0].style.backgroundColor =
              "transparent";
          } else {
            this.parent.parent.instance.transparent = "Opaque";
            this.parent.parent.instance.$el[0].style.backgroundColor = this.parent.parent.instance.backgroundColor;
          }
        },
      },
    },
    editorCode: {
      ctor: "TextInput",
      label: "EditorCode",
      index: 8,
      props: {
        change: function () {
          this.parent.parent.instance.editorCode = this.value;
        },
      },
    },
    //new

    section: {
      ctor: "TextInput",
      label: "section",
      index: 9,
      props: {
        change: function () {
          this.parent.parent.instance.section = this.value;
        },
      },
    },
    required: {
      ctor: "Toggle",
      label: "Required",
      index: 6,
      props: {
        change: function () {
          this.parent.parent.instance.required = this.value;
        },
      },
    },
    checked: {
      ctor: "Toggle",
      label: "Checked",
      index: 7,
      props: {
        change: function () {
          this.parent.parent.instance.checked = this.value;
        },
      },
    },
    dataProvider: {
      ctor: "AutoBrowse",
      label: "Data Provider",
      required: true,
      props: {
        valueField: Builder.providerValueField,
        labelField: Builder.providerLabelField,
        dataProvider: Builder.sources,
        classes: ["no-form-control"],
        change: function () {
          //propsForm.children["dataProvider"].value
          //get the fields for the selected datProvider and
          //assign them to the labelField and valueField editor`s dataProvider property
          if (this.value && this.value.length > 0) {
            //let url = "http://flower-gaia/api/dataview_pid_1/yaml";
            let url =
              "https://gaia.oxana.io/api/" + this.value[0].name + "/yaml";
            let _self = this;
            if (!Builder.data[_self.value[0][Builder.providerValueField]]) {
              GaiaAPI_Utils.generateAndLoadDataView(
                url,
                Builder.recordsPerPage
              ).then(function (aex) {
                console.log(aex);
                _self.parent.parent.instance.dataProvider = Builder.data[
                  _self.value[0][Builder.providerValueField]
                ] = aex;
                if (_self.parent.parent.labelField && aex && aex.length > 0) {
                  let dpFieldNames = Object.keys(aex[0]);
                  let len = dpFieldNames.length;
                  let dpFields = new ArrayEx();
                  for (let i = 0; i < len; i++) {
                    dpFields.push({ dpField: dpFieldNames[i] });
                  }
                  _self.parent.parent.labelField.input.dataProvider = dpFields;
                  if (_self.parent.parent.valueField)
                    _self.parent.parent.valueField.input.dataProvider = dpFields;
                }
              });
            } else {
              _self.parent.parent.instance.dataProvider =
                Builder.data[_self.value[0][Builder.providerValueField]];
              let aex =
                Builder.data[_self.value[0][Builder.providerValueField]];
              if (_self.parent.parent.labelField && aex && aex.length > 0) {
                let dpFieldNames = Object.keys(aex[0]);
                let len = dpFieldNames.length;
                let dpFields = new ArrayEx();
                for (let i = 0; i < len; i++) {
                  dpFields.push({ dpField: dpFieldNames[i] });
                }
                _self.parent.parent.labelField.input.dataProvider = dpFields;
                if (_self.parent.parent.valueField)
                  _self.parent.parent.valueField.input.dataProvider = dpFields;
              }
            }
            this.parent.parent.instance.attr[
              Builder.providerValueField
            ] = this.value[0][Builder.providerValueField];
          }
        },
      },
      setter: function () {
        if (this.attr[Builder.providerValueField]) {
          let m = ArrayUtils.getMatching(
            Builder.sources,
            Builder.providerValueField,
            this.attr[Builder.providerValueField]
          );
          if (m.objects.length > 0) {
            return new ArrayEx(m.objects);
          }
        }
      },
      index: 2,
    },
    labelField: {
      ctor: "AutoCompleteEx",
      label: "Label Field",
      required: true,
      props: {
        valueField: "dpField",
        labelField: "dpField",
        change: function () {
          if (this.value && this.value.length > 0)
            this.parent.parent.instance.labelField = this.value[0]["dpField"];
        },
      },
      index: 9,
    },
    valueField: {
      ctor: "AutoCompleteEx",
      label: "Value Field",
      required: true,
      props: {
        valueField: "dpField",
        labelField: "dpField",
        change: function () {
          if (this.value && this.value.length > 0)
            this.parent.parent.instance.valueField = this.value[0]["dpField"];
        },
      },
      index: 10,
    },
    mask: {
      ctor: "AutoCompleteEx",
      label: "Data Provider",
      required: true,
      props: {
        valueField: Builder.maskValueField,
        labelField: Builder.maskLabelField,
        dataProvider: Builder.masks,
      },
      index: 11,
    },
    inputFormat: {
      ctor: "Select",
      label: "Input Format",
      required: true,
      props: {
        dataProvider: new ArrayEx(
          getMembersCollection(DateTimeFormat, "text", "value")
        ),
        change: function () {
          this.parent.parent.instance.inputFormat = this.value;
        },
      },
      index: 12,
    },
    outputFormat: {
      ctor: "Select",
      label: "Output Format",
      required: true,
      props: {
        dataProvider: new ArrayEx(
          getMembersCollection(DateTimeFormat, "text", "value")
        ),
        change: function () {
          this.parent.parent.instance.outputFormat = this.value;
        },
      },
      index: 13,
    },
    displayFormat: {
      ctor: "Select",
      label: "Display Format",
      required: true,
      props: {
        dataProvider: new ArrayEx(
          getMembersCollection(DateTimeFormat, "text", "value")
        ),
        change: function () {
          this.parent.parent.instance.displayFormat = this.value;
        },
      },
      index: 14,
    },
    multiple: {
      ctor: "Toggle",
      label: "Multiple Files",
      index: 15,
      props: {
        change: function () {
          this.parent.parent.instance.multiple = this.value;
        },
      },
    },
    accept: { ctor: "Toggle", label: "Allowed Files", index: 16 },
    spacing: {
      ctor: "SpacingEditor",
      label: "Adjust Spacing",
      index: 17,
      props: {
        change: function () {
          let _spacing = this.value;
          this.parent.parent.instance.spacing.colSpan = _spacing.colSpan;
          this.parent.parent.instance.spacing.offset = _spacing.offset;
          this.parent.parent.instance.spacing.mb = _spacing.mb;
          this.parent.parent.instance.spacing.mt = _spacing.mt;
        },
      },
    },
    columns: {
      ctor: "Button",
      label: "Columns",
      index: 18,
      props: {
        id: "columnEditor",
        label: "Manage Columns",
        classes: ["btn", "btn-secondary"],
        components: [
          {
            ctor: Label,
            props: {
              id: "fa",
              labelType: LabelType.i,
              classes: ["fas", "fa-list"],
            },
          },
        ],
        click: function (e) {
          let oe = this.parent.parent;
          if (
            oe.dataProvider.input.value &&
            oe.dataProvider.input.value.length > 0
          ) {
            let dpName =
              oe.dataProvider.input.value[0][oe.dataProvider.input.valueField];
            if (Builder.data[dpName] && Builder.data[dpName].length > 0) {
              let win = this.parent.parent.columnsEditModal;
              if (!win) {
                let lit = extend(true, Builder.components.Modal.literal);
                lit.props.id = "columnsEditModal";
                lit.props.title = "Edit Columns";
                lit.props.components = [
                  {
                    ctor: CollectionEditor,
                    props: {
                      id: "columnEditor",
                      memberType: "DataGridColumn",
                      instance: this.parent.parent.instance.columns,
                    },
                  },
                ];
                win = this.parent.parent.addComponent(lit);
              }
              let colOEInstances =
                win.modalDialog.modalContent.modalBody.columnEditor.repeater
                  .repeater.objectEditor;
              if (colOEInstances) {
                let dpFieldNames = Object.keys(Builder.data[dpName][0]);
                let len = dpFieldNames.length;
                let dpFields = new ArrayEx();
                for (let i = 0; i < len; i++) {
                  dpFields.push({ dpField: dpFieldNames[i] });
                }

                len = colOEInstances.length;
                for (let i = 0; i < len; i++) {
                  //win.columnEditor.repeater.repeater.objectEditor[i].dataProvider.input.dataProvider = dpFields;
                  //win.columnEditor.repeater.repeater.objectEditor[i].field.component.props.dataProvider = dpFields;
                  colOEInstances[
                    i
                  ].field.AutoCompleteEx.dataProvider = dpFields;
                }
                win.show();
              }
            } else {
              alert("The selected DataProvider is empty or failed to load.");
            }
          } else {
            alert("Please Select DataProvider");
          }
        },
      },
    },
    classes: {
      ctor: "Button",
      label: "Classes",
      index: 18,
      props: {
        id: "editClasses",
        label: "Edit Classes",
        classes: ["btn", "btn-secondary"],
        components: [],
        click: function (e) {
          let oe = this.parent.parent;
          let win = this.parent.parent.classesEditModal;
          if (!win) {
            let dp = new ArrayEx(oe.instance.classes.length);
            let classes = Object.values(oe.instance.classes);
            for (let i = 0; i < classes.length; i++) {
              dp[i] = {
                cssclass: oe.instance.classes[i],
              };
            }

            let lit = extend(true, Builder.components.Modal.literal);
            lit.props.id = "ClassesEditModal";
            lit.props.title = "Edit Classes";
            lit.props.components = [
              {
                ctor: RepeaterEx,
                props: {
                  id: "classesEditor",
                  dataProvider: dp,
                  rendering: {
                    direction: "vertical",
                    separator: false,
                  },
                  rowDelete: (e, r, ra) => {
                    let classes = oe.instance.classes.slice(0);
                    classes.splice(ra.currentIndex, 1);
                    oe.instance.classes = classes;
                  },
                  rowAdd: (e, r, ra) => {
                    console.log(ra);
                  },
                  beforeAttach: function (e) {
                    if (
                      this.internalRepeater["removeButton"] &&
                      this.internalRepeater["removeButton"].length > 0
                    ) {
                      this.internalRepeater["removeButton"][0].enabled = false;
                    }
                  },
                  components: [
                    {
                      ctor: TextInput,
                      props: {
                        id: "textInput",
                        value: "{cssclass}",
                        change: function (e, ra) {
                          let classes = oe.instance.classes.slice(0);
                          if (ra.currentIndex < classes.length)
                            classes[ra.currentIndex] = this.value;
                          else classes.push(this.value);
                          oe.instance.classes = classes;
                        },
                      },
                    },
                    {
                      ctor: Button,
                      props: {
                        id: "removeButton",
                        type: "button",
                        components: [
                          {
                            ctor: Label,
                            props: {
                              id: "fa",
                              labelType: LabelType.i,
                              classes: ["fas", "fa-minus-circle"],
                            },
                          },
                        ],
                        click: function (e, ra) {
                          this.parent.removeRow(ra.currentIndex);
                        },
                      },
                    },
                  ],
                },
              },
            ];

            win = this.parent.parent.addComponent(lit);
          }
          let classesInstances =
            win.modalDialog.modalContent.modalBody.classesEditor;
          if (classesInstances) {
            win.attached = true;
            win.show();
          }
        },
      },
    },
    dataField: "textLabel",
    headerText: "Pija Preferuar",
    sortInfo: { sortOrder: 0, sortDirection: "ASC" },
    sortable: {
      ctor: "Toggle",
      label: "Sortable",
      index: 20,
      props: {
        change: function () {
          this.parent.parent.instance.sortable = this.checked;
        },
      },
    },
    editable: {
      ctor: "Toggle",
      label: "Editable",
      index: 21,
      props: {
        change: function () {
          this.parent.parent.instance.editable = this.checked;
        },
      },
    },
    input: {
      ctor: "ObjectEditor",
      label: "Input Properties",
      index: 7,
      props: function (oeInst) {
        /**
         * this is not really necessary, just to demonstrate that props can be a function as well
         * this - is the isntance of the object being inspected, oeInst (the first and only param)
         * is the isntance of the ObjectEditor created for inspecting the object being inspected
         */
        let _props = {};
        _props.instance = this.input;
        return _props;
      },
    },
    direction: {
      ctor: "Select",
      label: "Direction",
      props: {
        dataProvider: new ArrayEx([
          { value: "vertical", text: "Vertical" },
          { value: "horizontal", text: "Horizontal" },
        ]),
        change: function () {
          this.parent.parent.instance.direction = this.value;
        },
      },
    },
    align: {
      ctor: "Select",
      label: "Align",
      props: {
        dataProvider: new ArrayEx(getMembersCollection(Align, "text", "value")),
        change: function () {
          this.parent.parent.instance.align = this.value;
        },
      },
    },
    headingType: {
      ctor: "Select",
      label: "Heading Type",
      props: {
        dataProvider: new ArrayEx(
          getMembersCollection(HeadingType, "text", "value")
        ),
        change: function () {
          this.parent.parent.instance.headingType = this.value;
        },
      },
    },
    side: {
      ctor: "Select",
      label: "Side",
      props: {
        dataProvider: new ArrayEx(
          getMembersCollection(SideNavSide, "text", "value")
        ),
        change: function () {
          this.parent.parent.instance.side = this.value;
        },
      },
    },
    separator: {
      ctor: "Toggle",
      label: "Separator",
      props: {
        change: function () {
          this.parent.parent.instance.separator = this.value;
        },
      },
    },
    itemRenderer: {
      ctor: "AutoBrowse",
      label: "Item Renderer",
      required: true,
      props: {
        valueField: Builder.componentValueField,
        labelField: Builder.componentValueField,
        dataProvider: Builder.componentList,
        fields: [
          {
            field: Builder.componentValueField,
            description: Builder.componentValueField,
            visible: false,
          },
          {
            field: Builder.componentLabelField,
            description: Builder.componentLabelField,
          },
        ],
        classes: ["no-form-control"],
        change: function () {
          //propsForm.children["dataProvider"].value
          //get the fields for the selected datProvider and
          //assign them to the labelField and valueField editor`s dataProvider property
          if (this.value && this.value.length > 0) {
            this.parent.parent.instance.itemEditor = this.value[0];
          }
        },
      },
      index: 18,
    },
    itemEditor: {
      ctor: "AutoBrowse",
      label: "Item Editor",
      required: false,
      props: {
        valueField: Builder.componentValueField,
        labelField: Builder.componentValueField,
        dataProvider: Builder.componentList,
        fields: [
          {
            field: Builder.componentValueField,
            description: Builder.componentValueField,
            visible: false,
          },
          {
            field: Builder.componentLabelField,
            description: Builder.componentLabelField,
          },
        ],
        classes: ["no-form-control"],
        change: function () {
          //propsForm.children["dataProvider"].value
          //get the fields for the selected datProvider and
          //assign them to the labelField and valueField editor`s dataProvider property
          if (this.value && this.value.length > 0) {
            this.parent.parent.instance.itemEditor = this.value[0];
          }
          console.log(arguments);
        },
      },
      index: 19,
    },
    field: {
      ctor: "AutoCompleteEx",
      label: "DataProvider Field",
      required: true,
      props: {
        valueField: "dpField",
        labelField: "dpField",
        change: function () {
          this.parent.parent.instance.field = this.value;
        },
      },
      index: 1,
    },
  };

  Builder.metaProps.Repeater = {
    components: {
      ctor: "AutoBrowse",
      label: "Repeated Form",
      required: true,
      props: {
        valueField: "form_id",
        labelField: "form_name",
        dataProvider: Builder.forms,
        fields: [
          { field: "form_id", description: "form_id", visible: false },
          { field: "form_name", description: "form_name" },
        ],
        classes: ["no-form-control"],
        change: function () {
          //propsForm.children["dataProvider"].value
          //get the fields for the selected datProvider and
          //assign them to the labelField and valueField editor`s dataProvider property
          this.parent.parent.instance.attr.repeated_id_form =
            this.value.length > 0 ? this.value[0][this.valueField] : undefined;
        },
      },
      index: 7,
      /**
       * by default the value of the propertyEditor is binded to the value of the property of the instance
       * by specifying a setter function you override this behavior. The return value of the function
       * will be the assigned to the property of the instance
       */
      setter: function () {
        if (this.attr.repeated_id_form) {
          let m = ArrayUtils.getMatching(
            Builder.forms,
            "form_id",
            this.attr.repeated_id_form
          );
          if (m.objects.length > 0) {
            return new ArrayEx(m.objects);
          }
        }
      },
    },
    rendering: {
      ctor: "ObjectEditor",
      label: "Rendering",
      required: false,
      props: {},
    },
  };

  Builder.metaProps.RepeaterEx = {
    components: {
      ctor: "AutoBrowse",
      label: "Repeated Form",
      required: true,
      props: {
        valueField: "form_id",
        labelField: "form_name",
        dataProvider: Builder.forms,
        fields: [
          { field: "form_id", description: "form_id", visible: false },
          { field: "form_name", description: "form_name" },
        ],
        classes: ["no-form-control"],
        change: function () {
          //propsForm.children["dataProvider"].value
          //get the fields for the selected datProvider and
          //assign them to the labelField and valueField editor`s dataProvider property
          this.parent.parent.instance.attr.repeated_id_form =
            this.value.length > 0 ? this.value[0][this.valueField] : undefined;
        },
      },
      index: 7,
    },
    rendering: {
      ctor: "ObjectEditor",
      label: "Rendering",
      required: false,
      props: {},
    },
  };

  Builder.metaProps.DataGridColumn = {
    name: {
      ctor: "TextInput",
      label: "Column Name",
      required: true,
      index: 1,
      props: {
        change: function () {
          this.parent.parent.instance.name = this.value;
        },
      },
    },
    description: {
      ctor: "TextInput",
      label: "Column Label",
      required: true,
      index: 2,
      props: {
        change: function () {
          this.parent.parent.instance.description = this.value;
        },
      },
    },
  };

  Builder.metaProps.TextInput = {
    type: {
      ctor: "Select",
      label: "Input Type",
      props: {
        dataProvider: new ArrayEx(
          getMembersCollection(TextInputType, "text", "value")
        ),
        change: function () {
          this.parent.parent.instance.type = this.value;
        },
      },
    },
    value: {
      ctor: "TextInput",
      label: "Text",
      required: true,
      index: 3,
      props: {
        change: function () {
          this.parent.parent.instance.value = this.value;
        },
      },
    },
    autocomplete: {
      ctor: "Select",
      label: "Autocomplete",
      props: {
        dataProvider: new ArrayEx([
          { value: "off", text: "Off" },
          { value: "on", text: "On" },
        ]),
        change: function () {
          this.parent.parent.instance.autocomplete = this.value;
        },
      },
    },
    placeholder: {
      ctor: "TextInput",
      label: "Placeholder",
      index: 3,
      required: false,
      props: {
        change: function () {
          this.parent.parent.instance.placeholder = this.value;
        },
      },
    },
  };

  Builder.metaProps.Label = {
    labelType: {
      ctor: "Select",
      label: "Label Type",
      props: {
        dataProvider: new ArrayEx(
          getMembersCollection(LabelType, "value", "text")
        ),
        change: function () {
          this.parent.parent.instance.labelType = this.value;
        },
      },
    },
  };

  Builder.metaProps.Button = {
    type: {
      ctor: "Select",
      label: "Button Type",
      props: {
        dataProvider: new ArrayEx(
          getMembersCollection(ButtonType, "value", "text")
        ),
        change: function () {
          this.parent.parent.instance.type = this.value;
        },
      },
    },
    label: {
      ctor: "TextInput",
      label: "Value",
      props: {
        change: function () {
          this.parent.parent.instance.label = this.value;
        },
      },
    },
  };

  Builder.metaProps.TextArea = {
    value: {
      ctor: "TextInput",
      label: "Value",
      props: {
        change: function () {
          this.parent.parent.instance.value = this.value;
        },
      },
    },
    spellCheck: {
      ctor: "Select",
      label: "Spell Check",
      props: {
        dataProvider: new ArrayEx([
          { value: "false", text: "False" },
          { value: "true", text: "True" },
        ]),
        change: function () {
          this.parent.parent.instance.spellCheck = this.value;
        },
      },
    },
    placeholder: {
      ctor: "TextInput",
      label: "Placeholder",
      props: {
        change: function () {
          this.parent.parent.instance.placeholder = this.value;
        },
      },
    },
  };

  Builder.metaProps.DateTime = {
    value: {
      ctor: "TextInput",
      label: "Value",
      props: {
        change: function () {
          this.parent.parent.instance.value = this.value;
        },
      },
    },
  };

  Builder.metaProps.Image = {
    alt: {
      ctor: "TextInput",
      label: "Alt",
      required: false,
      props: {
        change: function () {
          this.parent.parent.instance.alt = this.value;
        },
      },
    },
    src: {
      ctor: "TextInput",
      label: "Src",
      required: true,
      index: 3,
      props: {
        change: function () {
          this.parent.parent.instance.src = this.value;
        },
      },
    },
  };

  Builder.metaProps.CheckBox = {
    value: {
      ctor: "TextInput",
      label: "Value",
      required: false,
      prop: {
        change: function () {
          this.parent.parent.instance.value = this.value;
        },
      },
    },
  };

  Builder.metaProps.SideNav = {
    width: {
      ctor: "TextInput",
      label: "Width",
      required: true,
      index: 3,
      props: {
        change: function () {
          this.parent.parent.instance.width = this.value;
          this.parent.parent.instance.minWidth = this.value;
        },
      },
    },
  };

  Builder.metaProps.viewStack = {
    width: {
      ctor: "TextInput",
      label: "Width",
      required: true,
      index: 3,
      props: {
        change: function () {
          this.parent.parent.instance.width = this.value;
        },
      },
    },
    height: {
      ctor: "TextInput",
      label: "Height",
      required: true,
      index: 3,
      props: {
        change: function () {
          this.parent.parent.instance.height = this.value;
        },
      },
    },
  };

  Builder.metaProps.DateTimeCb = {
    value: {
      ctor: "TextInput",
      label: "Value",
      required: true,
      index: 3,
      props: {
        change: function () {
          this.parent.parent.instance.value = this.value;
        },
      },
    },
    mode: {
      ctor: "Select",
      label: "Display Mode",
      props: {
        //dataProvider: new ArrayEx([{value: "date", text: "Date"}, {value: "time", text: "Time"},{value: "datetime", text: "Datetime"}]),
        dataProvider: new ArrayEx(
          getMembersCollection(DateTimeMode, "text", "value")
        ),
        change: function () {
          this.parent.parent.instance.mode = this.value;
        },
      },
    },
  };

  Builder.metaProps.Form = {
    method: {
      ctor: "Select",
      label: "Method",
      index: 3,
      props: {
        dataProvider: new ArrayEx([
          { value: "GET", text: "GET" },
          { value: "POST", text: "POST" },
        ]),
        change: function () {
          this.parent.parent.instance.method = this.value;
        },
      },
    },
    action: {
      ctor: "TextInput",
      label: "Action",
      index: 4,
      props: {
        change: function () {
          this.parent.parent.instance.action = this.value;
        },
      },
    },
  };

  Builder.metaProps.Container = {
    type: {
      ctor: "Select",
      label: "Type",
      props: {
        dataProvider: new ArrayEx(
          getMembersCollection(ContainerType, "text", "value")
        ),
        change: function () {
          this.parent.parent.instance.type = this.value;
        },
      },
    },
    role: {
      ctor: "TextInput",
      label: "Role",
      props: {
        change: function () {
          this.parent.parent.instance.role = this.value;
        },
      },
    },
  };

  Builder.metaProps.WizardStep = {
    stepHeading: {
      ctor: "TextInput",
      label: "Step heading",
      required: true,
      index: 1,
      props: {
        change: function () {
          this.parent.parent.instance.stepHeading = this.value;
        },
      },
    },
    detailLabel: {
      ctor: "TextInput",
      label: "Step Detail",
      required: true,
      index: 2,
      props: {
        change: function () {
          this.parent.parent.instance.detailLabel = this.value;
        },
      },
    },
    id_form: {
      ctor: "AutoBrowse",
      label: "Select a Form",
      required: true,
      props: {
        valueField: "form_id",
        labelField: "form_name",
        dataProvider: Builder.forms,
        fields: [
          { field: "form_id", description: "form_id", visible: false },
          { field: "form_name", description: "form_name" },
        ],
        classes: ["no-form-control"],
        change: function () {
          //propsForm.children["dataProvider"].value
          //get the fields for the selected datProvider and
          //assign them to the labelField and valueField editor`s dataProvider property
          this.parent.parent.instance.id_form =
            this.value.length > 0 ? this.value[0][this.valueField] : undefined;
        },
      },
      index: 7,
      /**
       * by default the value of the propertyEditor is binded to the value of the property of the instance
       * by specifying a setter function you override this behavior. The return value of the function
       * will be the assigned to the property of the instance
       */
      setter: function () {
        if (this.id_form) {
          let m = ArrayUtils.getMatching(Builder.forms, "form_id", this.id_form);
          if (m.objects.length > 0) {
            return new ArrayEx(m.objects);
          }
        } else return new ArrayEx([]);
      },
    },
  };

  Builder.metaProps.Wizard = {
    components: {
      ctor: "Button",
      label: "Steps",
      index: 18,
      props: {
        label: "Manage Steps",
        classes: ["btn", "btn-secondary"],
        components: [
          {
            ctor: Label,
            props: {
              id: "fa",
              labelType: LabelType.i,
              classes: ["fas", "fa-list"],
            },
          },
        ],
        click: function (e) {
          let win = this.parent.parent.stepsEditModal;
          if (!win) {
            let lit = extend(true, Builder.components.Modal.literal);
            lit.props.id = "stepsEditModal";
            lit.props.title = "Edit Steps";
            let inst;
            let steps = this.parent.parent.instance.attr.steps;
            if (steps) {
              let len = steps.length;
              inst = new ArrayEx(len);
              for (let i = 0; i < len; i++) {
                inst[i] = new WizardStep(steps[i]);
              }
            } else {
              inst = new ArrayEx([]);
            }
            lit.props.components = [
              {
                ctor: CollectionEditor,
                props: {
                  id: "stepEditCollEditor",
                  memberType: "WizardStep",
                  instance: inst,
                },
              },
            ];
            lit.props.accept = function (e) {
              let stepEditCollEditor = this.proxyMaybe.modalDialog.modalContent
                .modalBody.stepEditCollEditor;
              this.parent.instance.attr.steps = ArrayUtils.acExtend(
                false,
                false,
                [],
                ["currentItem"],
                stepEditCollEditor.dataProvider
              );
            };
            win = this.parent.parent.addComponent(lit);
          }
          win.show();
        },
      },
    },
  };
};
