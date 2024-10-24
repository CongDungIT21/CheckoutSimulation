import { _decorator, Component, director, find, Node } from 'cc';
import { PopupCash } from './PopupCash';
import { PopupCreditCash } from './PopupCreditCash';
import { Bill } from '../Bill';
const { ccclass, property } = _decorator;

@ccclass('GUIManager')
export class GUIManager extends Component {
    private static _instance: GUIManager | null = null;

    public static get instance(): GUIManager {
        if (!this._instance) {
            this._instance = find(this.name)?.getComponent(GUIManager);

            if (!this._instance) {
                let generatorNode: Node = new Node(this.name);
                this._instance = generatorNode.addComponent(GUIManager);

                director.getScene().addChild(generatorNode);
                console.log("Auto create " + this.name);
            }
        }
        return this._instance;
    }

    @property(PopupCash)
    public PopupCash: PopupCash | null = null;

    @property(PopupCreditCash)
    public PopupCreditCash: PopupCreditCash | null = null;

    protected onLoad(): void {
        GUIManager._instance = this;
    }

    protected start(): void {
        this.HidePopupCash();
        this.HidePopupCreditCash();
        this.HidePopupCash();
    }

    public ShowPopupCash(bill: Bill)
    {
        this.PopupCash.node.active = true;
        this.PopupCash.init(bill);
    }

    public HidePopupCash()
    {
        this.PopupCash.node.active = false;
    }

    public ShowPopupCreditCash(bill: Bill)
    {
        this.PopupCreditCash.node.active = true;
        this.PopupCreditCash.init(bill);
    }

    public HidePopupCreditCash()
    {
        this.PopupCreditCash.node.active = false;
    }
}


