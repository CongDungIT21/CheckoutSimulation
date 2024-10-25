import PoolMember from "./PoolMember";
import { PoolType } from "./PoolType";
import { _decorator, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Pool')
export default class Pool {
    private parentNode: Node;
    private prefab: PoolMember;
    private listMember: PoolMember[] = [];

    constructor(prefab: PoolMember, parentNode: Node, amount: number) {
        console.log("Pool.constructor: " + typeof prefab);
        this.preLoad(prefab, parentNode, amount);
    }

    public get poolType(): PoolType {
        return this.prefab.poolType;
    }

    preLoad(prefab: PoolMember, parentNode: Node, amount: number) {
        console.log("Pool.preLoad", prefab, parentNode, amount);
        this.prefab = instantiate(prefab).getComponent(PoolMember);
        this.parentNode = parentNode;
        console.log("22222");
        for (let i = 0; i < amount; i++) {
            let clone = instantiate(this.prefab.node).getComponent(PoolMember);
            this.parentNode.addChild(clone.node);
            clone.node.active = false;

            this.listMember.push(clone);
        }

        console.log("this.listMember", this.listMember);
    }

    despawn(prefab: PoolMember) {
        console.log("Despawn: ", this.prefab);
        if (prefab.node.active) {
            prefab.node.active = false;
            this.listMember.push(prefab);
        }
    }

    spawn(pos: Vec3, angle: number) {
        let poolNode = null;

        if (this.listMember.length > 0) {
            poolNode = this.listMember.shift();
        } else {
            poolNode = instantiate(this.prefab.node).getComponent(PoolMember);
            this.parentNode.addChild(poolNode.node);
        }

        poolNode.node.setWorldPosition(pos);
        poolNode.node.angle = angle;
        poolNode.node.active = true;

        return poolNode;
    }
}
