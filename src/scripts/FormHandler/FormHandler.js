import DomHandler from "../DomHandler/DomHandler";
import Utils from '../Utils/Utils';

/**
 * Form Handler
 * Handles the main form and does the input validation fields
 *
 * @author artur.magalhaes
 */
export default class FormHandler {
    /**
     * Starts the object and add the listeners
     * @param id - String ID from HTML
     */
    constructor (id) {
        this._id = id;
        const dom = new DomHandler();
        this._object = dom.find(this._id);
        this._object.getObject().onsubmit = this._onSubmit.bind(this);
        this._onSubmitHandler = null;
    }

    /**
     * Sets callback on submit is successfully submitted
     * @param callback
     */
    onSubmit (callback) {
        this._onSubmitHandler = callback;
    }

    /**
     * Method is in charge of validate the input fields
     *
     * @returns {boolean}
     */
    validate () {
        const dom = new DomHandler();
        let isValid = true;

        // gets the array of fields and iterates among them to validate the entries
        this._fields.forEach(item => {
            const input = dom.find(item.id);
            const value = input.getObject().value;
            const errorLabel = input.getObject().parentNode.getElementsByClassName('input-error')[0];
            input.getObject().className = input.getObject().className.replace(/error/, '');
            errorLabel.innerHTML = '';
            if (value.length === 0 || !value.match(/^[0-9]+$/)) {
                input.getObject().className += ' error';
                // sets the label error according to device
                errorLabel.innerHTML = Utils.isMobile() ? item.mobileMessage : item.desktopMessage;
                isValid = false;
            }
        });

        return isValid;
    }
    /**
     * Sets the array of fields
     * @param fields
     */
    setRequiredFields (fields) {
        this._fields = fields;
    }

    /**
     * On form is submitted, validates and handles all data from the form
     * @param event
     * @private
     */
    _onSubmit (event) {
        event.preventDefault();
        if (this.validate()) {
            if (this._onSubmitHandler) {
                this._onSubmitHandler();
            }
        }
    }
}
