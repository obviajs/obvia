var Spacing = function(_props, $el)
{  
    this.setClass = function(className, v, max = 13)
    {
        if(v=="auto"||!isNaN(v))
        {
            var classArr = [];
            for(var i=0;i<=max;i++)
            {
                classArr.push(className+i);       
            }
            var _classes = classArr.join(" ");
            _$el.removeClass(_classes);
            _$el.addClass(className + v);
        }
    }
    Object.defineProperty(this, "colSpan", 
    {
        get: function colSpan() 
        {
            return _colSpan;
        },
        set: function colSpan(v) 
        {
            if(_colSpan != v)
            {
                _colSpan = v;
                if(_$el && v!=null)
                {
                    this.setClass('col-sm-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });
    
    Object.defineProperty(this, "offset", 
    {
        get: function offset() 
        {
            return _offset;
        },
        set: function offset(v) 
        {
            if(_offset != v)
            {
                _offset = v;
                if(_$el && v!=null)
                {
                    this.setClass('col-sm-offset-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "mb", 
    {
        get: function mb() 
        {
            return _mb;
        },
        set: function mb(v) 
        {
            if(_mb != v)
            {
                _mb = v;
                if(_$el && v!=null)
                {
                    this.setClass('mb-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "mt", 
    {
        get: function mt() 
        {
            return _mt;
        },
        set: function mt(v) 
        {
            if(_mt != v)
            {
                _mt = v;
                if(_$el && v!=null)
                {
                    this.setClass('mt-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "ml", 
    {
        get: function ml() 
        {
            return _ml;
        },
        set: function ml(v) 
        {
            if(_ml != v)
            {
                _ml = v;
                if(_$el && v!=null)
                {
                    this.setClass('ml-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "mr", 
    {
        get: function mr() 
        {
            return _mr;
        },
        set: function mr(v) 
        {
            if(_mr != v)
            {
                _mr = v;
                if(_$el && v!=null)
                {
                    this.setClass('mr-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "mx", 
    {
        get: function mx() 
        {
            return _mx;
        },
        set: function mx(v) 
        {
            if(_mx != v)
            {
                _mx = v;
                if(_$el && v!=null)
                {
                    this.setClass('mx-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "my", 
    {
        get: function my() 
        {
            return _my;
        },
        set: function my(v) 
        {
            if(_my != v)
            {
                _my = v;
                if(_$el && v!=null)
                {
                    this.setClass('my-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "pb", 
    {
        get: function pb() 
        {
            return _pb;
        },
        set: function pb(v) 
        {
            if(_pb != v)
            {
                _pb = v;
                if(_$el && v!=null)
                {
                    this.setClass('pb-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "pt", 
    {
        get: function pt() 
        {
            return _pt;
        },
        set: function pt(v) 
        {
            if(_pt != v)
            {
                _pt = v;
                if(_$el && v!=null)
                {
                    this.setClass('pt-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "pl", 
    {
        get: function pl() 
        {
            return _pl;
        },
        set: function pl(v) 
        {
            if(_pl != v)
            {
                _pl = v;
                if(_$el && v!=null)
                {
                    this.setClass('pl-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "pr", 
    {
        get: function pr() 
        {
            return _pr;
        },
        set: function pr(v) 
        {
            if(_pr != v)
            {
                _pr = v;
                if(_$el && v!=null)
                {
                    this.setClass('pr-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "px", 
    {
        get: function px() 
        {
            return _px;
        },
        set: function px(v) 
        {
            if(_px != v)
            {
                _px = v;
                if(_$el && v!=null)
                {
                    this.setClass('px-', v);
                }
            }
        },
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "py", 
    {
        get: function py() 
        {
            return _py;
        },
        set: function py(v) 
        {
            if(_py != v)
            {
                _py = v;
                if(_$el && v!=null)
                {
                    this.setClass('py-', v);
                }
            }
        }, 
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "p", 
    {
        get: function p() 
        {
            return _p;
        },
        set: function p(v) 
        {
            if(_p != v)
            {
                _p = v;
                if(_$el && v!=null)
                {
                    this.setClass('p-', v);
                }
            }
        }, 
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "m", 
    {
        get: function m() 
        {
            return _m;
        },
        set: function m(v) 
        {
            if(_m != v)
            {
                _m = v;
                if(_$el && v!=null)
                {
                    this.setClass('m-', v);
                }
            }
        }, 
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "mw", 
    {
        get: function mw() 
        {
            return _mw;
        },
        set: function mw(v) 
        {
            if(_mw != v)
            {
                _mw = v;
                if(_$el && v!=null)
                {
                    this.setClass('mw-', v, 100);
                }
            }
        }, 
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "w", 
    {
        get: function w() 
        {
            return _w;
        },
        set: function w(v) 
        {
            if(_w != v)
            {
                _w = v;
                if(_$el && v!=null)
                {
                    this.setClass('w-', v, 100);
                }
            }
        }, 
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "mh", 
    {
        get: function mh() 
        {
            return _mh;
        },
        set: function mh(v) 
        {
            if(_mh != v)
            {
                _mh = v;
                if(_$el && v!=null)
                {
                    this.setClass('mh-', v, 100);
                }
            }
        }, 
        configurable: true,
        enumerable:true
    });

    Object.defineProperty(this, "h", 
    {
        get: function h() 
        {
            return _h;
        },
        set: function h(v) 
        {
            if(_h != v)
            {
                _h = v;
                if(_$el && v!=null)
                {
                    this.setClass('h-', v, 100);
                }
            }
        }, 
        configurable: true,
        enumerable:true
    });
//mx-auto, my-auto
    var _$el = $el;
    var _offset, _colSpan, _mb, _mt, _ml, _mr, _mx, _my, _pb, _pt, _pl, _pr, _px, _py, _mw, _mh, _w, _h, _m, _p;
    if (_props)
    {
        var pArr = ['offset', 'colSpan', 'm', 'mb', 'mt', 'ml', 'mr', 'mx', 'my', 'p', 'pb', 'pt', 'pl', 'pr', 'px', 'py', 'mw', 'mh', 'w', 'h'];
        for(var i=0;i<pArr.length;i++)
        {
            var prop = pArr[i];
            if (_props[prop] !=null)
                this[prop] = _props[prop];
        }       
    }
}