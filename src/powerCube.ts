import utils from "../node_modules/decentraland-ecs-utils/index"

export class PowerCube extends Entity {
  isGrabbed: boolean = false

  constructor(model: GLTFShape, transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(transform)
    
    this.addComponent(
      new OnPointerDown(
        () => {},
        {
          button: ActionButton.PRIMARY,
          hoverText: "Pick Up / Put Down",
          distance: 5
        }
      )
    )
    let triggerBox = new utils.TriggerBoxShape(Vector3.One(), Vector3.Zero())
    this.addComponent(new utils.TriggerComponent(triggerBox, 1)) // Note: Trigger layer 1
  }
}
