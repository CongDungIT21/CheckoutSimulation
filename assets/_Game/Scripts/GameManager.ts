import { _decorator, Component, DebugMode, director, EventTarget, find, instantiate, Node, Prefab, Vec3 } from 'cc';
import { Customer } from './Customer';
import { ResourceManager } from './ResourceManager';
import { ProductData } from './Data/ProductData';
import { ProductToBuyData } from './Data/ProductToBuyData';
import MathUtils from './Common/MathUtils';
import { CustomerData } from './Data/CustomerData';
const { ccclass, property } = _decorator;

export enum GameState
{
    GS_LOAD,
    GS_PLAYING,
    GS_END,
}

@ccclass('GameManager')
export class GameManager extends Component {

    private static _instance: GameManager | null = null;
    public static get instance(): GameManager {
        if (!this._instance) {
            this._instance = find(this.name)?.getComponent(GameManager);

            if (!this._instance) {
                let generatorNode: Node = new Node(this.name);
                this._instance = generatorNode.addComponent(GameManager);

                director.getScene().addChild(generatorNode);
                console.log("Auto create " + this.name);
            }
        }
        return this._instance;
    }

    public StateEvent: EventTarget = new EventTarget();

    private _productDatas: ProductData[] = [];
    private _customerDatas: CustomerData[] = [];
    public get CustomerDatas(): CustomerData[] {
        return this._customerDatas;
    }

    private _gameState: GameState = GameState.GS_LOAD;
    private set GameState(state: GameState) {
        console.log("Emit State: " + state);
        this._gameState = state;   
        this.StateEvent.emit(state, this._gameState);     
    }

    protected onLoad(): void {
        GameManager._instance = this;  
    }

    protected async start() {
        this.GameState = GameState.GS_LOAD;
        await this.loadGame();
        console.log("Loag Game Done");
        this.GameState = GameState.GS_PLAYING;
    }

    private async loadGame()
    {
        this.loadDataGame();
        await this.loadResourceGame();        
    }

    private loadDataGame()
    {
        this._productDatas = this.initProductDatas();
        this._customerDatas = this.initCustomerDatas();
        console.log("this._customerDatas: " + JSON.stringify(this._customerDatas)); 
    }

    private async loadResourceGame()
    {
        await ResourceManager.instance.loadResources();
        console.log("Load Resource Done");
    }

    //Read from file, server, config....
    private initProductDatas(): ProductData[] {
        let productDatas: ProductData[] = [];

        for(let i = 1; i <= 4; i++)
        {
            let productData: ProductData = new ProductData();
            productData.ID = i;
            productData.Price = 5;

            productDatas.push(productData);
        }

        console.log("productDatas: " + JSON.stringify(productDatas));
        return productDatas;
    }

    //Read from file, server, config....
    private initCustomerDatas(): CustomerData[] {
        let customerDatas: CustomerData[] = [];

        for(let i = 1; i <= 4; i++)
        {
            let customerData: CustomerData = new CustomerData();
            customerData.ID = i;
            
            let productToBuys: ProductToBuyData[] = [];
            for(let j = 0; j < i; j++) //customer at i buys i products
            {
                let productToBuyRandom = this.getRandomProductToByData();

                let hasBuy = false;
                //Check if exists
                for(let k = 0; k < productToBuys.length; k++)
                {                    
                    let productToBuyData: ProductToBuyData = productToBuys[k];
                    if(productToBuyRandom.Product.ID === productToBuyData.Product.ID)
                    {
                        hasBuy = true;
                        productToBuyData.Amount += 1;
                        break;
                    }
                }

                if(hasBuy === false)
                {
                    productToBuys.push(productToBuyRandom);
                }
            }

            customerData.listProductToBuy = productToBuys;
            customerDatas.push(customerData); 
        }

        return customerDatas;
    }

    private getRandomProductData(): ProductData
    {
        return this._productDatas[MathUtils.getRandomNumber(0, this._productDatas.length)];
    }

    private getRandomProductToByData(): ProductToBuyData
    {
        let productToBuyData: ProductToBuyData = new ProductToBuyData();
        let productData: ProductData = this.getRandomProductData();
        productToBuyData.Product = productData;
        productToBuyData.Amount = 1;
        return productToBuyData;
    }
}


