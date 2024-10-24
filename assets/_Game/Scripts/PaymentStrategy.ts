import { Bill } from "./Bill";
import MathUtils from "./Common/MathUtils";
import { Customer } from "./Customer";
import { GUIManager } from "./GUI/GUIManager";
import { MonitorUI } from "./GUI/MonitorUI";

export abstract class PaymentStrategy
{
    public abstract ShowPaymentMethod(customer: Customer): void;
    public abstract HidePaymentMethod(customer: Customer): void;
    public abstract ShowPaymentUI(bill: Bill, monitor: MonitorUI): void;
    public abstract HidePaymentUI(): void;
    public abstract CaculatorReceive(total: number): number;
}

export class CashPaymentStrategy extends PaymentStrategy
{
    public ShowPaymentMethod(customer: Customer): void {
        customer.ShowCash();
    }

    public HidePaymentMethod(customer: Customer): void {
        customer.HidePaymentMethod();
    }

    public ShowPaymentUI(bill: Bill,monitor: MonitorUI): void {
        monitor.ShowCashStrategy();
        GUIManager.instance.ShowPopupCash(bill);
    }

    public HidePaymentUI(): void {
        GUIManager.instance.HidePopupCash();
    }

    public CaculatorReceive(total: number): number
    {
        return total + MathUtils.getRandomNumber(10, 30);
    }
}

export class CreditCardPaymentStrategy extends PaymentStrategy
{
    public ShowPaymentMethod(customer: Customer): void {
        customer.ShowCreditCash();
    }

    public HidePaymentMethod(customer: Customer): void {
        customer.HidePaymentMethod();
    }

    public ShowPaymentUI(bill: Bill, monitor: MonitorUI): void {
        monitor.ShowCreditCashStrategy();
        GUIManager.instance.ShowPopupCreditCash(bill);
    }

    public HidePaymentUI(): void {
        GUIManager.instance.HidePopupCreditCash();
    }

    public CaculatorReceive(total: number): number
    {
        return 0;
    }
}