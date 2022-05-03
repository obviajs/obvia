function oneObject(str)
{
    var obj = {}
    str.split(",").forEach(_ => obj[_] = true)
    return obj
}
var voidTag = oneObject("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr")
var specialTag = oneObject('xmp,style,script,noscript,textarea,template,#comment')

var hiddenTag = oneObject('style,script,noscript,template')

var JSXParser = function (a, f)
{
    if (!(this instanceof JSXParser))
    {
        return parse(a, f)
    }
    this.input = a
    this.getOne = f
}
JSXParser.prototype = {
    parse: function ()
    {
        return parse(this.input, this.getOne)
    }
}
var rsp = /\s/;
/**
 * 
 * 
 * @param {any} string 
 * @param {any} getOne returns only one node
 * @returns 
 */
function parse(string, getOne)
{
    getOne = (getOne === void 666 || getOne === true)
    let ret = lexer(string, getOne);
    if (getOne)
    {
        ret = typeof ret[0] === 'string' ? ret[1] : ret[0]
    }
    return ret;
}

function lexer(string, getOne)
{
    let tokens = [];
    let breakIndex = 120;
    let stack = [];
    let origString = string;
    let origLength = string.length;

    stack.last = function ()
    {
        return stack[stack.length - 1];
    }
    let ret = [];

    function addNode(node)
    {
        let p = stack.last();
        if (p && p.children)
        {
            p.children.push(node);
        } else
        {
            ret.push(node);
        }
    }

    let lastNode;
    do
    {
        if (--breakIndex === 0)
        {
            break;
        }
        let arr = getCloseTag(string);

        if (arr)
        { //Handling closing tags
            ++breakIndex;
            string = string.replace(arr[0], '');
            const node = stack.pop();
            //The following two special cases are handled:
            //1. option Element nodes are automatically removed and their nodeValues ​​are combined into new text nodes
            //2. table Will collect tr or text nodes that are not wrapped by thead, tbody, tfoot into a new tbody element
            if (node.type === 'option')
            {
                node.children = [{
                    type: '#text',
                    nodeValue: getText(node)
                }]
            } else if (node.type === 'table')
            {
                insertTbody(node.children);
            }
            lastNode = null;
            if (getOne && ret.length === 1 && !stack.length)
            {
                return [origString.slice(0, origLength - string.length), ret[0]];
            }
            continue;
        }

        arr = getOpenTag(string);
        if (arr)
        {
            ++breakIndex;
            string = string.replace(arr[0], '');
            let node = arr[1];
            addNode(node);
            let selfClose = !!(node.isVoidTag || specialTag[node.type]);
            if (!selfClose)
            { //Put here to add children
                stack.push(node);
            }
            if (getOne && selfClose && !stack.length)
            {
                return [origString.slice(0, origLength - string.length), node];
            }
            lastNode = node;
            continue;
        }

        let text = '';
        do
        {
            //Handling the case of <div><<<<<<div>
            const index = string.indexOf('<');
            if (index === 0)
            {
                text += string.slice(0, 1);
                string = string.slice(1);

            } else
            {
                break;
            }
        } while (string.length);
        //Handling the case of <div>{aaa}</div>,<div>xxx{aaa}xxx</div>,<div>xxx</div>{aaa}sss
        const index = string.indexOf('<'); //Determine if there is a label after it
        const bindex = string.indexOf('{');//Determine if there is jsx behind it
        const aindex = string.indexOf('}');

        let hasJSX = (bindex < aindex) && (index === -1 || bindex < index);
        if (hasJSX)
        {
            if (bindex !== 0)
            { //Collect text nodes before jsx
                text += string.slice(0, bindex);
                string = string.slice(bindex);
            }
            addText(lastNode, text, addNode);
            string = string.slice(1); //remove the front {
            let arr = parseCode(string);
            addNode(makeJSX(arr[1]));
            lastNode = false;
            string = string.slice(arr[0].length + 1);//remove the following }
        } else
        {
            if (index === -1)
            {
                text = string;
                string = '';
            } else
            {
                text += string.slice(0, index);
                string = string.slice(index);
            }
            ++breakIndex;
            addText(lastNode, text, addNode);
        }

    } while (string.length);
    return ret;
}


