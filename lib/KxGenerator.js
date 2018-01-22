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


/**
 * Generator of Components
 */
var lifeCycleMethods = [
    'beforeAttach',
    'afterAttach'
];

var frameworkProps = [
    'initModel',
    'model',
    'template',
    'privateConstructs',
    'value'
];

var privateConstructs = lifeCycleMethods.concat(frameworkProps);

var KxGenerator = {
    createComponent: function (cmp) {
        //returns component constructor
        return function (props, debug = false) {
            
            //create new component object 
            //in order to support multiple objects of same type
            var component = Object.assign({}, cmp);

            //register props to component
            for (var p in props) {
                component[p] = props[p];
            }

            //exit on missing component id
            if (!component.id) {
                alert('Some component is missing an id');
                return;
            }

            //model
            component.model = component.initModel();
            component.setModelValue = function (key, value) {
                component.model[key] = value;
            }

            component.getModelValue = function (key) {
                if (component.model.hasOwnProperty(key))
                    return component.model[key];
                else return null;
            }

            component.getModel = function () {
                return component.model;
            }

            //generate component
            component.$el = $(component.template());

            //execute functions before component attached on dom
            if (typeof component.beforeAttach == 'function')
                component.beforeAttach();
            
            //bind template with the model
            rivets.bind(component.$el, component.model);
            
            //execute functions after component attached on dom
            ready('#' + component.id, function (element) {
                if (typeof component.afterAttach == 'function')
                    component.afterAttach();
                
                //trigger events
                component.$el.on('change', function (e) {
                    component.$el.trigger('onchange', component);
                });
            });
            
            //expose component
            // if (typeof component.privateConstructs == 'function') {
            //     privateConstructs = privateConstructs.concat(component.privateConstructs());   
            // }

            // for (var prop in component) {
            //     if (privateConstructs.indexOf(prop) != '-1')
            //         delete component[prop];
            // }

            return component;
        }
    }
}

