import { IEvents } from "../base/events";
import { IModalView } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Modal implements IModalView {
    protected _container: HTMLElement;
    protected _content: HTMLElement;    
 	protected _pageWrapper: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        this._container = ensureElement<HTMLElement>(container);
        this._content = ensureElement<HTMLElement>('.modal__content', this._container);
        this._pageWrapper = document.querySelector(".page__wrapper");
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this._container);
        
        this._closeButton.addEventListener('click', this.close.bind(this));
        this._container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (e) => e.stopPropagation());
    }

    open(): void {
        this._container.classList.add('modal_active');
        this._pageWrapper.classList.add("page__wrapper_locked");
        this.events.emit('modal:open');
    }

    close(): void {
        this._container.classList.remove('modal_active');
        this._pageWrapper.classList.remove("page__wrapper_locked");
        this.content = null;
        this.events.emit('modal:close');
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }
}