import { Sound } from "./sound"
import { ParticleSystem, particleGroup } from "./particles"
import utils from "../node_modules/decentraland-ecs-utils/index"

// Power glows
const powerBlueGlow = new Entity()
powerBlueGlow.addComponent(new GLTFShape("models/powerBlueGlow.glb"))
powerBlueGlow.addComponent(new Transform())
engine.addEntity(powerBlueGlow)

const powerRedGlow = new Entity()
powerRedGlow.addComponent(new GLTFShape("models/powerRedGlow.glb"))
powerRedGlow.addComponent(new Transform())
engine.addEntity(powerRedGlow)

// Forcefield
const forcefield = new Entity()
forcefield.addComponent(new GLTFShape("models/forcefield.glb"))
forcefield.addComponent(new Transform())
engine.addEntity(forcefield)

let forcefieldParticles: ISystem

// Sounds
const powerUp = new Sound(new AudioClip("sounds/powerUp.mp3"))
const powerDown = new Sound(new AudioClip("sounds/powerDown.mp3"))

// Power base where the power cube sits
export class PowerBase extends Entity {
  isPowerOn: boolean = true

  constructor(model: GLTFShape, transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(transform)

    let triggerBox = new utils.TriggerBoxShape(new Vector3(4, 4, 4), new Vector3(0, 2, 0))

    this.addComponent(
      new utils.TriggerComponent(
        triggerBox,
        null,
        1, // Triggered by layer 1 triggers i.e. the power cube
        () => {
          this.isPowerOn = true
          this.togglePower()
        },
        () => {
          this.isPowerOn = false
          this.togglePower()
        }
      )
    )
  }

  togglePower() {
    if (this.isPowerOn) {
      powerBlueGlow.getComponent(Transform).scale.setAll(1)
      engine.addEntity(forcefield)
      forcefieldParticles = engine.addSystem(new ParticleSystem())
      powerUp.getComponent(AudioSource).playOnce()
    } else {
      // NOTE: particles have colliders so need to move them elsewhere
      for (const entity of particleGroup.entities) {
        entity.getComponent(Transform).position.setAll(0) 
      }
      powerBlueGlow.getComponent(Transform).scale.setAll(0) // Hide the blue glow
      engine.removeEntity(forcefield)
      engine.removeSystem(forcefieldParticles)
      powerDown.getComponent(AudioSource).playOnce()

    }
  }
}
