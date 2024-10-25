import { _decorator, Color, Component, Label, Node } from 'cc';
import MathUtils from '../Common/MathUtils';
const { ccclass, property } = _decorator;

@ccclass('MonitorUI')
export class MonitorUI extends Component {
    @property({type: Label})
    public receiveCash: Label | null = null;
    @property({type: Label})
    public changeCash: Label | null = null;
    @property({type: Label})
    public totalCash: Label | null = null;
    @property({type: Label})
    public giveCash: Label | null = null;

    protected start(): void {
        this.ResertMonitor();
    }

    public UpdateReceiveCash(cash: number): void {
        this.receiveCash.string = "$" + MathUtils.roundToTwoDecimal(cash);
    }

    public UpdateChangeCash(cash: number): void {
        this.changeCash.string = "$" + MathUtils.roundToTwoDecimal(cash);
    }

    public UpdateTotalCash(cash: number): void {
        this.totalCash.string = "$" + MathUtils.roundToTwoDecimal(cash);
    }

    public UpdateGiveCash(cash: number, isCorrect: boolean = false): void {
        this.giveCash.string = "$" + MathUtils.roundToTwoDecimal(cash);
        if(isCorrect) this.giveCash.color = Color.GREEN;
        else this.giveCash.color = Color.RED;
    }

    public ShowCashStrategy(): void {
        this.receiveCash.node.parent.active = true;
        this.changeCash.node.parent.active = true;
        this.totalCash.node.parent.active = true;
        this.giveCash.node.parent.active = true;
    }

    public ShowCreditCashStrategy(): void {
        this.receiveCash.node.parent.active = false;
        this.changeCash.node.parent.active = false;
        this.totalCash.node.parent.active = true;
        this.giveCash.node.parent.active = false;
    }

    public ResertMonitor()
    {
        this.totalCash.node.parent.active = true;
        this.receiveCash.node.parent.active = false;
        this.changeCash.node.parent.active = false;
        this.giveCash.node.parent.active = false;

        this.UpdateReceiveCash(0);
        this.UpdateChangeCash(0);
        this.UpdateTotalCash(0);
        this.UpdateGiveCash(0);
    }
}


