import { _decorator, Button, Component, Label, Node, Vec3 } from 'cc';
import { Bill } from '../Bill';
import { Constants } from '../Common/Constants';
import { GameController } from '../GameController';
import SimplePool from '../PoolSystem/SimplePool';
import { PoolType } from '../PoolSystem/PoolType';
import MathUtils from '../Common/MathUtils';
import { Cent } from '../Cent';
import { Dollar } from '../Dollar';
import { AudioSystem } from '../AudioSystem';
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

    private _cashEndPoint: Node | null = null;
    private _cashStartPoint: Node | null = null;

    private _bill: Bill | null = null;
    private _centVisible: Cent[] = [];
    private _dollarVisible: Dollar[] = [];

    protected onLoad(): void {
        for(let i = 0; i < this.centContainer.children.length; i++)
        {
            this.centContainer.children[i]
            .on(Button.EventType.CLICK, this.onClickCent.bind(this, this.centValues[i]));
        }

        for(let i = 0; i < this.dollarContainer.children.length; i++)
        {
            this.dollarContainer.children[i]
            .on(Button.EventType.CLICK, this.onClickDollar.bind(this, this.dollarValues[i]));
        }
    }

    protected start(): void {
        this._cashEndPoint = GameController.instance.cashEndPoint;
        this._cashStartPoint = GameController.instance.cashStartPoint;
    }

    public init(bill: Bill)
    {
        this._bill = bill;
    }

    public onClickReset(): void {
        this._bill.resertGiveCash();
        this.resertCashVisible();
    }

    public onClickOke(): void
    {
        if(this._bill.checkCompletedPayment())
        {
            AudioSystem.instance.playCorrectSound();
            this.resertCashVisible();
            this._bill.checkOutWithBill();
        }
        else
        {
            AudioSystem.instance.playInCorrectSound();
        }        
    }

    private resertCashVisible()
    {
        for(let i = 0; i < this._centVisible.length; i++)
        {
            SimplePool.despawn(this._centVisible[i]);
        }

        for(let i = 0; i < this._dollarVisible.length; i++)
        {
            SimplePool.despawn(this._dollarVisible[i]);
        }

        this._centVisible = [];
        this._dollarVisible = [];
    }

    public onClickCent(value: number)
    {
        this._bill.addGiveCash(value);
        let cent: Cent = SimplePool.spawnT<Cent>(PoolType.CENT, this._cashStartPoint.getWorldPosition(), 0); 
        cent.moveToTarget(this.getRandomEndPoint());    
        this._centVisible.push(cent);
    }

    public onClickDollar(value: number)
    {
        this._bill.addGiveCash(value);
        let dollar: Dollar = SimplePool.spawnT<Dollar>(PoolType.DOLLAR, this._cashStartPoint.getWorldPosition(), 0);        
        dollar.moveToTarget(this.getRandomEndPoint());
        this._dollarVisible.push(dollar);
    }

    private getRandomEndPoint()
    {
        return MathUtils.randomPointInAnnulus(this._cashEndPoint.getWorldPosition(), 0, 1);
    }
}


