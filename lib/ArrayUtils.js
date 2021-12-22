
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";
var ArrayUtils = {};
/**
 * Filter items in an array collection with hierarchical elements
 * @param {*[]} collection the array collection you want to count items of
 * @param {string} key the property that contains the children of the hierarchy
 * @returns {Function} callback The callback to excute for each element
 */
ArrayUtils.hierarchyFilter = function (collection, key = 'children', callback)
{
    if (collection && collection.length)
    {
        collection = collection.filter(callback);
        for (let i = 0; i < collection.length; i++)
        {
            let childAc = ObjectUtils.getChainValue(collection[i], key);
            if (childAc)
            {
                let v = ArrayUtils.hierarchyFilter(childAc, key, callback);
                ObjectUtils.setChainValue(collection[i], key, v);
            }
        }
    }
    return collection;
}
/**
 * Map items in an array collection with hierarchical elements
 * @param {*[]} ac the array collection you want to count items of
 * @param {string} key the property that contains the children of the hierarchy
 * @returns {Function} callback The callback to excute for each element
 */
ArrayUtils.hierarchyMap = function (ac, key = 'children', callback)
{
    let collection = ac;
    if (ObjectUtils.isObject(ac))
    {
        callback(ac);
        collection = ObjectUtils.getChainValue(ac, key);
    }
    if (collection)
    {
        for (let i = 0; i < collection.length; i++)
        {
            callback(collection[i]);
            let childAc = ObjectUtils.getChainValue(collection[i], key);
            if (childAc)
            {
                ArrayUtils.hierarchyMap(childAc, key);
            }
        }
    }
    return ac;
}
/**
 * Count items in a array collection with hierarchical elements
 * @param {*[]} ac the array collection you want to count items of
 * @param {string} childrenproperty the property that contains the children of the hierarchy
 * @returns {Number} count Count of elements
 */
ArrayUtils.countItems = function (ac, childrenproperty = 'children')
{
    var count = 0,
        collection = ac;
    if (ObjectUtils.isObject(ac))
    {
        ++count;
        collection = ac[childrenproperty];
    }
    for (var i = 0; i < collection.length; i++)
    {
        if (collection[i][childrenproperty])
        {
            count += ArrayUtils.countItems(collection[i][childrenproperty], childrenproperty);
        }

    }
    return count + collection ? collection.length : 0;
}
/**
 * Find the parent of an element in a array collection with hierachical elements
 * @param {*[]} collection the array collection to search for the parent
 * @param {object} child the element to find the parent for
 * @param {string} childrenproperty the property that contains the children of the hierarchy
 * @param {string} key the property path you want to test for equality
 * @returns {object} The parent of child, null if no parent was found
 */
ArrayUtils.findParent = function (collection, child, childrenproperty = 'children', key, minDepth = 0, maxDepth = 999, depth = 0)
{
    if (ObjectUtils.isObject(collection))
    {
        collection = collection[childrenproperty];
    }
    let len = collection.length;
    if (minDepth <= depth)
    {
        for (let i = 0; i < len; i++)
        {
            if (ObjectUtils.getChainValue(child, key) == ObjectUtils.getChainValue(collection[i], key))
            {
                return collection;
            }
        }
    }
    if (maxDepth >= depth)
    {
        for (let i = 0; i < len; i++)
        {
            if (collection[i][childrenproperty])
            {
                let found = ArrayUtils.findParent(collection[i][childrenproperty], child, childrenproperty, key, minDepth, maxDepth, ++depth);
                if (found != null)
                    return collection[i];
            }
        }
    }
    return null;
};

/**
 * Search through an object hierachy Ex: {id:1, children:[{id:2}, {id:3, children:[]}]} for an object having a property path match the specified value 
 * @param {object} object the object hierarchy
 * @param {string|string[]} key the property path you want to test for equality 
 * @param {*|*[]} matchingValue the value or array of values you want to check against 
 * @param {string} childrenproperty the property that contains the children of the hierarchy
 * @returns {object} result, an object with chain and match properties. chain is the property chain to locate the match and match is the matched object itself
 */
