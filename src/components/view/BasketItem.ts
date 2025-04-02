import { IProduct, IBasketItemView } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";

export class BasketItem implements IBasketItemView {
    protected _element: HTMLElement;
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement) {
        this._element = cloneTemplate(template);
        this._index = ensureElement<HTMLElement>('.basket__item-index', this._element);
        this._title = ensureElement<HTMLElement>('.card__title', this._element);
        this._price = ensureElement<HTMLElement>('.card__price', this._element);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this._element);
    }

    render(data: IProduct, index: number): HTMLElement {
        this._index.textContent = String(index + 1);
        this._title.textContent = data.title;
        this._price.textContent = `${data.price} синапсов`;
        return this._element;
    }

    set onDelete(callback: () => void) {
        this._deleteButton.addEventListener('click', callback);
    }
}