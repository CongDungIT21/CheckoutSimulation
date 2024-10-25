import { _decorator, Component, DebugMode, director, find, instantiate, Node, Prefab, Vec3 } from 'cc';
import { Customer } from './Customer';
import { ResourceManager } from './ResourceManager';
import { GameManager, GameState } from './GameManager';
import { CustomerData } from './Data/CustomerData';
import { ProductToBuyData } from './Data/ProductToBuyData';
import { Product } from './Product';
import { CashPaymentStrategy, CreditCardPaymentStrategy, PaymentStrategy } from './PaymentStrategy';
import MathUtils from './Common/MathUtils';
import { BillBuilder } from './BillBuilder';
import { Bill } from './Bill';
import { ProductData } from './Data/ProductData';
import { MonitorUI } from './GUI/MonitorUI';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    private static _instance: GameController | null = null;

    public static get instance(): GameController {
        if (!this._instance) {
            this._instance = find(this.name)?.getComponent(GameController);

            if (!this._instance) {
                let generatorNode: Node = new Node(this.name);
                this._instance = generatorNode.addComponent(GameController);

                director.getScene().addChild(generatorNode);
                console.log("Auto create " + this.name);
            }
        }
        return this._instance;
    }

    @property({type: Node})
    public TablePoint: Node | null = null;
    @property({type: Node})
    public InitPoint: Node | null = null;
    @property({type: Node})
    public productStartPoint: Node | null = null;
    @property({type: Node})
    public productEndPoint: Node | null = null;
    @property({type: Node})
    public outPoint: Node | null = null;
    @property({type: MonitorUI})
    private monitorUI: MonitorUI | null = null;
    @property({type: Node})
    public cashEndPoint: Node | null = null;
    @property({type: Node})
    public cashStartPoint: Node | null = null;

    private _tablePoints: Vec3[] = [];
    private _directionCheckout: Vec3 = new Vec3(1, 0, 0);
    private _spaceBetweenCustomer: number = 3;
    private _bill: Bill

    private _customers: Array<Customer> = [];

    protected start(): void {          
        GameManager.instance.StateEvent.on(GameState.GS_PLAYING, this.initGame, this);
    }

    protected onDestroy(): void {
        GameManager.instance.StateEvent.off(GameState.GS_PLAYING, this.initGame, this);
    }

    public checkOutProduct(product: Product)
    {
        if(this._bill == null)
        {
            console.log("Who buys this product?");
            return;
        }

        this._bill.addProductToBill(product);
    }

    public ShowPaymentUI()
    {
        if(this._bill == null)
        {
            console.log("Who buys this product?");
            return;
        }
    
        this._bill.ShowPaymentUI();
    }

    public checkOut(customer: Customer): void
    {
        this.generateProductToBuy(customer.Data.listProductToBuy);
        let strategy: PaymentStrategy = this.algorithmPaymentStrategy();
        this._bill = new BillBuilder()
                .withMonitor(this.monitorUI)
                .withCustomer(customer)
                .withPaymentStrategy(strategy)
                .build();        
    }

    public canCheckOut(customer: Customer): boolean
    {
        return customer === this._customers[0];
    }

    private initGame()
    {
        this.generateCustomer();
    }

    //Can add Enum from customerData...
    private algorithmPaymentStrategy(): PaymentStrategy
    {
        let strategy: number = MathUtils.getRandomNumber(0, 2); //(0, 1]

        // if(strategy === 0)
        // {
        //     console.log("Cash Payment Strategy");
        //     return new CashPaymentStrategy();
        // }
        // else if(strategy === 1)
        // {
        //     console.log("CreditCardPaymentStrategy");
        //     return new CreditCardPaymentStrategy();
        // }

        return new CashPaymentStrategy();
    }

    generateCustomer()
    {
        //shuffle để random vị trí xuất hiện
        let datas: CustomerData[] = GameManager.instance.CustomerDatas;        

        for(let i = 0; i < datas.length; i++)
        {
            let data: CustomerData = datas[i];
            let pfCustomer: Prefab | null = ResourceManager.instance.getCustomerPrefab(data.ID);
            if(pfCustomer == null)
            {
                console.log("Not found prefab: " + data.ID);
            }
            let nodeCustomer: Node = instantiate(pfCustomer);
            let customer: Customer = nodeCustomer.getComponent(Customer);
            this.node.addChild(nodeCustomer);            
            let tablePoint: Vec3 = new Vec3();
            Vec3.scaleAndAdd(tablePoint, this.TablePoint.getWorldPosition(), this._directionCheckout, this._spaceBetweenCustomer * i);
            this._tablePoints.push(tablePoint);

            let intPos = MathUtils.randomPointInAnnulus(this.InitPoint.getWorldPosition(), 1, 3);
            nodeCustomer.setWorldPosition(intPos);
            customer.Init(data);            
            customer.moveToTarget(tablePoint);
            this._customers.push(customer);
        }
    }

    generateProductToBuy(listProductToBuy: ProductToBuyData[]): void
    {
        for(let i = 0; i < listProductToBuy.length; i++)
        {
            let data: ProductToBuyData = listProductToBuy[i];
            
            for(let j = 0; j < data.Amount; j++)
            {
                this.generateProduct(data.Product);
            }
        }
    }

    generateProduct(data: ProductData): void
    {
        let nodeProduct: Node = instantiate(ResourceManager.instance.getProductPrefab(data.ID));
        let product: Product = nodeProduct.getComponent(Product);
        this.node.addChild(nodeProduct);
        nodeProduct.setWorldPosition(this.productStartPoint.getWorldPosition());
        product.Init(data);
        let endPos = MathUtils.randomPointInAnnulus(this.productEndPoint.getWorldPosition(), 0.5, 1.5);
        product.moveToTarget(endPos, MathUtils.getRandomNumberFloat(0, 1));
    }

    checkOutCompleted(): void
    {
        this._bill._payment.HidePaymentUI();
        this._bill.Monitor.ResertMonitor();
        this._bill._customer.MoveOutMaket(this.outPoint.getWorldPosition());
        this._bill = null;

        this.scheduleOnce(() => {
            this._customers.shift(); //Remove first element

            if(this._customers.length === 0)
            {
                console.log("Game Completed Go Ads");
                window.open("https://www.google.com.vn/?hl=vi", '_blank').focus();
            }
            else
            {
                for(let i = 0; i < this._customers.length; i++)
                {
                    this._customers[i].moveToTarget(this._tablePoints[i]);
                }
            }
        }, 1);
    }
}


