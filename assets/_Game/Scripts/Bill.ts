import MathUtils from "./Common/MathUtils";
import { Customer } from "./Customer";
import { ProductToBuyData } from "./Data/ProductToBuyData";
import { GameController } from "./GameController";
import { MonitorUI } from "./GUI/MonitorUI";
import { PaymentStrategy } from "./PaymentStrategy";
import { Product } from "./Product";

export class Bill {
    public _payment: PaymentStrategy;
    public set Payment(payment: PaymentStrategy)
    {
        this._payment = payment;
    }

    public Monitor: MonitorUI;
    public _customer: Customer;
    public set Customer(customer: Customer) {
        this._customer = customer;

        for(let i = 0; i < this._customer.Data.listProductToBuy.length; i++)
        {
            let productToBuyData: ProductToBuyData = this._customer.Data.listProductToBuy[i];
            this._mapProducts.set(productToBuyData.Product.ID, productToBuyData.Amount);
        }
    }

    private total: number = 0;
    private change: number = 0;
    private receive: number = 0;
    private give: number = 0;

    private _mapProducts: Map<number, number> = new Map<number, number>(); //ID Product - amount

    public addProductToBill(product: Product): void {
        if(this._mapProducts.has(product.Data.ID))
        {
            console.log("this._mapProducts[product.Data.ID] Before: " + this._mapProducts.get(product.Data.ID));
            let amount: number = this._mapProducts.get(product.Data.ID) - 1;
            this._mapProducts.set(product.Data.ID, amount);

            this.total += product.Data.Price;
            this.Monitor.UpdateTotalCash(this.total);

            if(this._mapProducts.get(product.Data.ID) === 0) 
            {                
                this._mapProducts.delete(product.Data.ID);

                if(this._mapProducts.size === 0)
                {
                    //this.Payment.ShowUI();
                    this._payment.ShowPaymentMethod(this._customer);
                }
            }
        }
        else
        {
            console.log("The product cannot be paid because no customer purchased it.");
        }
    }

    public receiveCash(cash: number): void
    {
        this.receive = cash;
        this.Monitor.UpdateReceiveCash(this.receive);

        this.change = this.receive - this.total;
        this.Monitor.UpdateChangeCash(this.change);
    }

    public giveCash(cash: number): void
    {
        this.give = cash;
        this.Monitor.UpdateGiveCash(this.give);
    }

    public addGiveCash(cash: number): void
    {
        this.give += cash;
        this.give = MathUtils.roundToTwoDecimalNormalize(this.give);
        this.Monitor.UpdateGiveCash(this.give);
    }

    public checkCompletedPayment(): boolean
    {
        if(this.receive - this.total - this.give === 0)
        {
            console.log("Payment Completed");
            GameController.instance.checkOutCompleted();
            return true;
        }
        else
        {
            console.log("Payment Failed");
            return false;
        }
    }

    public resertGiveCash()
    {
        this.give = 0;
        this.Monitor.UpdateGiveCash(this.give);
    }

    public ShowPaymentUI()
    {
        this._payment.ShowPaymentUI(this, this.Monitor);
        let receive = this._payment.CaculatorReceive(this.total);
        this.receiveCash(receive);
    }
}


