import { _decorator, Button, Component, Label, Node } from 'cc';
import { Constants } from '../Common/Constants';
import { Bill } from '../Bill';
const { ccclass, property } = _decorator;

@ccclass('PopupCreditCash')
export class PopupCreditCash extends Component {
    @property({type: Node})
    public keys: Node = null;
    @property({type: Label})
    public lblReceive: Label = null;

    private _bill: Bill | null = null;
    private keyValues: string[] = [Constants.KEY_ONE, Constants.KEY_TWO, Constants.KEY_THREE, Constants.KEY_FOUR, Constants.KEY_FIVE, Constants.KEY_SIX, Constants.KEY_SEVEN, Constants.KEY_EIGHT, Constants.KEY_NINE, Constants.KEY_REMOVE, Constants.KEY_ZERO, Constants.KEY_DOT];
    
    protected onLoad(): void {
        for(let i = 0; i < this.keys.children.length; i++)
        {
            this.keys.children[i]
            .on(Button.EventType.CLICK, this.onClickKey.bind(this, this.keyValues[i]));
        }
    }

    public init(bill: Bill) {
        this._bill = bill;
        this.UpdateReceive(""); //Clear the text
    }

    protected onClickKey(value: string)
    {
        let newStr: string = this.lblReceive.string + value;
        this.UpdateReceive(newStr);
    }

    protected onClickOke()
    {
        if(this.ValidationStringToNumber(this.lblReceive.string))
        {
            let num: number = parseFloat(this.lblReceive.string);
            this._bill.receiveCash(num);
            if(!this._bill.checkCompletedPayment())
            {
                this.UpdateReceive("");
            }            
        }                
        else
        {
            this.UpdateReceive("");
        }
    }

    protected onClickRemove()
    {
        let newStr: string = this.lblReceive.string.slice(0, -1);    
        this.UpdateReceive(newStr);    
    }

    protected UpdateReceive(value: string)
    {
        this.lblReceive.string = value;
    }

    private ValidationStringToNumber(str: string)
    {
        let pattern = /^\d+\.?\d*$/;
        return pattern.test(str);
    }
}


