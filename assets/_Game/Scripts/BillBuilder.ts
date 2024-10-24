import { Bill } from "./Bill";
import { Customer } from "./Customer";
import { MonitorUI } from "./GUI/MonitorUI";
import { PaymentStrategy } from "./PaymentStrategy";

export class BillBuilder {
    private _bill: Bill = null;

    public constructor() {
        this._bill = new Bill();
    }

    public withCustomer(customer: Customer): BillBuilder {
        this._bill.Customer = customer;
        return this;
    }

    public withPaymentStrategy(paymentStrategy: PaymentStrategy): BillBuilder {
        this._bill.Payment = paymentStrategy;
        return this;
    }

    public withMonitor(minitor: MonitorUI): BillBuilder
    {
        this._bill.Monitor = minitor;
        return this;
    }

    public build(): Bill
    {
        return this._bill;
    }
}


