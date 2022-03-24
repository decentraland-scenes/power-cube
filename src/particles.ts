// Particles
@Component('particle')
export class Particle {
  life = Math.random()
  seed = Math.random() * this.width
  constructor(
    public width: number,
    public height: number,
    public speed: number,
    public parentTransform: Entity
  ) {}
}

export const particleGroup = engine.getComponentGroup(Particle)

export class ParticleSystem {
  update(dt: number) {
    for (const entity of particleGroup.entities) {
      const particle = entity.getComponent(Particle)
      const transform = entity.getComponent(Transform)

      particle.life += dt * particle.speed // Particle speed
      particle.life %= 1 // Reset particle life

      transform.position.set(
        0,
        particle.life * particle.height,
        0 - particle.seed
      )
      entity.setParent(particle.parentTransform) // Transform particles using parent's transform
    }
  }
}

// Setup particles
const particles: Entity[] = []
const shape = new PlaneShape()
const material = new Material()
material.metallic = 1
material.albedoColor = new Color3(0.5, 1.5, 2)
material.emissiveColor = new Color3(0.5, 1.5, 2)

// Position particles with a
const particleTransform = new Entity()
particleTransform.addComponent(
  new Transform({
    position: new Vector3(16, 0, 10),
    rotation: Quaternion.Euler(0, 90, 0)
  })
)
engine.addEntity(particleTransform)

// Initialise particles
const MAX_PARTICLES = 256

for (let i = 0; i < MAX_PARTICLES; i++) {
  const particle = new Entity()
  particle.addComponent(shape)
  particle.addComponent(material)
  particle.addComponent(new Particle(16, 7, 0.25, particleTransform))
  particle.addComponent(
    new Transform({
      rotation: Quaternion.Euler(0, 90, 0),
      scale: new Vector3(0.01, 0.1, 1)
    })
  )
  engine.addEntity(particle)
  particles.push(particle)
}
