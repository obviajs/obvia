var TextFieldFactory = function(props){
    this.xmlTemplate = '<textField>'+
				'<reportElement x="{x}" y="{y}" width="{width}" height="{height}" uuid="{uuid}"/>'+
				'<textFieldExpression><![CDATA[{value}]]></textFieldExpression>'+
            '</textField>';
    this.defaultParams={
        "x": 10,
        "y": 10,
        "uuid":StringUtils.guid(),
        "width":100,
        "height":100,
        "value": "Text Field"
    };
    this.props = extend(this.defaultParams, props);

    this.toXml = function()
    {
        return this.xmlTemplate.formatUnicorn(this.props);
    }
}