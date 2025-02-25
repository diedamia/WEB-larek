type Category = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

interface Product {
  id: string;
  description: string;
  image: string;
  title: string;
  category: Category;
  price: number | null;
}

type PaymentType = 'card' | 'cash';

interface User {
  payment: PaymentType;
  address: string;
  email: string;
  phone: string;
}

interface Cart {
    items: Product[];
    add(product: Product): void;
    remove(id: string): void;
    getTotal(): number;
  }

interface ModalView {
  onOpen(callback: () => void): void;
  onClose(callback: () => void): void;
}

interface CatalogView {
    render(products: Product[]): void;
    onProductClick(callback: (id: string) => void): void;
    onGoToCart(callback: () => void): void;
}

interface ProductModalView {
    render(product: Product): void;
    onAddToCart(callback: () => void): void;
}

interface CartView {
    render(items: Product[]): void;
    renderTotal(total: number): void;
    onRemoveItem(callback: (id: string) => void): void;
    onCheckout(callback: () => void): void;
}

interface OrderFormView {
    render(): void;
    onNextStep(callback: () => void): void;
}

interface ContactFormView {
    render(): void;
    onSubmit(callback: () => void): void;
}

interface SuccessModalView {
    render(total: number): void;
    onContinueShopping(callback: () => void): void;
}

export {
    Category,
    PaymentType,
    Product,
    User,
    Cart,
    ModalView,
    CatalogView,
    ProductModalView,
    CartView,
    OrderFormView,
    ContactFormView,
    SuccessModalView,
  };