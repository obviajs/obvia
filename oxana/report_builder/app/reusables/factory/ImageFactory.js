import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";
var ImageFactory = function (props) {
    this.xmlTemplate = '<image>' +
        '<reportElement x="{x}" y="{y}" width="{width}" height="{height}" uuid="{uuid}"/>' +
        '<imageExpression><![CDATA["{src}"]]></imageExpression>' +
        '</image>';
    this.defaultParams = {
        "x": 10,
        "y": 10,
        "uuid": StringUtils.guid(),
        "width": 100,
        "height": 100,
        "src": ""
    };
    this.props = ObjectUtils.extend(this.defaultParams, props);

    this.toXml = function () {
        return this.xmlTemplate.formatUnicorn(this.props);
    }
};
export {
    ImageFactory
};