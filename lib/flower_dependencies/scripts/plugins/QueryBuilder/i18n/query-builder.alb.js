/*!
 * jQuery QueryBuilder 2.3.0
 * Locale: Albanian (alb)
 * Author: Damien "Mistic" Sorel, http://www.strangeplanet.fr
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'query-builder'], factory);
    }
    else {
        factory(root.jQuery);
    }
}(this, function($) {
"use strict";

var QueryBuilder = $.fn.queryBuilder;

QueryBuilder.regional['alb'] = {
  "__locale": "Albanian (alb)",
  "__author": "Damien \"Mistic\" Sorel, http://www.strangeplanet.fr",
  "add_rule": "Shto filter",
  "add_group": "Shto grup",
  "delete_rule": "Fshi",
  "delete_group": "Fshi",
  "conditions": {
    "AND": "Dhe",
    "OR": "Ose"
  },
  "operators": {
    "equal": "e barabarte",
    "not_equal": "jo e barabarte",
    "in": "ne",
    "not_in": "jo ne",
    "less": "me pak",
    "less_or_equal": "me pak ose e barabarte",
    "greater": "me e madhe",
    "greater_or_equal": "me e madhe ose e barabarte",
    "between": "ndermjet",
    "not_between": "jo ndermjet",
    "begins_with": "fillon me",
    "not_begins_with": "nuk fillon me",
    "contains": "permban",
    "not_contains": "nuk permban",
    "ends_with": "mbaron me",
    "not_ends_with": "nuk mbaron me",
    "is_empty": "eshte bosh",
    "is_not_empty": "nuk eshte bosh",
    "is_null": "eshte null",
    "is_not_null": "nuk eshte null"
  },
  "errors": {
    "no_filter": "Nuk eshte zgjedhur asnje filter",
    "empty_group": "Grupi eshte bosh",
    "radio_empty": "Nuk eshte zgjedhur asnje vlere",
    "checkbox_empty": "Nuk eshte zgjedhur asnje vlere",
    "select_empty": "Nuk eshte zgjedhur asnje vlere",
    "string_empty": "Vlera eshte bosh",
    "string_exceed_min_length": "Duhet te permbaje te pakten {0} karaktere",
    "string_exceed_max_length": "Nuk duhet te permbaje me shume se {0} karaktere",
    "string_invalid_format": "Format jo i sakte ({0})",
    "number_nan": "Vlera nuk eshte nje numer",
    "number_not_integer": "Vlera nuk eshte numer i plote",
    "number_not_double": "Vlera nuk eshte numer real",
    "number_exceed_min": "Numri duhet te jete me i madh se {0}",
    "number_exceed_max": "Numri duhet te jete me i vogel se {0}",
    "number_wrong_step": "Numri duhet te jete shumefish i {0}",
    "datetime_empty": "Vlera eshte bosh",
    "datetime_invalid": "Format jo i sakte i dates ({0})",
    "datetime_exceed_min": "Vlera duhet te jete pas{0}",
    "datetime_exceed_max": "Vlera duhet te jete para {0}",
    "boolean_not_valid": "Nuk eshte boolean",
    "operator_not_multiple": "Operatori {0} nuk pranon me shume se nje vlere"
  },
  "invert": "Invert"
};

QueryBuilder.defaults({ lang_code: 'alb' });
}));