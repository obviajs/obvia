import { ChangeWatcher } from "/obvia/lib/binding/ChangeWatcher.js";
import { ObjectUtils } from "/obvia/lib/ObjectUtils.js";

var LocalizationManager = function(_props) {
    let _selectedLocale,_fetchPromise,
    _dict = {},
    _myw,
    _loaded,
    _defaultParams = {
        fetchPromise: null
    };
    
    ObjectUtils.fromDefault(_defaultParams, _props);

    _fetchPromise = _props.fetchPromise;
    _myw = ChangeWatcher.getInstance(this);
    
    Object.defineProperty(this, "loaded", {
        get: function loaded() {
            return _loaded;
        },
    });

    Object.defineProperty(this, "selectedLocale", {
        get: function selectedLocale() {
            return _selectedLocale;
        }
    });

    this.setSelectedLocale = async function (v) {
        let p;
        if (v != _selectedLocale && ObjectUtils.isObject(v) && (!ObjectUtils.isObject(_selectedLocale) || v.localeString != _selectedLocale.localeString)) {
            if (_fetchPromise) {
                p = _fetchPromise.call(this, {
                    "localeString": v.localeString
                }).then((r) => {
                    _dict[v.localeString] = r;
                    let oldValue = _selectedLocale;
                    _selectedLocale = new Locale(v);
                    _myw.propertyChanged("selectedLocale", oldValue, _selectedLocale);
                    return _dict;
                });
            }
        }
        _loaded = Promise.resolve(p);
        return _loaded;
    };

    this.getLocaleString = function (section, str, locale) {
        let r, localeString;
        if (locale == null) {
            if (_selectedLocale)
                localeString = _selectedLocale.localeString;
        } else if (locale.localeString) {
            localeString = locale.localeString;
        }
        if (_dict && _dict[localeString] && _dict[localeString].sections[section])
            r = _dict[localeString].sections[section][str];
        return r;
    };
    
    this.setSelectedLocale(_props.selectedLocale);
};

var Locale = function(_props){
    let _defaultParams = {
        displayLanguage: "English",
        localeString: "en_US"
    },
    _displayLanguage,
    _localeString;

    _props = ObjectUtils.fromDefault(_defaultParams, _props);
    
    _localeString = _props.localeString;
    _displayLanguage = _props.displayLanguage;
    
    Object.defineProperty(this, "localeString", {
        get: function localeString() {
            return _localeString;
        },
    });
    Object.defineProperty(this, "displayLanguage", {
        get: function displayLanguage() {
            return _displayLanguage;
        },
    });
};
Locale.en_US = new Locale({
    localeString: "en_US",
    displayLanguage: "English"
});
Locale.it_IT = new Locale({
    localeString: "it_IT",
    displayLanguage: "Italian"
});
Locale.sq_AL = new Locale({
    localeString: "sq_AL",
    displayLanguage: "Albanian"
});
export {
    LocalizationManager, Locale
};