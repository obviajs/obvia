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
var convertToCamelCase = function (str) {
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

var RepeaterEventArgs = function (row, item, index, deletedRows = null) {
    this.currentRow = row;
    this.currentIndex = index;
    this.currentItem = item;
    this.deletedRows = deletedRows;
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
   
    createComponent: function (cmp) {
        //returns component constructor
        return function (props, debug = false) {
            //create new component object 
            //in order to support multiple objects of same type
           // var component = Object.assign({}, $.extend(true, {}, cmp));
            var component = extend(true, true, cmp);
            //parent references
            component.parent = null;
            component.parentType = null;
            component.parentForm = null;
            component.repeaterIndex = null;
            component.enabled = true;

            //register props to component
            for (var p in props) {
                if (component[p]!=null && component[p]!=undefined && typeof(component[p])==="object" && !(component[p] instanceof Array) && !(typeof component[p] === "string")){
                    component[p] = extend(true, true,  props[p]); //Object.assign(component[p], $.extend(true, {}, props[p]))
                }else
                    component[p] = props[p];
            }

            //exit on missing component id
            if (!component.id) {
                alert('Some component is missing an id');
                return;
            }

            //generate GUID for this component
            component.guid = guid();

            //domID property
            Object.defineProperty(component, 'domID', {
                get: function () {
                    return this.id + '_' + this.guid;
                }
            });

            //model
            component.model = {};
            if (typeof component.initModel == 'function') {
                component.model = component.initModel();
            }

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

            //getters and setters
            if (!component.hasOwnProperty('getValue')) {
                component.getValue = function () {
                    return component.value;
                }
            }

            if (!component.hasOwnProperty('setValue')) {
                component.setValue = function (value) {
                    if (component.value != value) {
                        component.value = value;
                    }

                    component.trigger('change');

                    return this;
                }

            }
            //if component is embedded within another then do not render label and other specific html
            if (!component.hasOwnProperty('embedded')) {
                component.embedded = false;
            }
            //action methods on component
            if (!component.hasOwnProperty('show')) {
                component.show = function () {
                    component.$el.show();
                    return this;
                }
            }
            
            if (!component.hasOwnProperty('hide')) {
                component.hide = function () {
                    component.$el.hide();
                    return this;
                }
            }

            if (!component.hasOwnProperty('setColspan')) {
                component.setColspan = function (colspan) {
                    component.$el.removeClass([
                        'col-sm-0', 'col-sm-1', 'col-sm-2', 'col-sm-3', 'col-sm-4', 'col-sm-5',
                        'col-sm-6', 'col-sm-7', 'col-sm-8', 'col-sm-9', 'col-sm-10', 'col-sm-11', 'col-sm-12'
                    ]);
                    component.$el.addClass('col-sm-' + colspan);
                    return this;
                }
            }

            if (!component.hasOwnProperty('enable')) {
                component.enable = function () {
                    component.enabled = true;
                    return this;
                }
            }

            if (!component.hasOwnProperty('disable')) {
                component.disable = function () {
                    component.enabled = false;
                    return this;
                }
            }

            if (!component.hasOwnProperty('scrollTo')) {
                component.scrollTo = function () {
                    $("body").animate({
                        scrollTop: component.$el.offset().top - 100
                    }, 1200);
                    return this;
                }
            }
        
            //generate component
            component.$el = $(component.template());

            //spacing of element
            if (component.hasOwnProperty('spacing')) {
                if (component.spacing.hasOwnProperty('offset'))
                    component.$el.addClass('offset-sm-' + component.spacing.offset);
                if (component.spacing.hasOwnProperty('mb'))
                    component.$el.addClass('mb-' + component.spacing.mb);
                if (component.spacing.hasOwnProperty('mt'))
                    component.$el.addClass('mt-' + component.spacing.mt);
            }

            //destruct 
            if (!component.hasOwnProperty('destruct')) {
                component.destruct = function () {
                    component.$el.remove();
                }
            }

            //validation
            component.errorList = [];
            if (!component.hasOwnProperty('validate')) {
                component.validate = function () {
                    return true;
                }
            }

            //bind template with the component
            rivets.bind(component.$el, component);

            //execute functions before component attached on dom
            if (typeof component.beforeAttach == 'function')
                component.beforeAttach();

            //execute functions after component attached on dom
            ready("#" + component.domID + '-wrapper', function (element) {
                //execute inner handlers if theres any registered
                var handlers = [];
                if (typeof component.registerEvents == 'function') {
                    handlers = component.registerEvents();
                    //call inner event
                    handlers.forEach(function (handler, i) {
                        for (var innerEventIn in handler.events) {
                            if (typeof handler.events[innerEventIn] == 'function') {
                                if(handler.registerTo != undefined && handler.registerTo != null){
                                    handler.registerTo.on(innerEventIn, (function (innerEventIn, component) { // a closure is created
                                        return function () {
                                            var args = [];
                                            for (var i = 0; i < arguments.length; i++) {
                                                args.push(arguments[i]);
                                            }

                                            //append RepeaterEventArgs to event
                                            if (component.parentType == 'repeater') {
                                                args = args.concat(
                                                    [   
                                                        new RepeaterEventArgs(
                                                            component.parent.rowItems[component.repeaterIndex],
                                                            component.parent.dataProvider[component.repeaterIndex],
                                                            component.repeaterIndex
                                                        )
                                                    ]
                                                );
                                            }
                                            handler.events[innerEventIn].apply(component, args);
                                        }
                                    })(innerEventIn, component));
                                }else
                                {
                                    console.log("Event handler registritation on '"+component.id+"' failed because the target is undefined");
                                }
                            }
                        }
                    });
                }
             
                component.trigger('afterAttach');
            });

            //register outside handlers
            //wrapp event handling
            component.on = function (eventType, fnc) {
                if (typeof fnc !== 'function') {
                    throw Error("The specified parameter is not a callback")
                } else {
                    if (typeof fnc == 'function') {
                        component.$el.on(eventType, function () {
                            var args = [];
                            for (var i = 0; i < arguments.length; i++) {
                                args.push(arguments[i]);
                            }

                            if (component.parentType == 'repeater') {
                                args = args.concat([
                                    new RepeaterEventArgs(
                                        component.parent.rowItems[component.repeaterIndex],
                                        component.parent.dataProvider[component.repeaterIndex],
                                        component.repeaterIndex
                                    )
                                ]);
                            }
                            fnc.apply(component, args);
                        });
                    }
                }
                return component;
            }
            component.trigger = function () {
                component.$el.trigger.apply(component.$el, arguments);
            }

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
    promise: function (callback) {
        return $.when(callback)
    }
}
