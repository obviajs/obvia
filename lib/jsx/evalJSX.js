import JSXParser from "/obvia/lib/jsx/JSXParser.js";

let rComponent = /^(this|[A-Z])/
let cacheFns = {}
let cacheStr = {}

function evalJSX(str, obj, config) {
	let jsx = new Jsx(str, config)

	let output = jsx.init()
	if (!obj)
		obj = {}
	if (typeof anu === 'function')
		obj.anu = anu
	let args = 'let args0 = arguments[0];'
	for (let i in obj) {
		if (i !== 'this')
			args += 'let ' + i + ' = args0["' + i + '"];'
	}
	args += 'return ' + output
	try {
		let fn
		if (cacheFns[args]) {
			fn = cacheFns[args]
		} else {
			fn = cacheFns[args] = Function(args)
		}
		let a = fn.call(obj.this, obj)
		return a
	} catch (e) {
		console.log(e, args)
	}
}

let Jsx = function (input) {
	//1 object with ctor & props, 2 array, 3 simple object
	let properties = {"component": 1, "dataProvider": 1, "itemRenderer": 1, "itemEditor": 1, "columns": 2, "column":3};
		
	this.init = function() {
		if (typeof JSXParser === 'function') {
			let useCache = input.length < 720
			if (useCache && cacheStr[input]) {
				return cacheStr[input]
			}
			let array = (new JSXParser(input)).parse()


			let evalString = this.genChildren([array])
			if (useCache) {
				return cacheStr[input] = evalString
			}
			return evalString
		} else {
			throw 'need JSXParser https://github.com/RubyLouvre/jsx-parser'
		}
	};

	this.genTag = function(el) {
		let type = rComponent.test(el.type) ? el.type : JSON.stringify(el.type);
		let props = this.genProps(el);
		let str = '';
		if (properties[el.type] == null || properties[el.type] == 1)
			str = `{"ctor":"${el.type}", "props": ${props}}`;
		else if (properties[el.type] == 3)
			str = props;
		return str;
	};
	this.genProps = function (el) {
		let props = el.props;
		if (!props && !el.spreadAttribute) {
			return 'null'
		}
		let ret = '';
		for (let i in props) {
			ret += JSON.stringify(i) + ':' + this.genPropValue(props[i]) + ',\n'
		}
		let c = false;
		if (el.children.length > 0) {
			let len = el.children.length;
			let children = [];
			for (let i = 0; i < len; i++) {
				if (properties[el.children[i].type] == null) {
					children.push(el.children[i]);
				} else {
					if (properties[el.children[i].type] == 1) {
						ret += '"' + el.children[i].type + '": ' + this.genChildren(el.children[i].children, el) + ",";
						c = true;
					}
					else {
						ret += '"' + el.children[i].type + '": [' + this.genChildren(el.children[i].children, el) + ']' + ",";
						c = true;
					}
				}
			}
			if (children.length > 0) {
				ret += '"components": [' + this.genChildren(children, el) + ']' + ",";
				c = true;
			}
			if (c) {
				ret = ret.substring(0, ret.length - 1);
			}
		}
		ret = `{${ret}}`;

		if (el.spreadAttribute) {
			return 'Object.assign({},' + el.spreadAttribute + ',' + ret + ')'
		}
		return ret;
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
		let ret = [];
		for (let i = 0, el; el = children[i++];) {
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
