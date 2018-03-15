(function($) {
	$.fn.extend({
        blurjs: function(options) {
        	
        	this.defaultOptions = {
                customClass: 'blurjs',
                radius: 5,
                persist: false
            };

			function removeBlurs(_obj){
				for(var i in window.blurJSClasses){
					if(_obj.hasClass(window.blurJSClasses[i])){
						_obj.removeClass(window.blurJSClasses[i]);
					}
				}
			}

            function singleSetting(obj, target){
            	switch(target){
            		case 'remove':
            			removeBlurs(obj);
            	}
            }
            
            function svg(amt) {
            	if($('#blurjs-'+amt).length!=0){
            		$('#blurjs-'+amt).remove();
            	}
                $('body').append('<svg id="blurjs-'+amt+'"><filter id="blur'+amt+'px"><feGaussianBlur in="SourceGraphic" stdDeviation="'+amt+'"></feGaussianBlur></filter></svg>');
            }

            function css(cssClass, amt) {
            	svg(amt);
                return '<style type="text/css">.' + cssClass + '{-ms-filter:blur(' + amt + 'px);-webkit-filter:blur(' + amt + 'px);-moz-filter:blur(' + amt + 'px);-o-filter:blur(' + amt + 'px);filter: url("#blur'+(amt)+'px");filter:progid:DXImageTransform.Microsoft.Blur(pixelradius='+amt+');}.' + cssClass + ' img{filter:progid:DXImageTransform.Microsoft.Blur(pixelradius='+amt+');}</style>';
            }

			if(typeof options=='string'){
				singleSetting($(this), options);
				return;
			}
			
			var settings = $.extend({}, this.defaultOptions, options);
			
			if(typeof window.blurJSClasses=='undefined'){
				window.blurJSClasses=[];
			}
			
            return this.each(function() {
                var $this = $(this),
                    blurredClass = settings.customClass + '-' + settings.radius + '-radius';
				
				window.blurJSClasses.push(blurredClass);
				
				if (!settings.persist && $('head style:contains(' + settings.customClass + ')').length !== 0) {
                    $('head style:contains(' + settings.customClass + ')').remove();
                }
				if ($('head style:contains('+blurredClass+')').length === 0) {
					var cssData = css(blurredClass, settings.radius);
					$(cssData).appendTo('head');
                }
                $this.addClass(blurredClass);
            });
        }
    });
    $.extend({
		blurjs: function(action){
			if(action=='reset'){
				for(var i in window.blurJSClasses){
					$('.'+window.blurJSClasses[i]).removeClass(window.blurJSClasses[i]);
				}
			}
		}
	});
})(jQuery);