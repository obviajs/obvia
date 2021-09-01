import JSXParser from "/obvia/lib/jsx/JSXParser.js";

var rComponent = /^(this|[A-Z])/
var cacheFns = {}
var cacheStr = {}

function evalJSX(str, obj, config) {
	var jsx = new Jsx(str, config)

	var output = jsx.init()
	if (!obj)
		obj = {}
	if (typeof anu === 'function')
		obj.anu = anu
	var args = 'var args0 = arguments[0];'
	for (var i in obj) {
		if (i !== 'this')
			args += 'var ' + i + ' = args0["' + i + '"];'
	}
	args += 'return ' + output
	try {
		var fn
		if (cacheFns[args]) {
			fn = cacheFns[args]
		} else {
			fn = cacheFns[args] = Function(args)
		}
		var a = fn.call(obj.this, obj)
		return a
	} catch (e) {
		console.log(e, args)
	}
}

var Jsx = function(input) {
	this.init = function() {

		if (typeof JSXParser === 'function') {
			var useCache = input.length < 720
			if (useCache && cacheStr[input]) {
				return cacheStr[input]
			}
			var array = (new JSXParser(input)).parse()


			var evalString = this.genChildren([array])
			if (useCache) {
				return cacheStr[input] = evalString
			}
			return evalString
		} else {
			throw 'need JSXParser https://github.com/RubyLouvre/jsx-parser'
		}

	};
	this.genTag = function(el) {
		var type = rComponent.test(el.type) ? el.type : JSON.stringify(el.type)
		return `{
					"ctor":"` + el.type + `",`+
			`"props": ` + this.genProps(el) + `}`;
	};
	this.genProps = function (el) {
		let props = el.props;
		var children = this.genChildren(el.children, el);
		
		if (!props && !el.spreadAttribute) {
			return 'null'
		}
		var ret = '{'
		for (var i in props) {
			ret += JSON.stringify(i) + ':' + this.genPropValue(props[i]) + ',\n'
		}
		ret += '"components": [' + (children!=null?children:'') + ']'
			+ '}'
		if (el.spreadAttribute) {
			return 'Object.assign({},' + el.spreadAttribute + ',' + ret + ')'
		}
		return ret
	};
	this.genPropValue = function(val) {
		if (typeof val === 'string') {
			return JSON.stringify(val)
		}
		if (val) {
			if (Array.isArray(val.nodeValue)) {
				return this.genChildren(val.nodeValue)
			}
			if (val) {
				return val.nodeValue
			}
		}
	};
	this.genChildren = function(children, obj, join) {
		if (obj) {
			if (!obj.isVoidTag && !obj.children.length) {
				return ''
			}
		}
		var ret = [];
		for (var i = 0, el; el = children[i++];) {
			if (el.type === '#jsx') {
				if (Array.isArray(el.nodeValue)) {
					ret[ret.length] = this.genChildren(el.nodeValue, null, ' ')
				} else {
					ret[ret.length] = el.nodeValue
				}
			} else if (el.type === '#text') {
				ret[ret.length] = JSON.stringify(el.nodeValue)
			} else if (el) {
				ret[ret.length] = this.genTag(el)
			}
		}
		return ret.join(join || ',')
	};
};

export {
	evalJSX
};
