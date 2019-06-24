var ProgressBar=function(_props, overrided=false){

    Object.defineProperty(this, "label",
    {
        get:function label()
        {
            return _label;
        },
        set:function label(v)
        {
            if(_label !=v){
                _label=v;
                if(this.$el)
                    this.$el.html(v);
            }
        }
    });
   
    Object.defineProperty(this, "valueNow",
    {
        get:function valueNow()
        {
            return _valueNow;
        },
        set:function valueNow(v)
        {
            if(_valueNow !=v)
            {
                _valueNow =v;
                if(_valueNow ){
                    if(this.$el)
                    {
                        this.$el.attr('valueNow', _valueNow);
                        this.width = _valueNow+"%";
                    }
                }else
                {
                    if(this.$el){
                        this.$el.removeAttr('valueNow');
                        this.width = 0;
                    }
                }
            }
        }
    });

    Object.defineProperty(this, "valueMin",
    {
        get:function valueMin()
        {
            return _valueMin;
        },
        set:function valueMin(v)
        {
            if(_valueMin !=v)
            {
                _valueMin =v;
                if(_valueMin){
                    if(this.$el)
                    {
                        this.$el.attr('valueMin', _valueMin);
                    }
                }else
                {
                    if(this.$el){
                        this.$el.removeAttr('_valueMin');
                    }
                }
            }
        }
    });

    Object.defineProperty(this, "valueMax",
    {
        get:function valueMax(){
            return _valueMax;
        },
        set:function valueMax(v)
        {
            if(_valueMax!=v){
                _valueMax=v;
                if(_valueMax){
                    if(this.$el){
                        this.$el.attr('valueMax', _valueMax);
                    }
                }else
                {
                    if(this.$el)
                    {
                        this.$el.removeAttr('_valueMax');
                    }                
                }
            }
        }
    });
    
    var _defaultParams={
        label: "",
        role: "progressbar",
        valueNow: 25,
        valueMin: 0,
        valueMax: 100,
        classes:[ProgressBarStyle.PROGRESS],
        type: ContainerType.NONE
    };
    _props=extend(false,false,_defaultParams,_props);
    
    var _label,_valueNow,_valueMin,_valueMax;
    
    Container.call(this, _props);
    
    if(_props.label)
        this.label=_props.label;
    if(_props.valueNow)
        this.valueNow=_props.valueNow;
    if(_props.valueMin)
        this.valueMin=_props.valueMin;
    if(_props.valueMax)
        this.valueMax=_props.valueMax;
};
ProgressBar.prototype.ctor = 'ProgressBar';