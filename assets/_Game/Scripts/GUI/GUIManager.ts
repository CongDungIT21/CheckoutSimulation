import { _decorator, Component, director, find, Node, tween, Tween, Vec3 } from 'cc';
import { PopupCash } from './PopupCash';
import { PopupCreditCash } from './PopupCreditCash';
import { Bill } from '../Bill';
import { Easing } from '../Common/Easing';
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
        //this.PopupCash.node.active = true;
        this.TweenShow(this.PopupCash.node);
        this.PopupCash.init(bill);        
    }

    public HidePopupCash()
    {
        //this.PopupCash.node.active = false;
        this.TweenHide(this.PopupCash.node);
    }

    public ShowPopupCreditCash(bill: Bill)
    {
        this.TweenShow(this.PopupCreditCash.node);
        this.PopupCreditCash.init(bill);
    }

    public HidePopupCreditCash()
    {
        //this.PopupCreditCash.node.active = false;
        this.TweenHide(this.PopupCreditCash.node);
    }

    private TweenShow(node: Node)
    {
        Tween.stopAllByTarget(node);
        tween(node)
            .call(() => {
                node.active = true;
                node.scale = new Vec3(0.6, 0.6, 0.6);
            })
            .to(0.2, { scale: new Vec3(1, 1, 1)}, {easing: Easing.BackOut})
            .start();
    }

    private TweenHide(node: Node)
    {
        Tween.stopAllByTarget(node);
        tween(node)
            .to(0.2, { scale: new Vec3(0.6, 0.6, 0.6)}, {easing: Easing.BackIn})
            .call(() => node.active = false)
            .start();
    }
}


