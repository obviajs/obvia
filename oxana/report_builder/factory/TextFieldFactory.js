var TextFieldFactory = function (props) {
  this.xmlTemplate =
    "<textField>" +
    '<reportElement x="{x}" y="{y}" width="{width}" height="{height}" forecolor="{color}" backcolor="{backgroundColor}" mode="{mode}" uuid="{uuid}"/>' +
    "<textElement>" +
    '<font size="{fontSize}"/>' +
    "</textElement>" +
    "<textFieldExpression><![CDATA[{value}]]></textFieldExpression>" +
    "</textField>";

  this.defaultParams = {
    x: 10,
    y: 10,
    uuid: StringUtils.guid(),
    width: 100,
    height: 100,
    value: "Text Field",
    color: "",
    backgroundColor: "",
    fontSize: 16,
    mode: "Opaque",
  };
  this.props = extend(this.defaultParams, props);

  if (props.transparent === "Opaque") {
    this.props.mode = "Opaque";
  } else if (props.transparent === "Transparent") {
    this.props.mode = "Transparent";
  }

  if (props.fontSize === "") this.props.fontSize = 9;

  this.toXml = function () {
    return this.xmlTemplate.formatUnicorn(this.props);
  };
};