ArrayUtils.objectHierarchyGetMatchingMember = function (object, key, matchingValue, childrenpropertypath = 'children', returnAllMatches = false, minDepth = 0, maxDepth = 1000, chain = null, cDepth = 0)
{
    if (!chain)
        chain = [];
    if (cDepth == null)
    {
        cDepth = 0;
    }
    let all = [];
    let ret = {
        "chain": chain,
        "match": null
    };
    if (cDepth >= minDepth && cDepth < maxDepth)
    {
        let val = ObjectUtils.getChainValue(object, key);
        if (val == matchingValue || (Array.isArray(matchingValue) && matchingValue.indexOf(val) > -1))
        {
            ret = {
                "chain": chain,
                "match": object,
                "depth": cDepth
            };
            if (!returnAllMatches)
                return ret;
            else
                all.push(ret);
        }
    }
    ++cDepth;
    chain.splicea(chain.length, 0, ObjectUtils.parseObjectPathExpression(childrenpropertypath));
    let cchain = chain.slice(0);
    let toExplore = ObjectUtils.getChainValue(object, childrenpropertypath);
    for (var mid in toExplore)
    {
        let member = toExplore[mid];
        if (cDepth < maxDepth)
        {
            let val = ObjectUtils.getChainValue(member, key);
            if (val == matchingValue)
            {
                chain.push(mid);
                let mchain = chain.slice(0);
                if (!returnAllMatches)
                {
                    ret = {
                        "chain": chain,
                        "match": val,
                        "depth": cDepth
                    };
                    break;
                } else
                    all.splicea(all.length, 0, val);
            }
        }
    }
    for (var mid in toExplore)
    {
        let member = toExplore[mid];
        cchain.push(mid);
        let mchain = cchain.slice(0);
        let tmp = ArrayUtils.objectHierarchyGetMatchingMember(member, key, matchingValue, childrenpropertypath, returnAllMatches, minDepth, maxDepth, mchain, cDepth);
        if (tmp != null && tmp.match)
        {
            if (!returnAllMatches)
            {
                ret = tmp;
                break;
            } else
                all.splicea(all.length, 0, tmp);
        }
    }
    return returnAllMatches ? all : ret;
}


/**
 * Search through an object hierachy Ex: {id:1, children:[{id:2}, {id:3, children:[]}]} for an object having a property path match the specified value 
 * @param {object} object the object hierarchy
 * @param {string|string[]} key the property path you want to test for equality 
 * @param {*} matchingValue the value you want to check against 
 * @param {string} childrenproperty the property that contains the children of the hierarchy
 * @returns {object} result, an object with chain and match properties. chain is the property chain to locate the match and match is the matched object itself
 */
ArrayUtils.objectHierarchyGetMatching = function (object, key, matchingValue, childrenproperty = 'children', minDepth = 0, maxDepth = 1000, chain = null, cDepth = 0)
{
    if (!chain)
        chain = [];
    if (cDepth == null)
    {
        cDepth = 0;
    }
    let ret = {
        "chain": chain,
        "match": null
    };
    chain.splicea(chain.length, 0, [childrenproperty]);
    if (cDepth > minDepth && cDepth < maxDepth && ObjectUtils.getChainValue(object, key) == matchingValue)
    {
        ret = {
            "chain": chain,
            "match": object,
            "depth": cDepth
        };
    } else if (object[childrenproperty] && cDepth < maxDepth)
    {
        ++cDepth;
        let tmp = ArrayUtils.objectHierarchyGetMatching(object[childrenproperty], key, matchingValue, childrenproperty, minDepth, maxDepth, chain, cDepth);
        if (tmp != null) return {
            "chain": chain,
            "match": tmp.match,
            "depth": cDepth
        };
    }
    return ret;
}

/**
 * Return an array containing only the values|objects found at key property chain for each collection member
 * @param {object[]} collection the object hierarchy
 * @param {string|string[]} key the property path you want to test for equality 
 * @returns {object[]} result, a collection of values|objects found at key property chain for each collection member
 */
