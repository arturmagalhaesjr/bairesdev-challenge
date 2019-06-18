/**
 * Animate the objects
 */
export default class Animate {
    /**
     * Does Simple DOM animations
     * @param elem string
     * @param style string
     * @param unit string
     * @param from string
     * @param to string
     * @param time number
     * @param prop string
     */
    static do(elem, style, unit, from, to, time, prop) {
        if (!elem) {
            return;
        }
        let start = new Date().getTime(),
            timer = setInterval(function () {
                var step = Math.min(1, (new Date().getTime() - start) / time);
                if (prop) {
                    elem[style] = (from + step * (to - from)) + unit;
                } else {
                    elem.style[style] = (from + step * (to - from)) + unit;
                }
                if (step === 1) {
                    clearInterval(timer);
                }
            }, 25);
        if (prop) {
            elem[style] = from + unit;
        } else {
            elem.style[style] = from + unit;
        }
    }
}
