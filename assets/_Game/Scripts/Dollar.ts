import { _decorator, Component, math, Node, tween, Tween, Vec3 } from 'cc';
import PoolMember from './PoolSystem/PoolMember';
import { Easing } from './Common/Easing';
import MathUtils from './Common/MathUtils';
const { ccclass, property } = _decorator;

@ccclass('Dollar')
export class Dollar extends PoolMember {
    moveToTarget(target: Vec3) {
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(0.5, { position: target }, {easing: Easing.CubicOut})
            .start();

        tween(this.node)
            .to(0.5, {eulerAngles: new Vec3(0, MathUtils.randomAngle(), 0)}, {easing: Easing.CubicOut})
            .start();
    }
}