ArrayUtils.arrayFromKey = function (collection, key)
{
    let len = collection.length;
    let ac = new Array(len);
    for (var i = 0; i < len; i++)
    {
        ac[i] = ObjectUtils.getChainValue(collection[i], key);
    }
    return ac;
}

/**
 * Search through a collection of object hierachies Ex: [{id:1, children:[{id:2}, {id:3, children:[]}]}] for an object having a property path match the specified value 
 * @param {object[]} collection the object hierarchy
 * @param {string|string[]} key the property path you want to test for equality 
 * @param {*} matchingValue the value you want to check against 
 * @param {string} childrenproperty the property that contains the children of the hierarchy
 * @returns {object} result, an object with chain and match properties. chain is the property chain to locate the match and match is the matched object itself
 */
ArrayUtils.arrayHierarchyGetMatching = function (collection, key, matchingValue, childrenproperty = 'children')
{
    for (var i = 0; i < collection.length; i++)
    {
        var node = collection[i];
        if (ObjectUtils.getChainValue(node, key) == matchingValue) return node;
        if (node[childrenproperty])
        {
            var tmp = ArrayUtils.arrayHierarchyGetMatching(node[childrenproperty], key, matchingValue, childrenproperty);
            if (tmp != null) return tmp;
        }
    }
    return null;
}

ArrayUtils.median = function (list)
{
    list.sort((a, b) => a - b);
    let listlength = list.length;
    if (listlength % 2)
    {
        let odd = (listlength / 2 - .5);
        return list[odd];
    } else
    {
        let even = (list[listlength / 2]);
        even += (list[listlength / 2 + 1]);
        even = (even / 2);
        return even;
    }
};
ArrayUtils.mean = function (list)
{
    let average = 0, len = list.length;
    for (let i = 0; i < len; i++)
    {
        average += list[i];
    }
    average = Math.round(average / len);
    return average;
};
ArrayUtils.min = function (list)
{
    let min = Infinity, len = list.length;
    for (let i = 0; i < len; i++)
    {
        if (list[i] < min)
        {
            min = list[i];
        }
    }
    return min;
};

var SortDirection = {
    "ASC": 1,
    "DESC": -1
};
/**
 * Sort and array collection 
 * For such case this method may come in handy
 * @param {*[]} the array collection you want to sort
 * @param {string|string[]} key object property chain to be used for sorting
 * @paramt {SortDirection} direction SortDirection you to sort the array collection, default is Ascending
 * @returns {object[]} the created array
 */
ArrayUtils.acSort = function (ac, key, direction = 1)
{
    return ac.sort(function (a, b)
    {
        let c = -1;
        if (((key && ObjectUtils.getChainValue(a, key) >= ObjectUtils.getChainValue(b, key)) || (!key && a >= b)) && direction == 1)
        {
            c = 1;
        }
        return c;
    });
}
/**
 * Create an array from an iterator type. Ex:arguments is an iterator, but you may not use array methods on it. 
 * For such case this method may come in handy
 * @param {[]} the iterator to create an array from
 * @returns {object[]} the created array
 */
Array.fromIterator = function (iterator)
{
    var a = [];
    for (var i = 0; i < iterator.length; i++)
    {
        a.splice(a.length, 0, iterator[i]);
    }
    return a;
};
/**
 * Search for an object matchin key to matchinValue and return its index
 * @param {*[]} ac the object collection to search
 * @param {string|string[]} key object property chain to be used for matching with matchingValue.
 * @param {*} matchingValue the value you want to test equality for potential matches.
 * @param {Number} startAt, the index where to start the search for a match
 * @returns {Number} index, the index of the found match
 */
ArrayUtils.indexOfObject = function (ac, key, matchingValue, startAt, backWards = false)
{
    let i = startAt || 0;
    let index = -1;
    let found = false;
    if (ac != null)
    {
        let len = ac.length;
        while (!found && ((!backWards && i < len) || (backWards && i >= 0)))
        {
            if (ac[i] != null && (ObjectUtils.getChainValue(ac[i], key) == matchingValue))
            {
                index = i;
                found = true;
            }
            i = i + (backWards ? -1 : 1);
        }
    }
    return index;
}
/**
 * Look for matching objects in a object collection
 * @param {*[]} ac the object collection to search
 * @param {string|string[]} key object property chain to be used for matching with matchingValue.
 * @param {*} matchingValue the value you want to test equality for potential matches.
 * @param {Boolean} stopAtFirstOcurrence, whether to stop or not when the first match is found
 * @returns {object} matching, and object with objects and indices members both arrays holding matches and their corresponding indices
 */
