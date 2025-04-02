import { IProduct, ICardView, Category } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/events";

export class Card implements ICardView {
    protected _element: HTMLElement;
    protected _image: HTMLImageElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;

    constructor(template: HTMLTemplateElement) {
        this._element = cloneTemplate(template);
        this._image = this._element.querySelector('.card__image');
        this._title = this._element.querySelector('.card__title');
        this._price = this._element.querySelector('.card__price');
        this._category = this._element.querySelector('.card__category');
    }

    render(data: IProduct): HTMLElement {
        this._image.src = data.image;
        this._image.alt = data.title;
        this._title.textContent = data.title;
        this._price.textContent = data.price ? `${data.price} синапсов` : 'Бесценно';
        this._category.textContent = data.category;
        this._category.className = `card__category card__category_${this.getCategoryClass(data.category)}`;
        return this._element;
    }

    protected getCategoryClass(category: Category): string {
        const categoryMap: Record<Category, string> = {
            'софт-скил': 'soft',
            'хард-скил': 'hard',
            'дополнительное': 'additional',
            'кнопка': 'button',
            'другое': 'other'
        };
        return categoryMap[category];
    }
}