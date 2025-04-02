import { PaymentType, IOrderFormView } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export class OrderForm implements IOrderFormView{
    protected _element: HTMLElement;
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    payment: PaymentType;
    address: string;

    private highlightSelectedPayment(): void {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === this.payment);
        });
    }

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this._element = cloneTemplate(template);
        this._paymentButtons = Array.from(this._element.querySelectorAll('.button_alt'));
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this._element);
        this._submitButton = ensureElement<HTMLButtonElement>('.order__button', this._element);
        this._errors = ensureElement('.form__errors', this._element);


        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name as PaymentType;
                this.highlightSelectedPayment();
                this.validate();
            });
        });

        this._addressInput.addEventListener('input', () => {
            this.address = this._addressInput.value;
            this.validate();
        });

        this._element.addEventListener('submit', (e) => {
            e.preventDefault();
            events.emit('order:submit', { 
                payment: this.payment, 
                address: this.address 
            });
        });
    }

    validate(): void {
        const isValid = !!this.payment && !!this.address;
        this._submitButton.disabled = !isValid;
        this._errors.textContent = isValid ? '' : 'Заполните все поля';
        this.highlightSelectedPayment();

    }

    render(): HTMLElement {
        this.payment = null;
        this.address = '';
        this._addressInput.value = '';
        this._submitButton.disabled = true;
        return this._element;
    }
}