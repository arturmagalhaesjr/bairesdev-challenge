import DOM from '../DomHandler/DomHandler';

/**
 * Component of range slider
 */
export default class Slider {
    /**
     * Sets the object and
     * @param id string
     * @param min number
     * @param max number
     * @param value number
     * @param decimals integer
     */
    constructor(id, min, max, value, decimals) {
        const body = new DOM();
        this._root = body.find(id);
        // bind the elements into object
        this._min = this._root.find('.min-value');
        this._max = this._root.find('.max-value');
        this._input = this._root.find('.input-value');
        this._bar = this._root.find('.bar-total');
        this._limit = this._root.find('.bar-background');
        this._bullet = this._root.find('.bullet');
        // updates DOM
        this._min.getObject().innerHTML = min;
        this._max.getObject().innerHTML = max;
        this._input.getObject().value = value;
        this._input.getObject().onkeypress = this._onKeyDown.bind(this);
        this._currentValue = value;
        this._maxValue = max;
        this._minValue = min;
        this._isDown = false;
        this._offset = [0, 0];
        this._margin = 0;
        this._cbUpdated = null;
        this._decimals = (decimals === undefined ? 0 : decimals);
        this.init();
    }

    /**
     * Verify if value is Number (integer or float)
     * @param value
     * @returns {boolean}
     * @private
     */
    _isNumber(value) {
        if ((undefined === value) || (null === value)) {
            return false;
        }
        if (typeof value == 'number') {
            return true;
        }
        return !isNaN(value - 0);
    }

    /**
     * Listener that handles data to calculate positions of slider
     * @private
     */
    _onKeyDown() {
        if (this._intervalID) {
            clearTimeout(this._intervalID);
        }
        this._intervalID = setTimeout(() => {
            const value = this._input.getObject().value;
            const floatNumber = parseFloat(value);
            // validates the value to update the component
            if (this._isNumber(value) && floatNumber >= this._minValue && floatNumber <= this._maxValue) {
                this._currentValue = this._input.getObject().value;
                this._updateView();
                this.updateBullet();
            } else {
                // fallback if the data input is invalid
                this._input.getObject().value = this._currentValue;
            }
        }, 200);
    }

    /**
     * Init the view by the data values of constructor
     */
    init() {
        this._updateView();
        this.updateBar();
        this.updateBullet();
        this.__prepareMouseEvent();
    }

    /**
     * Listener when the object data is changed/updated
     * @param callback
     */
    onValueUpdated(callback) {
        this._cbUpdated = callback;
    }

    /**
     * Updates the percent bar (DOM) according to the current value
     */
    updateBar() {
        const position = Math.round((this._currentValue / this._maxValue) * 100 * 0.95);
        this._bar.getObject().setAttribute('style', 'width: ' + position + '%');
    }

    /**
     * Updates the bullet/circle according to the current value
     */
    updateBullet() {
        const position = Math.floor((this._currentValue / (this._maxValue - this._minValue)) * 100 * 0.95);
        this._bullet.getObject().setAttribute('style', 'left: ' + position + '%');
    }

    /**
     * Updates the view layer
     * @private
     */
    _updateView() {
        this.updateBar();
        this._input.getObject().value = this._currentValue.toString().match(/\.0/) ? Math.round(this._currentValue) : this._currentValue;
    }

    /**
     * Converts number into float fixed or integer
     * @param number
     * @returns number
     * @private
     */
    _parseNumber(number) {
        return (this._decimals > 0 && !Number.isInteger(number)) ? parseFloat(number).toFixed(this._decimals) : Math.round(number);
    }

    /**
     * gets the position of mouse or touch based on event parameter
     * @param event
     * @returns array
     * @private
     */
    _getPosition (event) {
        return event.touches ? [event.touches[0].clientX, event.touches[0].clientY] : [event.clientX, event.clientY];
    }

    /**
     * Handles the mouse/touch events of bullet object
     * @private
     */
    __prepareMouseEvent() {
        const bulletDom = this._bullet.getObject();
        const mouseDown = (e) => {
            this._isDown = true;
            const pos = this._getPosition(e);
            this._offset = [
                bulletDom.offsetLeft - pos[0],
                bulletDom.offsetTop - pos[1]
            ];
        };
        const mouseUp = (e) => {
            this._isDown = false;
        };
        const mouseMove = (e) => {
            //e.preventDefault();
            if (this._isDown) {
                const pos = this._getPosition(e);
                const positionInfo = this._limit.getObject().getBoundingClientRect();
                const left = this._parseNumber(pos[0] + this._offset[0]);
                // calculates the position according to the mouse/touch and validate if that is on range value
                if (left - this._margin > 0 && left + this._margin < positionInfo.width) {
                    bulletDom.setAttribute('style', 'left:' + left + 'px');
                    const percent = (left / (positionInfo.width - (this._margin * 2)));
                    this._currentValue = this._parseNumber(this._maxValue * percent);
                    // limits the position between the values
                    if (this._currentValue < this._minValue) {
                        this._currentValue = this._minValue;
                    } else if (this._currentValue > this._maxValue) {
                        this._currentValue = this._maxValue;
                    }
                    this._updateView();
                    if (this._cbUpdated) {
                        this._cbUpdated(this._currentValue);
                    }
                }
            }
        };

        bulletDom.addEventListener('mousedown', mouseDown, true);
        bulletDom.addEventListener('touchstart', mouseDown, true);
        document.addEventListener('mouseup', mouseUp, true);
        bulletDom.addEventListener('touchend', mouseUp, true);
        document.addEventListener('mousemove', mouseMove, true);
        bulletDom.addEventListener('touchmove', mouseMove, true);
    }

}
