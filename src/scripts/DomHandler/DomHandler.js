/**
 * DOM Handler
 * It's in charge of handling DOM objects
 * @author artur.magalhaes
 */
export default class DomHandler {
    /**
     * Constructor
     * Could be a other reference from a DOM Handler or null (document)
     * @param object
     */
    constructor(object) {
        this.object = (object !== undefined) ? object : document;
    }

    /**
     * Find the element based on selector .class #id tagname
     * @param element
     * @returns {Element}
     */
    find(element) {
        const selector = element.charAt(0);
        let _element = null;
        switch (selector) {
            case '#': {
                const elementName = element.substring(1, element.length);
                _element = this.object.getElementById(elementName);
                break;
            }
            case '.': {
                const elementName = element.substring(1, element.length);
                _element = this.object.getElementsByClassName(elementName)[0];
                break;
            }
            default: {
                const elementName = element.substring(1, element.length);
                _element = this.object.getElementsByTagName(elementName)[0];
                break;
            }
        }
        return new DomHandler(_element);
    }

    /**
     * Returns the main object
     * @returns {Document | *}
     */
    getObject () {
        return this.object;
    }
}
