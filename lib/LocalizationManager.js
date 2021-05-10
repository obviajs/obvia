import { ChangeWatcher } from "/flowerui/lib/binding/ChangeWatcher.js";
import { ObjectUtils } from "/flowerui/lib/ObjectUtils.js";
class LocalizationManager {
    #_selectedLocale;
    #_fetchPromise;
    #_dict = {};
    #_myw;
    #_loaded;
    static #_defaultParams = {
        fetchPromise: null
    };
    static #_instance;
    constructor(_props) {
        if (!LocalizationManager.#_instance) {
            LocalizationManager.#_instance = this;
            _props = ObjectUtils.extend(LocalizationManager.#_defaultParams, _props);
            this.#_fetchPromise = _props.fetchPromise;
            this.#_myw = ChangeWatcher.getInstance(this);
            this.setSelectedLocale(_props.selectedLocale);
        }
        return LocalizationManager.#_instance;
    }
    get loaded() {
        return this.#_loaded;
    }
    get selectedLocale() {
        return this.#_selectedLocale;
    }
    setSelectedLocale(v) {
        let p;
        if (v != this.#_selectedLocale) {
            if (this.#_fetchPromise) {
                p = this.#_fetchPromise.call(this, {
                    "localeString": v.localeString
                }).then((r) => {
                    this.#_dict[v.localeString] = JSON.parse(r.response);
                    let oldValue = this.#_selectedLocale;
                    this.#_selectedLocale = new Locale(v);
                    this.#_myw.propertyChanged("selectedLocale", oldValue, this.#_selectedLocale);
                    return this.#_dict;
                });
            }
        }
        this.#_loaded = Promise.resolve(p);
        return this.#_loaded;
    }
    getLocaleString(section, str, locale) {
        let r, localeString;
        if (locale == null) {
            if(this.#_selectedLocale)
                localeString = this.#_selectedLocale.localeString;
        } else if(locale.localeString) { 
            localeString = locale.localeString;
        }
        if (this.#_dict && this.#_dict[localeString] && this.#_dict[localeString].sections[section])
            r = this.#_dict[localeString].sections[section][str];
        return r;
    }

};

class Locale {
    static #_defaultParams = {
        displayLanguage: "English",
        localeString: "en_US"
    };
    #_displayLanguage;
    #_localeString;
    #_myw;

    static en_US = new Locale({
        localeString: "en_US",
        displayLanguage: "English"
    });
    static it_IT = new Locale({
        localeString: "it_IT",
        displayLanguage: "Italian"
    });
    static sq_AL = new Locale({
        localeString: "sq_AL",
        displayLanguage: "Albanian"
    });

    static #_values = Object.values(Locale);
    constructor(_props) {
        _props = ObjectUtils.extend(Locale.#_defaultParams, _props);
        this.#_localeString = _props.localeString;
        this.#_displayLanguage = _props.displayLanguage;
        this.#_myw = ChangeWatcher.getInstance(this);
    }
    get localeString() {
        return this.#_localeString;
    }
    set localeString(v) { 
        if (this.#_localeString != v) {            
            let oldValue = this.#_localeString;

        };

    }
    get displayLanguage() {
        return this.#_displayLanguage;
    }
    static[Symbol.iterator]() {
        return Locale.#_values[Symbol.iterator]();
    }
};
export {
    LocalizationManager, Locale
};