ArrayUtils.getMatching = function (ac, key, matchingValue, stopAtFirstOcurrence)
{
    var i = 0;
    var matching = {
        objects: [],
        indices: []
    };
    var found = false;
    if (typeof (matchingValue) === "object" && !(matchingValue instanceof Array))
    {
        matchingValue = ObjectUtils.getChainValue(matchingValue, key);
    }
    if (matchingValue != null)
    {
        stopAtFirstOcurrence = stopAtFirstOcurrence == null ? false : stopAtFirstOcurrence;
        if (ac != null)
        {
            while ((!found || !stopAtFirstOcurrence) && i < ac.length)
            {
                if (ac[i] != null && (ObjectUtils.getChainValue(ac[i], key) == matchingValue))
                {
                    matching.objects.push(ac[i]);
                    matching.indices.push(i);
                    found = true;
                }
                i++;
            }
        }
    } else
        console.log("You have not provided a valid matchingValue parameter (if you provided an object it should contain '" + key + "' property).");
    return matching;
}
/**
 * Test if passed variable is an array
 * @param {object} arg the object that you want to test
 * @returns {Boolean} result, true if passed variable is an array
 */
if (!Array.isArray)
{
    Array.isArray = function (arg)
    {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
/**
 * Pad this array with the provided element
 * @param {object} obj the object you want to pad the array with
 * @param {Number} count the count you want to pad the array with 
 * @param {Number} startIndex the index you want to start padding from.
 * @param {Boolean} deepCopy whether to pad the array with clones of obj or the same instance of obj.
 */
if (!Array.prototype.pad)
{
    Object.defineProperty(Array.prototype, 'pad', {
        value: function (obj, count, startIndex = null, deepCopy = true)
        {
            if (!startIndex)
            {
                startIndex = this.length;
                var arr = [];
                for (var i = 0; i < count; i++)
                {
                    arr.push(ObjectUtils.extend(deepCopy, obj));
                }
                this.splicea(startIndex, 0, arr);
            }
            return this;
        }
    });
}

if (!Array.prototype.includes)
{
    Object.defineProperty(Array.prototype, 'includes', {
        value: function (searchElement, fromIndex)
        {

            if (this == null)
            {
                throw new TypeError('"this" is null or not defined');
            }

            // 1. Let O be ? ToObject(this value).
            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0)
            {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y)
            {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len)
            {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement))
                {
                    return true;
                }
                // c. Increase k by 1. 
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}
/**
 * Get the intersection elements of two arrays
 * @param {*[]} a the collection to intersect
 * @param {*[]} b the collection to intersect
 * @returns {*[]} result the elements contained in both a and b collections
 */
ArrayUtils.intersect = function (a, b)
{
    var d = {};
    var results = [];
    for (var i = 0; i < b.length; i++)
    {
        d[b[i]] = true;
    }
    for (var j = 0; j < a.length; j++)
    {
        if (d[a[j]])
            results.push(a[j]);
    }
    return results;
};

/**
 * Get the intersection elements of two arrays given the key field or property chain to match
 * @param {*[]} a the collection to intersect
 * @param {*[]} b the collection to intersect
 * @param {string|string[]} key object property chain to be used for testing the uniqueness of the member objects.
 * @returns {*[]} result the elements contained in both a and b collections
 */
ArrayUtils.intersectOnKeyMatch = function (a, b, key)
{
    var d = {};
    var results = [];
    for (var i = 0; i < b.length && ObjectUtils.getChainValue(b[i], key) != null; i++)
    {
        d[b[i][key]] = true;
    }
    for (var j = 0; j < a.length && ObjectUtils.getChainValue(a[j], key) != null; j++)
    {
        if (d[ObjectUtils.getChainValue(a[j], key)])
            results.push(a[j]);
    }
    return results;
}
if (Array.prototype.last)
    console.warn("Overriding existing Array.prototype.last. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
/**
 * Return the last element of this array
 * @returns {*} result the last element of the array
 */
Array.prototype.last = function ()
{
    let last = null;
    if (this.length > 0)
    {
        last = this[this.length - 1];
    }
    return last;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "last", {
    enumerable: false
});

// Warn if overriding existing method
if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
/**
 * Check if this array is equal or contains the same/similiar elements to the one provided
 * @param {*[]} array the collection to check if is the same or has same/similiar elements to this 
 * @returns {Boolean} result true if arrays are the same object or have same/similiar elements
 */
Array.prototype.equals = function (array, matchAllKeys = false)
{
    // if the other array is a falsy value, return
    if (!array)
        return false;
    if (this === array)
        return true;
    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++)
    {
        // Check if we have nested arrays
        if (this[i] && this[i].forEach != null && array[i] && array[i].forEach != null)
        {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        } else if (ObjectUtils.isObject(this[i]) && ObjectUtils.isObject(array[i]))
        {
            var match = ObjectUtils.deepEqual(this[i], array[i], matchAllKeys);
            if (!match)
                return false;
        } else if (this[i] != array[i])
        {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {
    enumerable: false
});

if (Array.prototype.difference)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
/**
 * Return all objects from this array that are not found on a2. 
 * If bidirectional param is set to true then, also return objects from a2 that are not found on this array
 * @param {object[]} a2 the collection to check for this array elements presence
 * @param {Boolean} bidirectional Perform bidirectional difference or not
 * @returns {object[]} result collection of elements from this array not present on a2 and viceversa if bidirectional is set to true
 */
Array.prototype.difference = function (a2, bidirectional)
{
    // if the other array is a falsy value, return
    if (!a2 || a2.length == 0)
        return this;
    if (this.length == 0)
        return bidirectional ? a2 : [];
    let result = [];
    for (let i = 0; i < this.length; i++)
    {
        if (a2.indexOf(this[i]) === -1)
        {
            result.push(this[i]);
        }
    }
    if (bidirectional)
    {
        result.splicea(result.length, 0, a2.difference(this));
    }
    return result;
};
Object.defineProperty(Array.prototype, "difference", {
    enumerable: false
});
/**
 * Return all objects from a1 that are not found on a2. 
 * If bidirectional param is set to true then, also return objects from a2 that are not found on a1
 * @param {object[]} a1 the first collection of objects
 * @param {object[]} a2 the second collection of objects
 * @param {string|string[]} key object property chain to be used for testing the uniqueness of the member objects.
 * if key is null then, comparison will be performed by reference for complex types
 * @param {Boolean} bidirectional Perform bidirectional difference or not
 * @param {Boolean} retIndices Also return the indices of the elements
 * @param {Number} startIndex the index of a1 from where to start looking for not present elements in a2
 * @returns {object} result, if retIndices is set to true return an an object with result collection and indices from a1 and a2 (if bidirectional)
 */
ArrayUtils.differenceOnKeyMatch = function (a1, a2, key, bidirectional = false, retIndices = false, startIndex = 0)
{
    // if the other array is a falsy value, return
    let result = [],
        indices = [],
        swap = [];
    if (!a2 || a2.length == 0)
    {
        if (a1)
        {
            let len = a1.length;
            for (let i = startIndex; i < len; i++)
            {
                result.push(a1[i]);
                indices.push(i);
            }
        }
    } else
    {
        if (a1)
        {
            let len = a1.length;
            for (let i = startIndex; i < len; i++)
            {
                let ind;
                if (key == null)
                    ind = a2.indexOf(a1[i]);
                else
                    ind = ArrayUtils.indexOfObject(a2, key, ObjectUtils.getChainValue(a1[i], key));
                if (ind == -1)
                {
                    result.push(a1[i]);
                    indices.push(i);
                } else if (ind != i)
                {
                    swap.push({
                        a1_index: i,
                        a2_index: ind
                    });
                }
            }
        }
    }
    let ret;
    if (bidirectional)
    {
        let r2 = ArrayUtils.differenceOnKeyMatch(a2, a1, key, false, retIndices);
        ret = retIndices ? {
            "result": result.splicea(result.length, 0, r2.result),
            "a1_indices": indices,
            "a2_indices": r2.a1_indices,
            "a1_swap": swap,
            "a2_swap": r2.swap
        } : result.splicea(result.length, 0, r2);
    } else
        ret = retIndices ? {
            "result": result,
            "a1_indices": indices,
            "swap": swap
        } : result;

    return ret;
}
/**
 * Reduce this array based on the return values of fn parameter
 * @param {Function} fn the function to be calculated on each member
 * @returns {object} result, a collection that will be indexed based on return values from fn. The members are arrays containing all the elements of this collection for which fn returned the same value
 */
Array.prototype.groupReduce = function (fn)
{
    var m = this.map(fn);
    var r = [];
    for (var i = 0; i < this.length; i++)
    {
        if (r[m[i]] == null)
        {
            r[m[i]] = [];
        }
        r[m[i]].push(this[i]);
    }
    return r;
};
/**
 * Group objects of a collection based on the proviced fields and calculate an aggregate function on each group
 * the returned object will be a recursive structure if more than on field is provided in the fields parameter
 * @param {string[]} fields the array of fields you want to group by
 * @param {object[]} aggregate_fn collection of object with field and fn members
 * @returns {object} result, an object containing members named based on field name and aggregate fn that was calculated
 * the members are object containing the calculated aggregate and the elements that are part of this group
 */
Array.prototype.group = function (fields, aggregate_fn)
{

    //group elements in $in_arr by the field names in $fields array
    out_arr = {};
    fields_zero = fields[0];
    for (var i = 0; i < this.length; i++)
    {
        var el = this[i];
        if (!out_arr[el[fields_zero]])
        {
            out_arr[el[fields_zero]] = {};
            out_arr[el[fields_zero]].elements = [];

        }

        out_arr[el[fields_zero]].elements.push(el);
        if (aggregate_fn && Array.isArray(aggregate_fn))
        {
            for (var j = 0; j < aggregate_fn.length; j++)
            {
                var aggregate_field = aggregate_fn[j]["field"] + '_' + aggregate_fn[j]["fn"];
                if (!out_arr[el[fields_zero]][aggregate_field])
                {
                    out_arr[el[fields_zero]][aggregate_field] = 0;
                }
                out_arr[el[fields_zero]][aggregate_field] += el[aggregate_fn[j].field];
            }
        }
    }

    //ti grupojme sipas fushes se radhes tani
    fields.shift();

    if (fields.length > 0)
    {
        for (var key in out_arr)
        {
            var value = out_arr[key];
            value.elements = value.elements.group(fields, aggregate_fn);
        }
    }
    return out_arr;
};
Object.defineProperty(Array.prototype, "group", {
    enumerable: false
});
/**
 * Push an element on this array only if it is not already present
 * @param {object} el the object you want to push
 * @param {string} key the property to test for uniqueness of the objects (primary key)
 */
Array.prototype.pushUnique = function (el, key)
{
    var found = false;
    for (var i = 0; i < this.length && !found; i++)
    {
        if ((key && (el[key] == this[i][key])) || el == this[i])
        {
            found = true;
        }
    }
    if (!found)
        this.push(el);
};
Object.defineProperty(Array.prototype, "pushUnique", {
    enumerable: false
});

/**
 * Toggle(Add or Remove) an element from this array
 * @param {object} el the object you want to toggle
 * @param {string} key the property to test for uniqueness of the objects (primary key)
 */
Array.prototype.toggle = function (el, key)
{
    var foundAt = -1;
    for (var i = 0; i < this.length && foundAt < 0; i++)
    {
        if ((key && (el[key] == this[i][key])) || el == this[i])
        {
            foundAt = i;
        }
    }
    if (foundAt < 0)
        this.push(el);
    else
        this.splice(foundAt, 1);
};
Object.defineProperty(Array.prototype, "toggle", {
    enumerable: false
});
/**
 * Toggle (Add or Remove) a collection of elements from this array
 * @param {object[]} el the collection of objects you want to toggle
 * @param {string} key the property to test for uniqueness of the objects (primary key)
 */
Array.prototype.togglea = function (el, key)
{
    for (var i = 0; i < el.length; i++)
    {
        this.toggle(el[i], key);
    }
};
Object.defineProperty(Array.prototype, "togglea", {
    enumerable: false
});
/**
 * Remove duplicate items from this array
 * @param {string} key the property to test for uniqueness of the objects (primary key)
 */
Array.prototype.dedupe = function (key)
{
    let i = 0;
    let index = -1,
        r = {
            result: [],
            indices: []
        };
    while (i < this.length - 1)
    {
        if ((key && (index = ArrayUtils.indexOfObject(this, key, this[i][key], i + 1)) > -1) || ((index = this.indexOf(this[i], i + 1)) > -1))
        {
            r.indices.push(index);
            r.result.push(this[index]);
            this.splice(index, 1);
        } else
        {
            if (this[i].equals)
            {
                let j = i + 1;
                while (j < this.length)
                {
                    if (this[i].equals(this[j]))
                        this.splice(j, 1);
                    else
                        ++j;
                }
            }
            ++i;
        }
    }
    return r;
};
Object.defineProperty(Array.prototype, "dedupe", {
    enumerable: false
});

/**
 * Same as splice but takes an array of items other than comma separated items
 * @param {Number} index the index to start adding and/or removing items
 * @param {Number} howmany items you want to remove
 * @param {object[]} items the collection of items you want to add
 */
Array.prototype.splicea = function (index, howmany, items)
{
    var params = [index, howmany];
    if (items)
    {
        for (var i = 0; i < items.length; i++)
        {
            params.push(items[i]);
        }
    }
    return this.splice.apply(this, params);
};
Object.defineProperty(Array.prototype, "splicea", {
    enumerable: false
});


ArrayUtils.createEmptyObject = function (ac, keyField, valueField)
{
    var emptyObj = {};
    var len = ac.length;
    for (var i = 0; i < len; i++)
    {
        emptyObj[ac[i][keyField]] = ac[i][valueField];
    }
    return emptyObj;
};

ArrayUtils.acExtend = function ()
{
    let deep = false,
        extended;
    let i = 0;
    let copyAccessors_flag = false;
    let staticProperties = [];
    let excludeProperties = [];
    let derive = false;
    // Check if a deep merge
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]')
    {
        deep = arguments[0];
        i++;
    }
    if (Object.prototype.toString.call(arguments[1]) === '[object Boolean]')
    {
        copyAccessors_flag = arguments[1];
        i++;
    }
    if (Object.prototype.toString.call(arguments[2]) === '[object Boolean]' && arguments[2] === true)
    {
        derive = arguments[2];
        i++;
        --length;
        extended = arguments[length];
    }
    if (typeof arguments[2] === 'string' || arguments[2] instanceof String)
    {
        staticProperties.push(arguments[2]);
        i++;
    } else if (Array.isArray(arguments[2]))
    {
        staticProperties = arguments[2];
        i++;
    }
    if (typeof arguments[3] === 'string' || arguments[3] instanceof String)
    {
        excludeProperties.push(arguments[3]);
        i++;
    } else if (Array.isArray(arguments[3]))
    {
        excludeProperties = arguments[3];
        i++;
    }
    let ex = arguments[i];
    if (deep)
    {
        let o = {
            toextend: ex
        };
        let p = ObjectUtils.extend(deep, o);
        extended = p.toextend;
    } else if (excludeProperties.length > 0)
    {
        let len = ex.length;
        extended = new ex.constructor(len);
        for (let i = 0; i < len; i++)
        {
            extended[i] = ObjectUtils.extend(false, false, [], excludeProperties, ex[i]);
        }
    } else if (ex && ex.hasOwnProperty("length"))
    {
        let len = ex.length;
        extended = new ex.constructor(len);
        for (let i = 0; i < len; i++)
        {
            extended[i] = ex[i];
        }
    }
    return extended;
}
export
{
    ArrayUtils
};