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
        this.x = particleSettings.startingX
        this.y = particleSettings.startingY
        this.size = particleSettings.particleSize
        // Sets a different "ground Y" randomly for each particle, to simulate falling across a flat plane
        //this.groundLevel = this.y + randomRange(-100, 300)
        this.groundLevel = game.height
        // Various settings, grabbed from the settings object
        this.color = particleSettings.color
        this.vx = randomRange(-5, 5)
        this.vy = randomRange(-5, -10)
        
        // Increment particle index and push particle to object-array
        particleIndex++
        particles[particleIndex] = this
        this.id = particleIndex
        this.life = 0
        this.maxLife = particleSettings.maxLife
    
        // Draw function
        this.draw = function() {
            // Change x, y, vx, and vy
            this.x += this.vx
            this.y += this.vy
            // Age the particle
            this.life++

            // Bounce on ground
            if (this.y + particleSettings.particleSize > this.groundLevel) {
                this.vy *= -0.6
                this.vx *= 0.75
                this.y = this.groundLevel - particleSettings.particleSize
            }

            // Alter vy based on gravity
            this.vy += particleSettings.gravity
            
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