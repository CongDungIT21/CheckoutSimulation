import { _decorator, Component, math, Node, tween, Tween, Vec3 } from 'cc';
import PoolMember from './PoolSystem/PoolMember';
import { Easing } from './Common/Easing';
const { ccclass, property } = _decorator;

@ccclass('Cent')
export class Cent extends PoolMember {
    moveToTarget(target: Vec3) {
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(0.5, { position: target }, {easing: Easing.CubicOut})
            .start();
    }
}


