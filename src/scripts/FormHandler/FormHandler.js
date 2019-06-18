import DomHandler from "../DomHandler/DomHandler";

export default class FormHandler {
    constructor (id) {
        this._id = id;
        const dom = new DomHandler();
        this._object = dom.find(this._id);
        this._init();
        this._onSubmitHandler = null;
    }

    _init () {
        this._object.getObject().onsubmit = this._onSubmit.bind(this);
    }

    onSubmit (callback) {
        this._onSubmitHandler = callback;
    }

    validate () {
        const dom = new DomHandler();
        let isValid = true;
        this._fields.forEach(item => {
            const input = dom.find(item);
            const value = input.getObject().value;
            const errorLabel = input.getObject().parentNode.getElementsByClassName('input-error')[0];
            if (value.length === 0 || !value.match(/^[0-9]+$/)) {
                input.getObject().className += ' error';
                errorLabel.innerHTML = 'Mandatory Field';
                isValid = false;
            } else {
                input.getObject().className = input.getObject().className.replace(/error/, '');
                errorLabel.innerHTML = '';
            }
        });

        return isValid;
    }
    /**
     *
     * @param fields
     */
    setRequiredFields (fields) {
        this._fields = fields;
    }

    _onSubmit (event) {
        event.preventDefault();
        if (this.validate()) {
            if (this._onSubmitHandler) {
                this._onSubmitHandler();
            }
        }
    }
}
