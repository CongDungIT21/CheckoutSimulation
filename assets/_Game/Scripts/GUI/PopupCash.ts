import { _decorator, Button, Component, Label, Node } from 'cc';
import { Bill } from '../Bill';
import { Constants } from '../Common/Constants';
import { GameController } from '../GameController';
const { ccclass, property } = _decorator;

interface IPaymentUI
{
    UpdateReceiveCash(cash: number): void;
    UpdateChangeCash(cash: number): void;
    UpdateTotalCash(cash: number): void;
}

@ccclass('PopupCash')
export class PopupCash extends Component {
    @property(Node)
    private centContainer: Node | null = null;
    @property(Node)
    private dollarContainer: Node | null = null;
    
    private centValues: number[] = [Constants.ONE_CENT, Constants.FIVE_CENT, Constants.TEN_CENT, Constants.TWENTY_CENT, Constants.FIFTY_CENT];
    private dollarValues: number[] = [Constants.ONE_DOLLAR, Constants.FIVE_DOLLAR, Constants.TEN_DOLLAR, Constants.TWENTY_DOLLAR, Constants.FIFTY_DOLLAR];

    private _bill: Bill | null = null;

    protected onLoad(): void {
        for(let i = 0; i < this.centContainer.children.length; i++)
        {
            this.centContainer.children[i]
            .on(Button.EventType.CLICK, this.onClickMoney.bind(this, this.centValues[i]));
        }

        for(let i = 0; i < this.dollarContainer.children.length; i++)
        {
            this.dollarContainer.children[i]
            .on(Button.EventType.CLICK, this.onClickMoney.bind(this, this.dollarValues[i]));
        }
    }

    public init(bill: Bill)
    {
        this._bill = bill;
    }

    public onClickReset(): void {
        this._bill.resertGiveCash();
    }

    public onClickOke(): void
    {
        this._bill.checkCompletedPayment();
    }

    public onClickMoney(value: number)
    {
        this._bill.addGiveCash(value);
    }
}


