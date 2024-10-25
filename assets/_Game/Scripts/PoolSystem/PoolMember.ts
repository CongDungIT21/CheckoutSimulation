import { PoolType } from "./PoolType";
import { _decorator, Component, Enum } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PoolMember')
export default class PoolMember extends Component {

    @property({ type: Enum(PoolType) })
    poolType: PoolType = PoolType.NONE;
}
