import './scss/styles.scss';
import { API_URL, CDN_URL } from "./utils/constants";
import { ApiModel } from "./components/model/ApiModel";
import { EventEmitter } from "./components/base/events";
import { CatalogModel } from "./components/model/CatalogModel";
import { BasketModel } from "./components/model/BasketModel";
import { FormModel } from "./components/model/FormModel";
import { Modal } from "./components/view/Modal";
import { Catalog } from "./components/view/Catalog";
import { ProductModal } from "./components/view/ProductModal";
import { Basket } from "./components/view/Basket";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactForm";
import { SuccessModal } from "./components/view/SuccessModal";
import { IProduct, ApiListResponse, PaymentType } from "./types";
import { ensureElement } from "./utils/utils";

// Локальные данные товаров
const LOCAL_PRODUCTS = {
    "total": 10,
    "items": [
      {
        "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
        "description": "Если планируете решать задачи в тренажёре, берите два.",
        "image": "/5_Dots.svg",
        "title": "+1 час в сутках",
        "category": "софт-скил",
        "price": 750
      },
      {
        "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
        "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
        "image": "/Shell.svg",
        "title": "HEX-леденец",
        "category": "другое",
        "price": 1450
      },
      {
        "id": "b06cde61-912f-4663-9751-09956c0eed67",
        "description": "Будет стоять над душой и не давать прокрастинировать.",
        "image": "/Asterisk_2.svg",
        "title": "Мамка-таймер",
        "category": "софт-скил",
        "price": null
      },
      {
        "id": "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
        "description": "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
        "image": "/Soft_Flower.svg",
        "title": "Фреймворк куки судьбы",
        "category": "дополнительное",
        "price": 2500
      },
      {
        "id": "1c521d84-c48d-48fa-8cfb-9d911fa515fd",
        "description": "Если орёт кот, нажмите кнопку.",
        "image": "/mute-cat.svg",
        "title": "Кнопка «Замьютить кота»",
        "category": "кнопка",
        "price": 2000
      },
      {
        "id": "f3867296-45c7-4603-bd34-29cea3a061d5",
        "description": "Чтобы научиться правильно называть модификаторы, без этого не обойтись.",
        "image": "/Pill.svg",
        "title": "БЭМ-пилюлька",
        "category": "другое",
        "price": 1500
      },
      {
        "id": "54df7dcb-1213-4b3c-ab61-92ed5f845535",
        "description": "Измените локацию для поиска работы.",
        "image": "/Polygon.svg",
        "title": "Портативный телепорт",
        "category": "другое",
        "price": 100000
      },
      {
        "id": "6a834fb8-350a-440c-ab55-d0e9b959b6e3",
        "description": "Даст время для изучения React, ООП и бэкенда",
        "image": "/Butterfly.svg",
        "title": "Микровселенная в кармане",
        "category": "другое",
        "price": 750
      },
      {
        "id": "48e86fc0-ca99-4e13-b164-b98d65928b53",
        "description": "Очень полезный навык для фронтендера. Без шуток.",
        "image": "/Leaf.svg",
        "title": "UI/UX-карандаш",
        "category": "хард-скил",
        "price": 10000
      },
      {
        "id": "90973ae5-285c-4b6f-a6d0-65d1d760b102",
        "description": "Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.",
        "image": "/Mithosis.svg",
        "title": "Бэкенд-антистресс",
        "category": "другое",
        "price": 1000
      }
    ]
  } as ApiListResponse<IProduct>;

// Инициализация
const events = new EventEmitter();
const api = new ApiModel(CDN_URL, API_URL);

// Модели
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const formModel = new FormModel(events);

// Получаем шаблоны
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// View компоненты
const modal = new Modal(modalContainer, events);
const catalog = new Catalog(events, '#card-catalog');
const productModal = new ProductModal(cardPreviewTemplate, events);
const basket = new Basket(basketTemplate, events, basketItemTemplate);
const orderForm = new OrderForm(orderTemplate, events);
const contactsForm = new ContactsForm(contactsTemplate, events);
const successModal = new SuccessModal(successTemplate, events);

// Обработчики событий

// Загрузка товаров
function loadProducts() {
    try {
        const products = LOCAL_PRODUCTS.items.map(item => ({
            ...item,
            image: CDN_URL + item.image
        }));
        catalogModel.productCards = products;
    } catch (err) {
        console.error('Ошибка загрузки товаров:', err);
    }
}

// Обновление каталога
events.on('products:changed', () => {
    catalog.render(catalogModel.productCards);
});

// Выбор товара
events.on('card:select', (product: IProduct) => {
    catalogModel.selectedCard = product;
    const modalContent = productModal.render(product);
    // Проверяем, есть ли товар в корзине
    productModal.setButtonState(basketModel.contains(product.id));
    modal.content = modalContent;
    modal.open();
});

// Добавление в корзину
events.on('card:add', (data: { id: string }) => {
    const product = catalogModel.productCards.find(item => item.id === data.id);
    if (product) {
        basketModel.add(product);
        productModal.setButtonState(true);
    }
});

// Обновление корзины
events.on('basket:changed', () => {
    basket.update(basketModel.items, basketModel.total);
    const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
    basketCounter.textContent = String(basketModel.items.length);
});