function addText(lastNode, text, addNode)
{
    if (/\S/.test(text))
    {
        if (lastNode && lastNode.type === '#text')
        {
            lastNode.text += text;
        } else
        {
            lastNode = {
                type: '#text',
                nodeValue: text
            }
            addNode(lastNode);
        }
    }
}

//It is used to parse the content in {}, if it encounters an unmatched }, it will return, and cut the content according to the tag
function parseCode(string)
{ // <div id={ function(){<div/>} }>
    let word = '', //used to match the preceding word
        braceIndex = 1,
        codeIndex = 0,
        nodes = [],
        quote,
        escape = false,
        state = 'code';
    for (let i = 0, n = string.length; i < n; i++)
    {
        let c = string.charAt(i),
            next = string.charAt(i + 1);
        switch (state)
        {
            case 'code':
                if (c === '"' || c === "'")
                {
                    state = 'string';
                    quote = c;
                } else if (c === '{')
                {
                    braceIndex++;
                } else if (c === '}')
                {
                    braceIndex--;
                    if (braceIndex === 0)
                    {
                        collectJSX(string, codeIndex, i, nodes);
                        return [string.slice(0, i), nodes];
                    }
                } else if (c === '<')
                {
                    let word = '',
                        empty = true,
                        index = i - 1;
                    do
                    {
                        c = string.charAt(index);
                        if (empty && rsp.test(c))
                        {
                            continue;
                        }
                        if (rsp.test(c))
                        {
                            break;
                        }
                        empty = false;
                        word = c + word;
                        if (word.length > 7)
                        { //performance optimization
                            break;
                        }
                    } while (--index >= 0);
                    let chunkString = string.slice(i);
                    if (word === '' || /(=>|return|\{|\(|\[|\,)$/.test(word) && /\<\w/.test(chunkString))
                    {
                        collectJSX(string, codeIndex, i, nodes);
                        let chunk = lexer(chunkString, true);
                        nodes.push(chunk[1]);
                        i += (chunk[0].length - 1); //Because < has been included, it needs to be subtracted by 1
                        codeIndex = i + 1;
                    }

                }
                break
            case 'string':
                if (c == '\\' && (next === '"' || next === "'"))
                {
                    escape = !escape;
                } else if (c === quote && !escape)
                {
                    state = 'code';
                }
                break;
        }

    }
}

function collectJSX(string, codeIndex, i, nodes)
{
    let nodeValue = string.slice(codeIndex, i)
    if (/\S/.test(nodeValue))
    { //put { the previous thing in
        nodes.push({
            type: '#jsx',
            nodeValue: nodeValue
        });
    }
}

let rtbody = /^(tbody|thead|tfoot)$/;

function insertTbody(nodes)
{
    let tbody = false;
    for (let i = 0, n = nodes.length; i < n; i++)
    {
        let node = nodes[i];
        if (rtbody.test(node.nodeName))
        {
            tbody = false;
            continue;
        }

        if (node.nodeName === 'tr')
        {
            if (tbody)
            {
                nodes.splice(i, 1);
                tbody.children.push(node);
                n--;
                i--;
            } else
            {
                tbody = {
                    nodeName: 'tbody',
                    props: {},
                    children: [node]
                };
                nodes.splice(i, 1, tbody);
            }
        } else
        {
            if (tbody)
            {
                nodes.splice(i, 1);
                tbody.children.push(node);
                n--;
                i--;
            }
        }
    }
}


function getCloseTag(string)
{
    if (string.indexOf("</") === 0)
    {
        let match = string.match(/\<\/(\w+)>/);
        if (match)
        {
            let tag = match[1];
            string = string.slice(3 + tag.length);
            return [match[0], {
                type: tag
            }];
        }
    }
    return null;
}

function getOpenTag(string)
{
    if (string.indexOf("<") === 0)
    {
        let i = string.indexOf('<!--') //Handling comment nodes
        if (i === 0)
        {
            let l = string.indexOf('-->');
            if (l === -1)
            {
                thow('Comment node is not closed' + string.slice(0, 100));
            }
            let node = {
                type: '#comment',
                nodeValue: string.slice(4, l)
            };

            return [string.slice(0, l + 3), node];
        }
        let match = string.match(/\<(\w[^\s\/\>]*)/); //Process element nodes
        if (match)
        {
            let leftContent = match[0],
                tag = match[1];
            let node = {
                type: tag,
                props: {},
                children: []
            };

            string = string.replace(leftContent, ''); //Remove the tag name (rightContent)
            let arr = getAttrs(string); //Handling properties
            if (arr)
            {
                node.props = arr[1];
                string = string.replace(arr[0], '');
                leftContent += arr[0];
            }

            if (string[0] === '>')
            { //Handling open label delimiters
                leftContent += '>';
                string = string.slice(1);
                if (voidTag[node.type])
                {
                    node.isVoidTag = true;
                }
            } else if (string.slice(0, 2) === '/>')
            { //Handling open label delimiters
                leftContent += '/>';
                string = string.slice(2);
                node.isVoidTag = true;
            }

            if (!node.isVoidTag && specialTag[tag])
            { //If it is script, style, xmp and other elements
                let closeTag = '</' + tag + '>';
                let j = string.indexOf(closeTag);
                let nodeValue = string.slice(0, j);
                leftContent += nodeValue + closeTag;
                node.children.push({
                    type: '#text',
                    nodeValue: nodeValue
                });
            }

            return [leftContent, node];
        }
    }
}

function getText(node)
{
    let ret = '';
    node.children.forEach(function (el)
    {
        if (el.type === '#text')
        {
            ret += el.nodeValue
        } else if (el.children && !hiddenTag[el.type])
        {
            ret += getText(el);
        }
    })
    return ret;
}

function getAttrs(string)
{
    let state = 'AttrNameOrJSX',
        attrName = '',
        attrValue = '',
        quote,
        escape,
        props = {};

    for (let i = 0, n = string.length; i < n; i++)
    {
        let c = string[i];
        switch (state)
        {
            case 'AttrNameOrJSX':
                if (c === '/' || c === '>')
                {
                    return [string.slice(0, i), props];
                }
                if (rsp.test(c))
                {
                    if (attrName)
                    {
                        state = 'AttrEqual';
                    }
                } else if (c === '=')
                {
                    if (!attrName)
                    {
                        throw 'property name must be specified';
                    }
                    state = 'AttrQuoteOrJSX';
                } else if (c === '{')
                {
                    state = 'SpreadJSX';
                } else
                {
                    attrName += c;
                }
                break;
            case 'AttrEqual':
                if (c === '=')
                {
                    state = 'AttrQuoteOrJSX'
                }
                break
            case 'AttrQuoteOrJSX':
                if (c === '"' || c === "'")
                {
                    quote = c;
                    state = 'AttrValue';
                    escape = false;;
                } else if (c === '{')
                {
                    state = 'JSX';
                }
                break;
            case 'AttrValue':
                if (c === '\\')
                {
                    escape = !escape;
                }
                if (c !== quote)
                {
                    attrValue += c;
                } else if (c === quote && !escape)
                {
                    props[attrName] = attrValue;
                    attrName = attrValue = '';
                    state = 'AttrNameOrJSX';
                }
                break;
            case 'SpreadJSX':
                i += 3;
            case 'JSX':

                let arr = parseCode(string.slice(i));
                i += arr[0].length;

                props[state === 'SpreadJSX' ? 'spreadAttribute' : attrName] = makeJSX(arr[1]);
                attrName = attrValue = '';
                state = 'AttrNameOrJSX';
                break;
        }
    }
    throw 'Tabs must be closed';
}

function makeJSX(JSXNode)
{
    return JSXNode.length === 1 && JSXNode[0].type === '#jsx' ? JSXNode[0] : { type: '#jsx', nodeValue: JSXNode };
}

export default JSXParser;