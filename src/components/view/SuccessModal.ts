import { ISuccessModalView } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export class SuccessModal implements ISuccessModalView {
    protected _element: HTMLElement;
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        this._element = cloneTemplate(template);
        this._description = ensureElement<HTMLElement>('.order-success__description', this._element);
        this._button = ensureElement<HTMLButtonElement>('.order-success__close', this._element);

        this._button.addEventListener('click', () => {
            events.emit('success:close');
        });
    }

    render(total: number): HTMLElement {
        this._description.textContent = `Списано ${total} синапсов`;
        return this._element;
    }
}