// Открытие корзины
events.on('basket:open', () => {
    modal.content = basket.render(basketModel.items, basketModel.total);
    modal.open();
});

// Удаление из корзины
events.on('basket:remove', (data: { id: string }) => {
    basketModel.remove(data.id);
});

// Оформление заказа
events.on('order:start', () => {
    formModel.setField('items', basketModel.items.map(item => item.id));
    formModel.setField('total', basketModel.total);
    modal.content = orderForm.render();
    modal.open();
});

// Валидация формы заказа
events.on('orderForm:change', () => {
    orderForm.validate();
});

// Переход к контактам
events.on('order:submit', (data: { payment: PaymentType, address: string }) => {
    formModel.setField('payment', data.payment);
    formModel.setField('address', data.address);
    
    if (formModel.validate()) {
        modal.content = contactsForm.render();
    } else {
        console.error('Форма невалидна!');
    }
});

// Подтверждение заказа (мок для API)
events.on('contacts:submit', (data: { email: string, phone: string }) => {    
    formModel.setField('email', data.email);
    formModel.setField('phone', data.phone);
    if (formModel.validate()) {
        setTimeout(() => {
            basketModel.clear();
            modal.content = successModal.render(formModel.getOrderData().total);
            console.log('Заказ оформлен:', formModel.getOrderData());
        }, 500);
    }
});

// Закрытие успешного окна
events.on('success:close', () => {
    modal.close();
});

// Загрузка данных при старте
loadProducts();
/*import './scss/styles.scss';
import { API_URL, CDN_URL } from "./utils/constants";
import { ApiModel } from "./components/model/ApiModel";
import { EventEmitter } from "./components/base/events";
import { CatalogModel } from "./components/model/CatalogModel";
import { BasketModel } from "./components/model/BasketModel";
import { FormModel } from "./components/model/FormModel";
import { Modal } from "./components/view/Modal";
import { Catalog } from "./components/view/Catalog";
import { ProductModal } from "./components/view/ProductModal";
import { Basket } from "./components/view/Basket";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactForm";
import { SuccessModal } from "./components/view/SuccessModal";
import { IProduct } from "./types";
import { ensureElement } from "./utils/utils";

// Инициализация
const events = new EventEmitter();
const api = new ApiModel(CDN_URL, API_URL);

// Модели
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const formModel = new FormModel(events);

// Получаем шаблоны
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// View компоненты
const modal = new Modal(modalContainer, events);
const catalog = new Catalog(cardCatalogTemplate, events);
const productModal = new ProductModal(cardPreviewTemplate, events);
const basket = new Basket(basketTemplate, events, basketItemTemplate);
const orderForm = new OrderForm(orderTemplate, events);
const contactsForm = new ContactsForm(contactsTemplate, events);
const successModal = new SuccessModal(successTemplate, events);

// Обработчики событий

// Загрузка товаров
api.getProducts()
    .then(products => {
        catalogModel.productCards = products;
    })
    .catch(err => console.error('Ошибка загрузки товаров:', err));

// Обновление каталога
events.on('products:changed', () => {
    catalog.render(catalogModel.productCards);
});

// Выбор товара
events.on('card:select', (product: IProduct) => {
    catalogModel.selectedCard = product;
    const modalContent = productModal.render(product);
    // Проверяем, есть ли товар в корзине
    productModal.setButtonState(basketModel.contains(product.id));
    modal.content = modalContent;
    modal.open();
});

// Добавление в корзину
events.on('card:add', (data: { id: string }) => {
    const product = catalogModel.productCards.find(item => item.id === data.id);
    if (product) {
        basketModel.add(product);
        productModal.setButtonState(true);
    }
});

// Обновление корзины
events.on('basket:changed', () => {
    basket.update(basketModel.items, basketModel.total);
    const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
    basketCounter.textContent = String(basketModel.items.length);
});

// Открытие корзины
events.on('basket:open', () => {
    modal.content = basket.render(basketModel.items, basketModel.total);
    modal.open();
});

// Удаление из корзины
events.on('basket:remove', (data: { id: string }) => {
    basketModel.remove(data.id);
});

// Оформление заказа
events.on('order:start', () => {
    formModel.setField('items', basketModel.items.map(item => item.id));
    formModel.setField('total', basketModel.total);
    modal.content = orderForm.render();
    modal.open();
});

// Валидация формы заказа
events.on('orderForm:change', () => {
    orderForm.validate();
});

// Переход к контактам
events.on('order:submit', (data: { payment: PaymentType, address: string }) => {
    formModel.setField('payment', data.payment);
    formModel.setField('address', data.address);
    
    if (formModel.validate()) {
        modal.content = contactsForm.render();
    } else {
        console.error('Форма невалидна!');
    }
});

// Подтверждение заказа
events.on('contacts:submit', (data: { email: string, phone: string }) => {    
    formModel.setField('email', data.email);
    formModel.setField('phone', data.phone);
    if (formModel.validate()) {
        api.createOrder(formModel.getOrderData())
            .then(() => {
                basketModel.clear();
                modal.content = successModal.render(formModel.getOrderData().total);
            })
            .catch(err => console.error('Ошибка оформления заказа:', err));
    }
});

// Закрытие успешного окна
events.on('success:close', () => {
    modal.close();
});
*/