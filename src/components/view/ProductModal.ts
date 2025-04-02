import { IProduct, IProductModalView } from "../../types";
import { Card } from "./Card";
import { IEvents } from "../base/events";

export class ProductModal extends Card implements IProductModalView {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    private _productId: string | null = null;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        super(template);
        this._description = this._element.querySelector('.card__text');
        this._button = this._element.querySelector('.card__button');
        
        this._button.addEventListener('click', () => {
            this.events.emit('card:add', { id: this._productId });
        });
    }

    render(product: IProduct): HTMLElement {
        super.render(product);
        this._productId = product.id;
        this._description.textContent = product.description;
        this._button.disabled = product.price === null;
        return this._element;
    }

    setButtonState(isInBasket: boolean): void {
        this._button.disabled = isInBasket || this._button.disabled;
    }
}