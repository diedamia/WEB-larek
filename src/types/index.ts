export type Category = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: Category;
  price: number | null;
}

export type PaymentType = 'online' | 'cash';

export interface IUser {
  payment: PaymentType;
  address: string;
  email: string;
  phone: string;
}

export interface IOrder extends IUser {
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export type FormErrors = Partial<Record<keyof IUser, string>>;

export interface IBasketModel {
    items: IProduct[];
    add(item: IProduct): void;
    remove(id: string): void;
    total: number;
    clear(): void;
    getCount(): number;
    contains(id: string): boolean;
}

export interface IFormModel {
    setField<K extends keyof IUser>(field: K, value: IUser[K]): void;
    validate(): boolean;
    getOrderData(): IOrder;
}

export interface IApiModel {
    getProducts(): Promise<IProduct[]>;
    createOrder(order: IOrder): Promise<IOrderResult>;
}

export interface ICatalogModel {
  productCards: IProduct[];
  selectedCard: IProduct | null;
  showCard(item: IProduct): void;
}

export interface ICardView {
  render(data: IProduct): HTMLElement;
}

export interface ICatalogView {
  render(products: IProduct[]): void;
}

export interface IModalView {
  open(): void;
  close(): void;
}

export interface IProductModalView {
  render(product: IProduct): HTMLElement;
  setButtonState(isInBasket: boolean): void;
}

export interface IBasketItemView {
  render(data: IProduct, index: number): HTMLElement;
}

export interface IBasketView {
  render(items: IProduct[], total: number): HTMLElement;
  update(items: IProduct[], total: number): void;
}

export interface IOrderFormView {
  payment: PaymentType | null;
  address: string;
  render(): HTMLElement;
  validate(): void;
}

export interface IContactsFormView {
  email: string;
  phone: string;
  render(): HTMLElement;
  validate(): void;
}

export interface ISuccessModalView {
  render(total: number): HTMLElement;
}


export type ApiListResponse<Type> = {
  total: number;
  items: Type[];
};