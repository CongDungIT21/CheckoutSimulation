import { _decorator, Camera, Component, director, easing, find, Node, tween, Tween, Vec3 } from 'cc';
import { CustomerData } from './Data/CustomerData';
import { GameController } from './GameController';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {
    @property({type: Node})
    public cash: Node | null = null;
    @property({type: Node})
    public creditCash: Node | null = null;

    private _data: CustomerData;
    public get Data(): CustomerData {
        return this._data;
    }

    protected onLoad(): void {
        this.HidePaymentMethod();
    }

    public Init(data: CustomerData) {
        this._data = data;
        this.node.setRotationFromEuler(new Vec3(0, -90, 0));
    }
    public moveToTarget(target: Vec3)
    {
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(2, { position: target }, {easing: "sineIn"})   
            .call(() => {
                if(GameController.instance.canCheckOut(this))
                {
                    GameController.instance.checkOut(this);
                }            
            })         
            .start();
    }

    public ShowCreditCash()
    {
        this.cash.active = false;
        this.creditCash.active = true;
    }

    public HidePaymentMethod()
    {
        this.cash.active = false;
        this.creditCash.active = false;
    }

    public ShowCash()
    {
        this.cash.active = true;
        this.creditCash.active = false;
    }

    public OnClickPaymentMethod()
    {
        GameController.instance.ShowPaymentUI();
        this.HidePaymentMethod();
    }

    public MoveOutMaket(target: Vec3)
    {
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(2, { position: target }, {easing: "sineIn"})   
            .call(() => {
                this.destroy();           
            })         
            .start();
    }

    public getDegreeAngleFromDirection(x: number, y: number): number {
        const radianAngle = Math.atan2(y, x);
        const angle = (radianAngle / Math.PI) * 180;
    
        return angle < 0 ? angle + 360 : angle;
    }
}


