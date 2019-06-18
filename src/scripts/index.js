import '../styles/index.scss';
import Slider from './Slider/Slider';
import FormHandler from './FormHandler/FormHandler';
import DomHandler from "./DomHandler/DomHandler";

document.addEventListener('DOMContentLoaded', (event) => {
    console.info('BairesDev Coding Challenge');
    let years = 20;
    let rate = 8;
    let yearsSlider = new Slider('#years-mortgage', 1, 40, years, 0);
    let rateSlider = new Slider('#rate-interest', 0.1, 10, rate, 1);
    let form = new FormHandler('#form');
    form.setRequiredFields(['#loan', '#annual-tax', '#annual-insure']);
    yearsSlider.onValueUpdated(value => {
        years = value;
    });
    rateSlider.onValueUpdated(value => {
        rate = value;
    });
    form.onSubmit(() => {
        const dom = new DomHandler();
        const loan = parseFloat(dom.find('#loan').getObject().value);
        const annualTax = parseFloat(dom.find('#annual-tax').getObject().value);
        const annualInsure = parseFloat(dom.find('#annual-insure').getObject().value);

        const principle = ((rate / 100) / 12) * loan / (1 - Math.pow((1 + ((rate / 100) / 12)), -years * 12));
        const tax = annualTax / 12;
        const insurance = annualInsure / 12;
        const total = principle + tax + insurance;

        dom.find('#results').getObject().className = dom.find('#results').getObject().className.replace(/filled/, '');

        dom.find('#summary-principle').getObject().innerHTML = '$ ' + parseFloat(principle).toFixed(2);
        dom.find('#summary-tax').getObject().innerHTML = '$ ' + parseFloat(tax).toFixed(2);
        dom.find('#summary-insurance').getObject().innerHTML = '$ ' + parseFloat(insurance).toFixed(2);
        dom.find('#summary-total').getObject().innerHTML = '$ ' + parseFloat(total).toFixed(2);
        dom.find('#submit-button').getObject().innerHTML = 'Recalculate';
        if (form._intervalId) {
            clearTimeout(form._intervalId);
        }
        form._intervalId = setTimeout(() => {
            dom.find('#results').getObject().className += ' filled';
        }, 300);
    });
});
