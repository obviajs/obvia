var ProgressBar=function(_props){

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
                if(_progressBar.$el)
                    _progressBar.$el.html(v);
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
                    if(_progressBar.$el)
                    {
                        _progressBar.$el.attr('valueNow', _valueNow);
                        _progressBar.width = _valueNow+"%";
                    }
                }else
                {
                    if(_progressBar.$el){
                        _progressBar.$el.removeAttr('valueNow');
                        _progressBar.width = 0;
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
                    if(_progressBar.$el)
                    {
                        _progressBar.$el.attr('valueMin', _valueMin);
                    }
                }else
                {
                    if(_progressBar.$el){
                        _progressBar.$el.removeAttr('_valueMin');
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
                    if(_progressBar.$el){
                        _progressBar.$el.attr('valueMax', _valueMax);
                    }
                }else
                {
                    if(_progressBar.$el)
                    {
                        _progressBar.$el.removeAttr('_valueMax');
                    }                
                }
            }
        }
    });
    
    Object.defineProperty(this, "progressBar",
    {
        get:function progressBar(){
            return _progressBar;
        },
        enumerable:false
    });

    let _progressBar;
    let _pbBeforeAttach = function(e){
        _progressBar = this;
        if(_props.label)
            this.label=_props.label;
        if(_props.valueNow)
            this.valueNow=_props.valueNow;
        if(_props.valueMin)
            this.valueMin=_props.valueMin;
        if(_props.valueMax)
            this.valueMax=_props.valueMax;
    }

    var _defaultParams={
        label: "",
        valueNow: 25,
        valueMin: 0,
        valueMax: 100,
        classes:["progress"],
        type: ContainerType.NONE,
        components:[
            {
                ctor: Container,
                props:{
                    id:"progressBar",
                    classes:[ProgressBarStyle.PROGRESS],
                    type: ContainerType.NONE,
                    role: "progressbar",
                    beforeAttach:_pbBeforeAttach
                }
            }
        ]
    };
    _props=extend(false,false,_defaultParams,_props);
    
    var _label,_valueNow,_valueMin,_valueMax;
    
    Container.call(this, _props);
};
ProgressBar.prototype.ctor = 'ProgressBar';