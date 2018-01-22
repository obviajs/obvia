/*
 * jQuery File Upload Plugin JS Example 8.9.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* global $, window */

$(function() {
    'use strict';

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: 'resources/upload/'
    });

    var $hidden = $('#upload_files');
    var files = [];
    // Enable iframe cross-domain access via redirect option:
    $('#fileupload').fileupload(
        'option',
        'redirect',
        window.location.href.replace(
                /\/[^\/]*$/,
                '/cors/result.html?%s'
                )
        )
    .bind('fileuploaddone', function(e, data) {
        //files.push(data.files[0].name);
        var f = $hidden.val();
        var fl = [];
        if (f && f.length > 1)
            fl = f.split(',');
        fl.push(data.files[0].name);
        $hidden.val(fl.join(','));

    }).bind('fileuploaddestroy', function(e, data) {
        var file = data.url.split('?file=');
        if (file.length > 1) {
            var f = $hidden.val();
            var fl = [];
            if (f && f.length > 1)
                fl = f.split(',');

            var index = fl.indexOf(decodeURIComponent(file[1]));
            if (index > -1)
                fl.splice(index, 1);
            $hidden.val(fl.join(','));
        }
    });

    if (window.location.hostname === 'blueimp.github.io') {
        // Demo settings:
        $('#fileupload').fileupload('option', {
            url: '//jquery-file-upload.appspot.com/',
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                    .test(window.navigator.userAgent),
            maxFileSize: 5000000,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
        });
        // Upload server status check for browsers with CORS support:
        if ($.support.cors) {
            $.ajax({
                url: '//jquery-file-upload.appspot.com/',
                type: 'HEAD'
            }).fail(function() {
                $('<div class="alert alert-danger"/>')
                        .text('Upload server currently unavailable - ' +
                                new Date())
                        .appendTo('#fileupload');
            });
        }
    } else {
        // Load existing files:
        $('#fileupload').addClass('fileupload-processing');
        $.ajax({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: $('#fileupload').fileupload('option', 'url'),
            dataType: 'json',
            context: $('#fileupload')[0]
        }).always(function() {
            $(this).removeClass('fileupload-processing');
        }).done(function(result) {
            $(this).fileupload('option', 'done')
                    .call(this, $.Event('done'), {result: result});
        });
    }

});
