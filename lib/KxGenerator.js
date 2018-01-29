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
 * Helpers
 */
var convertToCamelCase = function (str){
    return str.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}

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

/**
 * Rivets Configuration
 */

rivets.configure({
    handler: function (target, event, binding) {
        var eventType = binding.args[0];
        var arg = target.getAttribute('data-on-' + eventType);

        if (arg) {
            this.call(binding.model, arg);
        } else {
            // that's rivets' default behavior afaik
            this.call(binding.model, event, binding);
        }
    }
});

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
    'registerEvents'
];

var privateConstructs = lifeCycleMethods.concat(frameworkProps);

var KxGenerator = {
    registeredComponents: {},

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
            var model = component.initModel();
            component.setModelValue = function (key, value) {
                model[key] = value;
            }

            component.getModelValue = function (key) {
                if (model.hasOwnProperty(key))
                    return model[key];
                else return null;
            }

            component.getModel = function () {
                return model;
            }

            //getters and setters
            if (!component.hasOwnProperty('getValue')) {
                component.getValue = function () {
                    return component.value;
                }
            }

            if (!component.hasOwnProperty('setValue')) {
                component.getValue = function (value) {
                    component.value = value;
                    return this;
                }
            }
            //generate component
            component.$el = $(component.template());
           
            //destruct 
            if (!component.hasOwnProperty('destruct')) {
                component.destruct = function () {
                    component.$el.remove();
                }
            }    

            //execute functions before component attached on dom
            if (typeof component.beforeAttach == 'function')
                component.beforeAttach();
            
            //bind template with the model
            rivets.bind(component.$el, model);
    
            //execute functions after component attached on dom
            ready('#' + component.id, function (element) {
                if (typeof component.afterAttach == 'function')
                    component.afterAttach();
                
                //trigger events
                if (typeof component.registerEvents == 'function')
                    component.registerEvents();
                  
                component.$el.on('change', function (e) {
                    e.stopImmediatePropagation();
                    component.$el.trigger('onchange', component);
                });
            });
            
            return component;
        }
    },

    registerDOMElement: function (componentProto, elementName) {
        var elementProto = Object.create(HTMLElement.prototype);
        
        elementProto.createdCallback = function () {
            var attributes = this.attributes;
            var children = this.childNodes;
            var parent = this.parentElement;
            var props = {};

            //return if parent is repeater
            if (parent.tagName.toLowerCase() == 'kx-repeater')
                return;    
            
            //special logic for repeater, accepts children, build repeater's component prop
            if (componentProto.type == 'repeater') {
                props.components = [];
                //extract nested components
                for (var child in children) {
                    if (!children[child].tagName)
                        continue;   
        
                    if (!KxGenerator.registeredComponents.hasOwnProperty(children[child].tagName.toLowerCase()))
                        continue;    
                    
                    var nestedComponent = {
                        constructor: KxGenerator.registeredComponents[children[child].tagName.toLowerCase()],
                        props: {

                        }
                    }

                    //build children props
                    var nestedComponentAttributes = children[child].attributes;
                    buildProps(nestedComponent.props, nestedComponentAttributes, true);
                    
                    props.components.push(nestedComponent);
                    console.log(props);
                }
            } 
            
            //build props
            buildProps(props, attributes);
           
            //create component
            var component = new componentProto(props);
            
            //expose component
            window[props.id] = component;

            //append to dom
            if (!document.getElementById("kx-components")) {
                $('body').append("<div id='kx-components'></div>");
            }
            $('#kx-components').append(component.render());
        }

        document.registerElement(elementName, {
            prototype: elementProto
        });

        //register component
        this.registeredComponents[elementName] = componentProto;
        componentProto.domElementName = elementName;
    }
}

var KxRequest = {
    promise: function (callback){
        return $.when(callback)
    }
}
