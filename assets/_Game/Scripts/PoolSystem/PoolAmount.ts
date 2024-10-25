import PoolMember from "./PoolMember";
import { _decorator, Node, Prefab, Component} from 'cc';
const { ccclass, property } = _decorator;

// Mỗi pool amount là một thành viên PoolMember được quản lý ở PoolControl Node
@ccclass('PoolAmount')
export default class PoolAmount extends Component {

    @property({ type: Node })
    public root: Node = null; // Parent node

    @property({ type: Prefab })
    public prefab: PoolMember = null; // Prefab chứa component extend PoolMember

    @property
    public amount: number = 0;
}
