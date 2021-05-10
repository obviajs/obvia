import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";

var StaticTextFactory = function (props) {
  this.xmlTemplate =
    "<staticText>" +
    '<reportElement mode="{mode}" x="{x}" y="{y}" width="{width}" height="{height}" forecolor="{color}" backcolor="{backgroundColor}" uuid="{uuid}"/>' +
    '<textElement rotation="{rotation}">' +
    '<font size="{fontSize}" fontName="{fontName}" isBold="{is_bold}" isItalic="{is_italic}" isUnderline="{is_underline}" isStrikeThrough="{is_strike_through}"/>' +
    "</textElement>" +
    "<text><![CDATA[{label}]]></text>" +
    "</staticText>";
  this.defaultParams = {
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    uuid: StringUtils.guid(),
    backgroundColor: "#f7f9fc",
    color: "#000205",
    mode: "Opaque",
    rotation: "None",
    fontSize: 9,
    fontName: "",
    is_bold: false,
    is_italic: false,
    is_underline: false,
    is_strike_through: false,
    label: "Static Text",
  };
  this.props = ObjectUtils.extend(this.defaultParams, props);

  if (props.transparent === "Opaque") {
    this.props.mode = "Opaque";
  } else if (props.transparent === "Transparent") {
    this.props.mode = "Transparent";
  }

  if (props.fontSize === "") this.props.fontSize = 9;

  if (!(props.label && props.label.length > 0)) this.props.label = "Static Text";

  this.toXml = function () {
    return this.xmlTemplate.formatUnicorn(this.props);
  };
};
export {
  StaticTextFactory
};