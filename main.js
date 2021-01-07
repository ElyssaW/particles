// This stuff is just housekeeping, defining canvas, etc.

// Initial variables
let gameInterval
let ctx = game.getContext('2d')
game.setAttribute('width', 600)
game.setAttribute('height', 600)

// Select random number from given range
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

//==================================================
//
//          THE MAGIC
//
//==================================================

// Create object array to hold the particles, because I'm a child entertained by pretty lights
let particles = {}
// Create current index to keep track of how many particles currently exist, and assign IDs to new ones
let particleIndex = 0
// Particle settings, to easily alter particle behavior/appearence
let particleSettings = {
    particleSize: 5,
    startingX: game.width/2,
    startingY: game.height/2,
    gravity: .5,
    maxLife: 100,
    color: 'hotpink',
    groundLevel: game.height
}

// constructor function for new Particles
function Particle() {
        // Sets the x/y value where the particle will be drawn
        this.x = particleSettings.startingX
        this.y = particleSettings.startingY
        // Sets particle size
        this.size = particleSettings.particleSize
        // Sets the point on the Y axix where the particle will "bounce," simulating the ground
        this.groundLevel = game.height
        // Sets color
        this.color = particleSettings.color
        // Velocity X and Velocity Y (or vx and vy) The particle will move on the x/y axis according to these
        // values - they're how fast the particle is going in any given direction. 
        this.vx = randomRange(-5, 5)
        this.vy = randomRange(-5, -10)
        
        // Increment particle index
        particleIndex++
    
        // Set particle index to current index - you might notice this index is set like particles is an array
        // but it's actually an object. Fun fact! You can set values in an object by using a numeric index as
        // the key, similar to an array. But why do that, when you can just use an ACTUAL array? In this case, it's helpful
        // because we can delete the particle out of the object by referencing its index, without shifting the index
        // positions of all the other particles in the object. This will be helpful when we're deleting particles
        // that have reached the end of their lifespan and should not be drawn anymore.
        particles[particleIndex] = this
        this.id = particleIndex
        // Set life to 0
        this.life = 0
        // Set maxlife to settings value
        this.maxLife = particleSettings.maxLife
    
        // Draw function
        this.draw = function() {
            // Change x and y according to the vx and vy values
            this.x += this.vx
            this.y += this.vy
            
            // Age the particle
            this.life++

            // Check to see if the particle has reached the "ground" boundary defined above
            if (this.y + particleSettings.particleSize > this.groundLevel) {
                // This slows and reverses the particle's Y velocity, simulating a more realistic bounce motion
                this.vy *= -0.6
                this.vx *= 0.75
                // Sets the particle back above the boundary. Since the Y velocity was reversed, the particle
                // will move up and away from this boundary
                this.y = this.groundLevel - particleSettings.particleSize
            }

            // This is the meat of the particle movement: increment the Y velocity according to gravity
            this.vy += particleSettings.gravity
    
            // To clarify: This increases the particle's Y velocity based on the gravity value defined in settings
            // If the particle is moving upwards, it's vy value will be negative, and gravity will
            // slowly push it into the postive here. If it is already in the positive, gravity will increase it
            // even further, making it look like it's gaining more and more speed. 
            
            // To demonstrate: if the particle has a y value of 100, a vy of -5, and a gravity value of .5, it will
            // add the gravity value to its vy: -5 + .5 = -4.5
            
            // Then, it will add its vy to its y: 100 + -4.5 = 95.5. The particle moves upwards, but by less distance
            // than before.
            
            // This repeats for every frame the particle is drawn on. The vy value will gain more and more "gravity,"
            // causing the particle to rise less and less, until the vy flips into a positive value. Then, the particle
            // will start to fall, and since gravity is still being added to it, it will fall more and more with
            // each successive frame.
            
            // In short, gravity will make the particle rise slower, arc out of the rise into a fall, and then fall faster
            
            // This just draws a square to visually represent the particle. Nothin' fancy
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.size, this.size)

            // Delete if particle is old and grody (And its life has reached the cap)
            if (this.life >= this.maxLife) {
                delete particles[this.id]
        }
    }
}

// Basic loop to animate particle movement/generation
function loop() {
    
    //Clear board
    ctx.clearRect(0, 0, game.width, game.height)
    
    // Emit particles
    new Particle()
    
    // Draw particles
    for (let i in particles) {
        particles[i].draw();
    }
}

gameInterval = setInterval(loop, 30)