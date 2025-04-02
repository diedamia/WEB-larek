import { IProduct, IBasketModel } from "../../types";
import { IEvents } from "../base/events";

export class BasketModel implements IBasketModel {
    private _items: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    get items(): IProduct[] {
        return this._items;
    }

    add(item: IProduct): void {
        if (!this.contains(item.id)) {
            this._items.push(item);
            this.events.emit('basket:changed');
        }
    }

    remove(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit('basket:changed');
    }

    get total(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    clear(): void {
        this._items = [];
        this.events.emit('basket:changed');
    }

    getCount(): number {
        return this._items.length;
    }

    contains(id: string): boolean {
        return this._items.some(item => item.id === id);
    }

    isEmpty(): boolean {
        return this._items.length === 0;
    }
}