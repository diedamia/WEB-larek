import { IProduct, ICatalogView } from "../../types";
import { IEvents } from "../base/events";
import { Card } from "./Card";
import { cloneTemplate, ensureElement } from "../../utils/utils";

export class Catalog implements ICatalogView {
    protected _container: HTMLElement;
    protected _cardTemplate: HTMLTemplateElement; // Изменили тип
    protected _basketButton: HTMLButtonElement;

    constructor(
        protected events: IEvents,
        cardTemplateId: string // Принимаем ID шаблона, а не сам шаблон
    ) {
        this._container = ensureElement<HTMLElement>('.gallery');
        this._cardTemplate = ensureElement<HTMLTemplateElement>(cardTemplateId); // Получаем шаблон
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket');
        
        this._basketButton.addEventListener('click', () => {
            events.emit('basket:open');
        });
    }

    render(products: IProduct[]): void {
        this._container.innerHTML = '';
        products.forEach(item => {
            const card = new Card(this._cardTemplate); // Передаем шаблон
            const element = card.render(item);
            element.addEventListener('click', () => {
                this.events.emit('card:select', item);
            });
            this._container.appendChild(element);
        });
    }
}