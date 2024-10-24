import { _decorator, Component, director, find, Node, Prefab, resources } from 'cc';
import { ResourceUtils } from './Common/ResourceUtils';
const { ccclass, property } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    private static _instance: ResourceManager | null = null;

    public static get instance(): ResourceManager {
        if (!this._instance) {
            this._instance = find(this.name)?.getComponent(ResourceManager);

            if (!this._instance) {
                let generatorNode: Node = new Node(this.name);
                this._instance = generatorNode.addComponent(ResourceManager);

                director.getScene().addChild(generatorNode);
                console.log("Auto create " + this.name);
            }
        }
        return this._instance;
    }

    private _cacheProductPrefabs: Map<string, Prefab> = new Map();
    private _cacheCustomerPrefabs: Map<string, Prefab> = new Map();

    public onLoad(): void {
        ResourceManager._instance = this;
    }

    public async loadResources()
    {
        const productPrefabs = (await ResourceUtils.loadDirectoryPrefabAsync("Products"))
                                .map((prefab: Prefab) => {
                                    this._cacheProductPrefabs.set(prefab.name, prefab);
                                });

        const customerPrefabs = (await ResourceUtils.loadDirectoryPrefabAsync("Customers"))
                                .map((prefab: Prefab) => {
                                    this._cacheCustomerPrefabs.set(prefab.name, prefab);
                                })

        return await Promise.all([productPrefabs, customerPrefabs]);
    }

    public getProductPrefab(id: number): Prefab | null {
        let productPath: string = this.buildProductPath(id);
        if (this._cacheProductPrefabs.has(productPath)) {
            return this._cacheProductPrefabs.get(productPath);
        }
        
        let product: Prefab | null = this.loadProductPrefab(id);

        if(product != null)
            this._cacheProductPrefabs.set(productPath, product);

        return product;
    }

    private buildProductPath(id: number): string {
        return "Product_" + id;
    }

    private loadProductPrefab(id: number): Prefab | null {
        let path: string = "Products/Product_" + id; //Path to prefab in Resource

        resources.load(path, Prefab, (err, prefab) => {
            if (err) {
                console.error("Load Failure");
                return null;
            }

            console.log("Load Success: " + path);
            return prefab;
        });

        return null;
    }
      
    
    public getCustomerPrefab(id: number): Prefab | null {
        let customerPath: string = this.buildCustomerPath(id);
        if (this._cacheCustomerPrefabs.has(customerPath)) {
            return this._cacheCustomerPrefabs.get(customerPath);
        }
        
        let customer: Prefab | null = this.loadCustomerPrefab(id);

        if(customer != null)
            this._cacheCustomerPrefabs.set(customerPath, customer);

        return customer;
    }

    private buildCustomerPath(id: number): string {
        return "Customer_" + id;
    }

    private loadCustomerPrefab(id: number): Prefab | null {
        let path: string = "Customers/Customer_" + id; //Path to prefab in Resource

        resources.load(path, Prefab, (err, prefab) => {
            if (err) {
                console.error("Load Failure");
                return null;
            }

            console.log("Load Success: " + path);
            return prefab;
        });

        return null;
    }
}


