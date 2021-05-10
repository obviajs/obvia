import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";

var HRuleFactory = function (props) {
  this.xmlTemplate =
    "<break>" +
    '<reportElement x="{left}" y="{top}" width="{width}" height="{height}" mode="{mode}" uuid="{uuid}"/>' +
    "</break>";
  this.defaultParams = {
    left: 10,
    top: 10,
    width: 100,
    height: 100,
    uuid: StringUtils.guid(),
    backgroundColor: "",
    mode: "Opaque",
  };
  this.props = ObjectUtils.extend(this.defaultParams, props);

  if (props.transparent === "Opaque") {
    this.props.mode = "Opaque";
  } else if (props.transparent === "Transparent") {
    this.props.mode = "Transparent";
  }

  this.toXml = function () {
    return this.xmlTemplate.formatUnicorn(this.props);
  };
};
