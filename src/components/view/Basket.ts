import { IProduct, IBasketView } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { BasketItem } from "./BasketItem";

export class Basket implements IBasketView {
    protected _element: HTMLElement;
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(
        template: HTMLTemplateElement,
        protected events: IEvents,
        protected itemTemplate: HTMLTemplateElement
    ) {
        this._element = cloneTemplate(template);
        this._list = ensureElement<HTMLElement>('.basket__list', this._element);
        this._total = ensureElement<HTMLElement>('.basket__price', this._element);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this._element);

        this._button.addEventListener('click', () => {
            events.emit('order:start');
        });
    }

    render(items: IProduct[], total: number): HTMLElement {
        this.update(items, total);
        return this._element;
    }

    update(items: IProduct[], total: number): void {
        this._list.innerHTML = '';
        items.forEach((item, index) => {
            const itemView = new BasketItem(this.itemTemplate);
            const element = itemView.render(item, index);
            itemView.onDelete = () => this.events.emit('basket:remove', {id: item.id});
            this._list.appendChild(element);
        });
        this._total.textContent = `${total} синапсов`;
        this._button.disabled = items.length === 0;
    }
}