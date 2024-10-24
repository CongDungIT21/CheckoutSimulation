import { _decorator, Component, Node, tween, Tween, Vec3 } from 'cc';
import { ProductToBuyData } from './Data/ProductToBuyData';
import { ProductData } from './Data/ProductData';
import { GameController } from './GameController';
import { Easing } from './Common/Easing';
const { ccclass, property } = _decorator;

export interface ICheckout
{
    checkOut(): void;
}

@ccclass('Product')
export class Product extends Component implements ICheckout{
    private _data: ProductData = null;
    public get Data(): ProductData
    {
        return this._data;
    }

    Init(data: ProductData) {
        this._data = data;
    }

    public moveToTarget(target: Vec3, delay: number)
    {
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .delay(delay)
            .by(0.2, {position: new Vec3(0, 1.5, 0)}, {easing: Easing.ExpoOut})
            .to(0.4, {position: target}, {easing: Easing.ExpoIn})
            .start();
    }

    public checkOut()
    {
        //SFX, VFX....
        GameController.instance.checkOutProduct(this);
        this.node.destroy();
    }
}


