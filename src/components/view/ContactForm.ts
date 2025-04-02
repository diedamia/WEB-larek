import { IContactsFormView } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export class ContactsForm implements IContactsFormView{
    protected _element: HTMLElement;
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    email: string;
    phone: string;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this._element = cloneTemplate(template);
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this._element);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this._element);
        this._submitButton = ensureElement<HTMLButtonElement>('.button', this._element);
        this._errors = ensureElement('.form__errors', this._element);

        this._emailInput.addEventListener('input', () => {
            this.email = this._emailInput.value;
            this.validate();
        });

        this._phoneInput.addEventListener('input', () => {
            this.phone = this._phoneInput.value;
            this.validate();
        });

        this._element.addEventListener('submit', (e) => {
            e.preventDefault();
            events.emit('contacts:submit', {
                email: this._emailInput.value,
                phone: this._phoneInput.value
            });
        });
    }

    validate(): void {
        const isValid = !!this.email && !!this.phone;
        this._submitButton.disabled = !isValid;
        this._errors.textContent = isValid ? '' : 'Заполните все поля';
    }

    render(): HTMLElement {
        this.email = '';
        this.phone = '';
        this._emailInput.value = '';
        this._phoneInput.value = '';
        this._submitButton.disabled = true;
        return this._element;
    }
}