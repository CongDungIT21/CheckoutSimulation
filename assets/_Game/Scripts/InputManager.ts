import { _decorator, Camera, Component, EventMouse, geometry, Input, input, Node, PhysicsRayResult, PhysicsSystem, Vec2, Vec3 } from 'cc';
import { ICheckout, Product } from './Product';
import { GameController } from './GameController';
import { Customer } from './Customer';
const { ccclass, property } = _decorator;

@ccclass('InputManager')
export class InputManager extends Component {
    @property(Camera)
    mainCamera: Camera | null = null;

    protected start(): void {
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    private onMouseDown(event: EventMouse): void {
        if(event.getButton() === 0)
        {
            let mousePos: Vec2 = event.getLocation();

            let ray = new geometry.Ray();
            this.mainCamera!.screenPointToRay(mousePos.x, mousePos.y, ray);

            if(PhysicsSystem.instance.raycast(ray))
            {
                let raycastResults: PhysicsRayResult[] = PhysicsSystem.instance.raycastResults

                for(let i = 0; i < raycastResults.length; i++)
                {
                    const result: PhysicsRayResult = raycastResults[i];                    

                    //Check if it's product
                    let iCheckout: ICheckout = result.collider.getComponent(Product) as ICheckout;                      
                    if(iCheckout)
                    {
                        iCheckout.checkOut();
                        return;
                    }

                    let customer: Customer = result.collider.node.parent.getComponent(Customer);
                    if(customer) 
                    {
                        customer.OnClickPaymentMethod();
                    }                   
                }
            }
        }
    }
}


