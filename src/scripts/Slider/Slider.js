import DOM from '../DomHandler/DomHandler';

export default class Slider {
    constructor(id, min, max, value, decimals) {
        const body = new DOM();
        this._root = body.find(id);
        // console.info(this._root);
        this._min = this._root.find('.min-value');
        this._max = this._root.find('.max-value');
        this._input = this._root.find('.input-value');
        this._bar = this._root.find('.bar-total');
        this._limit = this._root.find('.bar-background');
        this._bullet = this._root.find('.bullet');
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

    _isNumber(value) {
        if ((undefined === value) || (null === value)) {
            return false;
        }
        if (typeof value == 'number') {
            return true;
        }
        return !isNaN(value - 0);
    }

    _onKeyDown() {
        if (this._intervalID) {
            clearTimeout(this._intervalID);
        }
        this._intervalID = setTimeout(() => {
            const value = this._input.getObject().value;
            const floatNumber = parseFloat(value);
            if (this._isNumber(value) && floatNumber >= this._minValue && floatNumber <= this._maxValue) {
                this._currentValue = this._input.getObject().value;
                this._updateView();
                this.updateBullet();
            } else {
                this._input.getObject().value = this._currentValue;
            }
        }, 200);
    }

    init() {
        this._updateView();
        this.updateBar();
        this.updateBullet();
        this.__prepareMouseEvent();
    }

    onValueUpdated(callback) {
        this._cbUpdated = callback;
    }

    updateBar() {
        const position = Math.round((this._currentValue / this._maxValue) * 100 * 0.95);
        this._bar.getObject().setAttribute('style', 'width: ' + position + '%');
    }

    updateBullet() {
        const position = Math.floor((this._currentValue / (this._maxValue - this._minValue)) * 100 * 0.95);
        this._bullet.getObject().setAttribute('style', 'left: ' + position + '%');
    }

    _updateView() {
        this.updateBar();
        this._input.getObject().value = this._currentValue.toString().match(/\.0/) ? Math.round(this._currentValue) : this._currentValue;
    }

    _parseNumber(number) {
        return (this._decimals > 0 && !Number.isInteger(number)) ? parseFloat(number).toFixed(this._decimals) : Math.round(number);
    }
    _getPosition (event) {
        return event.touches ? [event.touches[0].clientX, event.touches[0].clientY] : [event.clientX, event.clientY];
    }
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
                if (left - this._margin > 0 && left + this._margin < positionInfo.width) {
                    bulletDom.setAttribute('style', 'left:' + left + 'px');
                    const percent = (left / (positionInfo.width - (this._margin * 2)));
                    this._currentValue = this._parseNumber(this._maxValue * percent);
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
