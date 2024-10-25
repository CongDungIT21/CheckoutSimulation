import PoolAmount from "./PoolAmount";
import SimplePool from "./SimplePool";
import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PoolControl')
export default class PoolControl extends Component {

    @property([PoolAmount])
    pools: PoolAmount[] = [];

    onLoad() {
        console.log("PoolControl OnLoad " + typeof(this.pools[0].prefab));
        for (let i = 0; i < this.pools.length; i++) {
            SimplePool.preload(this.pools[i].prefab, this.pools[i].root, this.pools[i].amount);
        }
    }
}
