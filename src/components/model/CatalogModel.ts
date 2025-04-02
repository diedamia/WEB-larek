import { IProduct, ICatalogModel } from "../../types";
import { IEvents } from "../base/events";


export class CatalogModel implements ICatalogModel {
    protected _productCards: IProduct[];
    selectedCard: IProduct | null;

    constructor(protected events: IEvents) {
        this._productCards = [];
        this.selectedCard = null;
    }

    set productCards(data: IProduct[]) {
        this._productCards = data;
        this.events.emit("products:changed");
    }

    get productCards(): IProduct[] {
        return this._productCards;
    }

    showCard(item: IProduct): void {
        this.selectedCard = item;
        this.events.emit("card:selected", item);
    }
}