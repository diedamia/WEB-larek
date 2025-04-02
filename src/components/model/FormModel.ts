import { IOrder, FormErrors, PaymentType, IFormModel } from "../../types";
import { IEvents } from "../base/events";

export class FormModel implements IFormModel {
    protected orderData: Partial<IOrder> = {};
    protected errors: FormErrors = {};
    protected currentStep: 'payment' | 'contacts' = 'payment';

    constructor(protected events: IEvents) {}

    setField<K extends keyof IOrder>(field: K, value: IOrder[K]): void {
        this.orderData[field] = value;
        this.validate();
    }

    setStep(step: 'payment' | 'contacts'): void {
        this.currentStep = step;
        this.validate();
    }

    validate(): boolean {
        this.errors = {};

        // Проверки для шага оплаты/адреса
        if (this.currentStep === 'payment') {
            if (!this.orderData.address) {
                this.errors.address = "Укажите адрес доставки";
            }
            if (!this.orderData.payment) {
                this.errors.payment = "Выберите способ оплаты";
            }
        } 
        // Проверки для шага контактов
        else if (this.currentStep === 'contacts') {
            if (!this.orderData.email) {
                this.errors.email = "Укажите email";
            }
            if (!this.orderData.phone) {
                this.errors.phone = "Укажите номер телефона";
            }
        }

        this.events.emit("form:errors", this.errors);
        return Object.keys(this.errors).length === 0;
    }

    validatePaymentStep(): boolean {
        this.currentStep = 'payment';
        return this.validate();
    }

    validateContactsStep(): boolean {
        this.currentStep = 'contacts';
        return this.validate();
    }

    getOrderData(): IOrder {
        if (!this.validateContactsStep()) {
            throw new Error("Не все обязательные поля заполнены");
        }
        return {
            payment: this.orderData.payment as PaymentType,
            address: this.orderData.address as string,
            email: this.orderData.email as string,
            phone: this.orderData.phone as string,
            items: this.orderData.items || [],
            total: this.orderData.total || 0
        };
    }
}