import { Card } from './card'
import { PowerBase } from './powerBase'
import { PowerCube } from './powerCube'
import { Sound } from './sound'

// Base
const staticBase = new Entity()
staticBase.addComponent(new GLTFShape('models/staticBase.glb'))
engine.addEntity(staticBase)

// Configuration
const Z_OFFSET = 1.5
const GROUND_HEIGHT = 0.55

// Scene objects
const card = new Card(
  new GLTFShape('models/card.glb'),
  new Transform({ position: new Vector3(8, 1.5, 13.5) })
)
const powerBase = new PowerBase(
  new GLTFShape('models/powerBase.glb'),
  new Transform(new Transform({ position: new Vector3(8, 0.024, 3.5) }))
)
const powerCube = new PowerCube(
  new GLTFShape('models/powerCube.glb'),
  new Transform({ position: new Vector3(8, GROUND_HEIGHT, 3.5) })
)

// Sounds
const cubePickUpSound = new Sound(new AudioClip('sounds/cubePickup.mp3'))
const cubePutDownSound = new Sound(new AudioClip('sounds/cubePutDown.mp3'))

// Controls
Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (e) => {
  const transform = powerCube.getComponent(Transform)
  if (!powerCube.isGrabbed) {
    powerCube.isGrabbed = true
    cubePickUpSound.getComponent(AudioSource).playOnce()

    // Calculates the crate's position relative to the camera
    transform.position = Vector3.Zero()
    transform.rotation = Quaternion.Zero()
    transform.position.z += Z_OFFSET
    powerCube.setParent(Attachable.AVATAR)
  } else {
    powerCube.isGrabbed = false
    cubePutDownSound.getComponent(AudioSource).playOnce()

    // Calculate power cube's ground position
    powerCube.setParent(null) // Remove parent
    const forwardVector: Vector3 = Vector3.Forward()
      .scale(Z_OFFSET)
      .rotate(Camera.instance.rotation)
    transform.position = Camera.instance.position.clone().add(forwardVector)
    transform.lookAt(Camera.instance.position)
    transform.rotation.x = 0
    transform.rotation.z = 0
    transform.position.y = GROUND_HEIGHT
  }
})
