import { ApiListResponse, Api } from "../base/api";
import { IProduct, IOrder, IOrderResult, IApiModel } from "../../types";


export class ApiModel extends Api implements IApiModel {
    constructor(baseUrl: string, protected cdnUrl: string) {
        super(baseUrl);
    }

    getProducts(): Promise<IProduct[]> {
        return this.get('/product')
            .then((data: ApiListResponse<IProduct>) => 
                data.items.map(item => ({
                    ...item,
                    image: this.cdnUrl + item.image
                }))
            );
    }

    createOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order)
            .then((data: IOrderResult) => data);
    }
}