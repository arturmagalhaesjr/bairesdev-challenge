import '../styles/index.scss';
import Slider from './Slider/Slider';
import FormHandler from './FormHandler/FormHandler';
import DomHandler from "./DomHandler/DomHandler";
import Animate from './Utils/Animate';
import Utils from './Utils/Utils';

document.addEventListener('DOMContentLoaded', () => {
    console.info('BairesDev Coding Challenge');
    // set defaults
    let years = 20;
    let rate = 8;
    let yearsSlider = new Slider('#years-mortgage', 1, 40, years, 0);
    let rateSlider = new Slider('#rate-interest', 0.1, 10, rate, 1);
    // Form handler
    let form = new FormHandler('#form');

    // sets fields and messages
    const fields = [
        {
            id: '#loan',
            desktopMessage: 'Loan Amount is mandatory',
            mobileMessage: 'Mandatory Field'
        },
        {
            id: '#annual-tax',
            desktopMessage: 'Annual Tax is mandatory',
            mobileMessage: 'Mandatory Field'
        },
        {
            id: '#annual-insure',
            desktopMessage: 'Annual Insurance is mandatory',
            mobileMessage: 'Mandatory Field'
        }
    ];
    form.setRequiredFields(fields);

    yearsSlider.onValueUpdated(value => {
        years = value;
    });
    rateSlider.onValueUpdated(value => {
        rate = value;
    });

    // Submit handler, it is called if validation is OK

    form.onSubmit(() => {
        const dom = new DomHandler();
        const loan = parseFloat(dom.find('#loan').getObject().value);
        const annualTax = parseFloat(dom.find('#annual-tax').getObject().value);
        const annualInsure = parseFloat(dom.find('#annual-insure').getObject().value);

        // formulas
        const principle = ((rate / 100) / 12) * loan / (1 - Math.pow((1 + ((rate / 100) / 12)), -years * 12));
        const tax = annualTax / 12;
        const insurance = annualInsure / 12;
        const total = principle + tax + insurance;
        // sets the results
        dom.find('#results').getObject().className = dom.find('#results').getObject().className.replace(/filled/, '');
        dom.find('#summary-principle').getObject().innerHTML = '$ ' + parseFloat(principle).toFixed(2);
        dom.find('#summary-tax').getObject().innerHTML = '$ ' + parseFloat(tax).toFixed(2);
        dom.find('#summary-insurance').getObject().innerHTML = '$ ' + parseFloat(insurance).toFixed(2);
        dom.find('#summary-total').getObject().innerHTML = '$ ' + parseFloat(total).toFixed(2);
        dom.find('#submit-button').getObject().innerHTML = 'Recalculate';

        // interval to show a message to user "fake loading"
        if (form._intervalId) {
            clearTimeout(form._intervalId);
        }

        form._intervalId = setTimeout(() => {
            // sets the CSS class OK and shows the results
            dom.find('#results').getObject().className += ' filled';
            const target = document.getElementById('results');
            // if mobile animate scroll to results
            if (Utils.isMobile()) {
                Animate.do(document.scrollingElement || document.documentElement, "scrollTop", "", 0, target.offsetTop, 500, true);
            }

        }, 300);
    });
});
