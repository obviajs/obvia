/*
 * jQuery Typeahead Tagging v0.2.1
 *
 * A jQuery plugin to allow managing tags with typeahead autocompletion.
 *
 * Latest source at https://github.com/bitmazk/jquery-typeahead-tagging
 *
 * Current issues/TODO:
 *  - prevent already added tags from showing up in the autocomplete results
 *  - prevent umlauts from being cleaned out
 *
 */
(function( $ ) {

    $.tagging = {
        $TAGGING_TAG: $('<li class="tagging_tag"></li>')
        , TAG_DELETE: '<span class="tag_delete">x</span>'
        , $TAGGING_NEW: $(
            '<li class="tagging_new"><input type="text" class="tagging_new_input" /></li>')
        , CLEANING_PATTERN: /[^\w\s-]+/g
    };

    // Plugin Methods =========================================================
    $.fn.tagging = function(tagsource) {

        // variable definition
        var $tagging_ul = $('<ul class="tagging_ul"></ul>')
          , $tagging_new = $.tagging.$TAGGING_NEW.clone()
          , datasetname = 'tagging';

        $.tagging.current_taglist = [];
        $.tagging.original_input = this;
        $.tagging.max_tags = parseInt($(this).attr('data-max-tags'));

        // hide the original input
        $.tagging.original_input.hide();

        // split initial input value and put each in one li
        // ul styled like an input. li has tag style.
        $tagging_ul = append_ul(this, $tagging_ul, $tagging_new);

        // append another li with an input for new tags
        append_new($tagging_ul, $tagging_new, tagsource, datasetname);

        return this;
    };


    // Private Function Definition ============================================
    function add_tag($input) {
        // create a new tag from the input's value and insert it before the
        // input's parent li
        var $new_tag = $.tagging.$TAGGING_TAG.clone()
          , value = $input.val().replace($.tagging.CLEANING_PATTERN, '').trim()
          , limit_exceeded = false;

        if ($.tagging.max_tags && $.tagging.max_tags <= $.tagging.current_taglist.length) {
            limit_exceeded = true;
        }

        if (value && !limit_exceeded) {
            $new_tag.html(value + $.tagging.TAG_DELETE);
            $new_tag.insertBefore($input.parents('li'));
            $.tagging.current_taglist.push(value);
        }
        sync_input();
    }

    function append_new($element, $tagging_new, tagsource, datasetname) {
        // append a new li to the tagging ul element with an input to add new
        // tags
        $element.append($tagging_new);
        // init typeahead
        init_typeahead($element.find('input.tagging_new_input'), tagsource,
                       datasetname);
    }

    function append_ul($input, $tagging_ul, $tagging_new) {
        // splits a comma separated string of tags into an array of strings
        var tags = []
          , value
          , $tagging_tag;

        if ($input.val()) {
            tags = $input.val().split(',');
        }
        // fill the ul with li containing the tag names
        for (var i=0; i<tags.length; i++) {
            $tagging_tag = $.tagging.$TAGGING_TAG.clone();
            value = tags[i].replace($.tagging.CLEANING_PATTERN, '').trim();
            $tagging_tag.html(value + $.tagging.TAG_DELETE);
            $tagging_ul.append($tagging_tag);
            $.tagging.current_taglist.push(value);
        }

        // append the new li with the input
        append_new($tagging_ul, $tagging_new);

        $tagging_ul.insertAfter($input);
        return $tagging_ul;
    }

    function delete_tag($tagging_tag) {
        // removes a tag and updates the hidden input
        var removed_tag = $tagging_tag.clone().children().remove().end().text()
          , tag_index = $.tagging.current_taglist.indexOf(removed_tag);
        $.tagging.current_taglist.pop(tag_index);
        $tagging_tag.remove();

        sync_input();
    }

    function init_typeahead($input, tagsource, datasetname) {
        if (tagsource) {
            var substringMatcher = function(tagsource) {
                return function findMatches(q, cb) {
                    var matches, substrRegex;

                    // an array that will be populated with substring matches
                    matches = [];

                    // regex used to determine if a string contains the
                    // substring `q`
                    substrRegex = new RegExp(q, 'i');

                    // iterate through the pool of strings and for any string
                    // that contains the substring `q`, add it to the `matches`
                    // array
                    $.each(tagsource, function(i, str) {
                        if (substrRegex.test(str)) {
                            matches.push({ value: str });
                        }
                    });

                    cb(matches);
                };
            };

            $input.typeahead({
                hint: true
                , highlight: true
                , minLength: 1
            },
            {
                name: datasetname
                , displayKey: 'value'
                , source: substringMatcher(tagsource)
            });
        }
    }

    function sync_input() {
        // updates the hidden input from the current taglist

        $.tagging.original_input.val($.tagging.current_taglist.join(','));
    }

    // Events =================================================================

    // when clicking x inside taglike li remove tag
    $(document).on('click', '.tag_delete', function() {
        delete_tag($(this).parent());
    });

    // focus the input for new tags when clicking the ul looking like an input
    $(document).on('click', 'ul.tagging_ul', function(e) {
        e.preventDefault();
        $(this).find('input.tagging_new_input').focus();
    });

    // key events for the new tag input
    $(document).on('keydown', 'input.tagging_new_input', function(e) {
        // on hitting enter or comma inside the new input, create a new tag
        // from the current input value
        if (e.keyCode === 13 || e.keyCode === 188) {
            if ($(this).val()) {
                e.preventDefault();
                add_tag($(this));
                $(this).typeahead('val', '');
                $(this).typeahead('close');
            }
        }
        // if pressing backspace in an empty input, remove previous tag
        if (e.keyCode === 8) {
            if (this.selectionStart === 0 && this.selectionEnd === 0) {
                (function($this) {
                    var $tagging_tag = $this.parents('ul').find('li.tagging_tag').last();
                    e.preventDefault();
                    delete_tag($tagging_tag);
                })($(this));
            }
        }
    });

}( jQuery ));
