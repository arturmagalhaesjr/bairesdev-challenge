export default class DomHandler {
    /**
     *
     * @param object
     */
    constructor(object) {
        this.object = (object !== undefined) ? object : document;
    }

    /**
     *
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

    getObject () {
        return this.object;
    }
}
