import Pool from "./Pool";
import PoolMember from "./PoolMember";
import { PoolType } from "./PoolType";
import { Node, Vec3 } from 'cc';
import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('SimplePool')
export default class SimplePool {
    private static listInfoPools: Map<PoolType, Pool> = new Map<PoolType, Pool>();

    static isHasPool(poolType: PoolType): boolean {
        console.log("SimplePool.isHasPool");
        return this.listInfoPools.has(poolType);
    }

    static preload(prefab: PoolMember, parentNode: Node, amount: number) {
        console.log("SimplePool.preload");
        let pool = new Pool(prefab, parentNode, amount);
        if (!this.isHasPool(pool.poolType)) {
            this.newPool(pool.poolType, pool);
        }
    }

    static newPool(poolType: PoolType, pool: Pool) {
        console.log("SimplePool.newPool");
        this.listInfoPools.set(poolType, pool);
    }

    static despawn(prefab: PoolMember) {
        this.getPool(prefab.poolType).despawn(prefab);
    }

    static getPool(poolType: PoolType): Pool {
        return this.listInfoPools.get(poolType);
    }

    static spawnT<T>(poolType: PoolType, pos: Vec3, angle: number): T {
        return this.spawn(poolType, pos, angle) as T;
    }

    static spawn(poolType: PoolType, pos: Vec3, angle: number) {
        if (!this.isHasPool(poolType)) 
            console.error("PoolType " + poolType + " chưa được định nghĩa.");
        return this.getPool(poolType).spawn(pos, angle);
    }
}
