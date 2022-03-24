import * as utils from '@dcl/ecs-scene-utils'

export class PowerCube extends Entity {
  isGrabbed: boolean = false

  constructor(model: GLTFShape, transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(transform)

    this.addComponent(
      new OnPointerDown(() => {}, {
        button: ActionButton.PRIMARY,
        hoverText: 'Pick Up / Put Down',
        distance: 5
      })
    )
    const triggerBox = new utils.TriggerBoxShape(Vector3.One(), Vector3.Zero())
    this.addComponent(new utils.TriggerComponent(triggerBox, { layer: 1 }))
  }
}
