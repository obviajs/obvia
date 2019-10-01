var ScrollPane = function(_props)
{
    var _defaultParams = {
        type: ContainerType.NONE,
    };
    _props = extend(false, false, _defaultParams, _props);
    Container.call(this, _props, true, true);
};
ScrollPane.prototype.ctor = 'ScrollPane';