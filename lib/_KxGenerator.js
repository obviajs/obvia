/**
 * Mutation Observers
 * Watching for Desired Element Availability
 * The solution supports detecting element readiness on the initial page load as well as elements dynamically appended to the DOM
 */
(function (win) {
    'use strict';

    var listeners = [],
        doc = win.document,
        MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
        observer;

    function ready(selector, fn) {
        // Store the selector and callback to be monitored
        listeners.push({
            selector: selector,
            fn: fn
        });
        if (!observer) {
            // Watch for changes in the document
            observer = new MutationObserver(check);
            observer.observe(doc.documentElement, {
                childList: true,
                subtree: true
            });
        }
        // Check if the element is currently in the DOM
        check();
    }

    function check() {
        // Check the DOM for elements matching a stored selector
        for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
            listener = listeners[i];
            // Query for elements matching the specified selector
            elements = doc.querySelectorAll(listener.selector);
            for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
                element = elements[j];
                // Make sure the callback isn't invoked with the 
                // same element more than once
                if (!element.ready) {
                    element.ready = true;
                    // Invoke the callback with the element
                    listener.fn.call(element, element);
                }
            }
        }
    }

    // Expose `ready`
    win.ready = ready;

})(this);


var buildProps = function (componentProps, attributes, skipBindings = false) {
    for (var i = 0; i < attributes.length; i++) {
        var attrName = convertToCamelCase(attributes[i].name)
        if (attributes[i].value[0] == '{' && attributes[i].value[attributes[i].value.length - 1] == '}' && !skipBindings) {
            //binded attribute
            componentProps[attrName] = eval(attributes[i].value.slice(1, -1))
        } else
            componentProps[attrName] = attributes[i].value;
    }
}

var RepeaterEventArgs = function (row, item, index, deletedRows = null) {
    this.currentRow = row;
    this.currentIndex = index;
    this.currentItem = item;
    this.deletedRows = deletedRows;
}

/**
 * Generator of Components
 */
var lifeCycleMethods = [
    'beforeAttach'
];

var frameworkProps = [
    'initModel',
    'model',
    'template',
    'privateConstructs',
    'registerEvents'
];

var privateConstructs = lifeCycleMethods.concat(frameworkProps);

var KxGenerator = {
    registeredComponents: {},
    getErrorList: function () {
        return function () {
            return {
                'empty': this.label + ' nuk mund te jete bosh!',
                'zero': this.label + ' nuk mund te jete 0!'
            }
        }
    },
    registerDOMElement:function(){},
    createComponent: function (component) {
        //returns component constructor
        return function (props, debug = false) {
           
            //parent references
            component.parent = null;
            component.parentType = null;
            component.parentForm = null;
            component.repeaterIndex = null;

        }
    }
}

var KxRequest = {
    promise: function (callback) {
        return $.when(callback)
    }
}
