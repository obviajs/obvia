/**
 * This is a Modal component
 * 
 * Kreatx 2018
 */

//component definition
var Modal = function(_props)
{
    Object.defineProperty(this, "title", 
    {
        get: function title() 
        {
            return _title;
        },
        set: function title(v) 
        {
            if(_title != v)
            {
                _title = v;
                if(this.$title)
                    this.$title.html(v);
            }
        }
    });
    let _displayed = false;
    this.DOMMutation = function(e)
    {
        if(e.mutation.type == "attributes" && e.mutation.attributeName == "style"){
            let av = e.target.style.getPropertyValue('display');
            if(av.trim()!="" && av!="none" && !_displayed){
                _displayed = true;
                let evt = jQuery.Event("displayListUpdated");
                this.trigger(evt);
            }
        }
        //
    }

    this.template = function () 
    {
        return '<div data-triggers="displayListUpdated" class="modal fade modal-fullscreen" id="' + this.domID + '" tabindex="-1" role="dialog">' +
                '<div class="modal-dialog '+ _size +'" role="document">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header" id="' + this.domID + '-modal-header">' +
                            '<h5 class="modal-title" id="' + this.domID + '-modal-title">'+_title+'</h5>' +
                            '<button type="button" class="close no-form-control" data-dismiss="modal" aria-label="Close">' +
                                '<span aria-hidden="true">&times;</span>' +    
                            '</button>' +
                        '</div>' +
                        '<div class="modal-body" id="' + this.domID + '-modal-body">' +

                        '</div>' +
                        '<div class="modal-footer" id="' + this.domID + '-modal-footer">' +

                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    };

    var _defaultParams = {
        size: ModalSize.LARGE
    };
    _props = extend(false, false, _defaultParams, _props);
    var _title = _props.title;
    var _size = _props.size;
    
    this.beforeAttach = function () 
    {
        console.log("Modal before attach");
        this.$body = this.$el.find('#' + this.domID + '-modal-body');
        this.$modalDialog = this.$el.first();
        this.$footer = this.$el.find('#' + this.domID + '-modal-footer');
        this.$header = this.$el.find('#' + this.domID + '-modal-header');
        this.$title = this.$el.find('#' + this.domID + '-modal-title');
        this.$container = this.$body;
        this.$modal = this.$el;
        this.addComponents();
    };

    Parent.call(this, _props, true);
    var base = this.base;
    
    this.show = function () 
    {
        if(this.$modal)
            this.$modal.modal('show');
        return this;
    };
    
    this.hide = function () 
    {
        if(this.$modal)
            this.$modal.modal('hide');
        return this;
    };  
};
Modal.prototype.ctor = 'Modal';