# Evolution of Ocean Ecosystem - Case Study
My project is based on `Complex System` (existing in nature i.e. Ecosystem) and `Artificial Intelligence` (to provide ability 
to navigate around the ecosystem in a life-like and improvisational manner, mainly known as **Steering Behaviors**). 

This project is a demonstration of `Steering Behaviors`, `Genetic Algorithms`, and `mutations`, the goal is to achieve and simulate
different biological creatures to see how they react in complex environment. 

These creatures are based on [Craig Reynold's](https://www.red3d.com/cwr/index.html) - [Steering Behaviors](https://www.red3d.com/cwr/steer/gdc99/) and
[Flocking System](https://www.red3d.com/cwr/boids/).

At the start of the simulation, an arbitrary amounts of creatures are created. The primary and most important steering behavior is 
**Food Seeking**. This will differ based on the type of creatures and what it thinks food is: Herbivores will seek plants while
Predators, Eaters will chase herbivores. All of these creatures will have a maximum lifetime and health value decreases overtime.
If health reaches 0, the creatures will die; the health value will increase if the creature is able to eat food but the lifetime value
will continue ticking down ensuring it won't be able to live forever.

# Core Technologies and Algorithms
* JavaScript 
* HTML5 Canvas 
* Modified Genetic Algorithm with some Mutation (See below)
* Steering Algorithms to implement AI: 
    * `Separation`: Steer to avoid crowding local flockmates.
    * `Alignment`: Steer towards the average heading of local flockmates.
    * `Cohesion`: Steer to move towards the average position of local flockmates.
    * `Wander`: It is a type of random steering. Interesting approach to implement this behavior is to retain steering direction
    state and make small random displacements to it each frame.
    * `Seek`: (or pursuit of a static target) acts to steer the character towards a specified position in global space.
           
   ``` 
   desired_velocity = normalize  (position - target) * maximumSpeed
   steering = desired_velocity - velocity
   ```
           
    * `Flee`: It is simply inverse of seek and acts to steer the character so that its velocity is radially aligned away from
        the target. The desired velocity points in the opposite direction. This is used in Obstacle Avoidance.
    * `Flocking Behavior`: The basic flocking model consists of three simple Steering behaviors (Separation, Alignment and Cohesion) which
    describe how an individual creatures maneuvers based on the position and velocities of its nearby flockmates.

**Each creatures has direct access to the whole scene's geometric description, but flocking requires that it reacts only to flockmates within
a certain small neighborhood around itself. The neighborhood is characterized by a distance and an angle, measured from the boid's direction of flight. Flockmates outside this local,
neighborhood are ignored. This can be visualized by `Debugging Perception`.**

# Genetic Algorithm 
The initial DNA Parameters for the creatures are randomly generated which controls
attraction and repulsion forces for Food, Predators and other creatures. Creature replication 
simply copies those parameters from the old creature to the new one with a low chance of mutation, for this system
to work, it must have enough DNA variety at the start of the simulation to avoid creatures dying out because of bad initial DNA 
parameters. In this case, there is no fitness function **(Just wanted to make Human Like Evolution)**, and the creatures are
passively evolving: the better creatures have a higher chance of surviving for a longer period and have a higher reproduction rate.
Something that is more nearest the way the evolutionary process might happen in natural way.

# How does this works?

## Creatures Introduction

* `Good Creatures`: They are the good ones. They like food and avoid poison. They like to stay within their groups. They avoid Predators and Eaters from getting
killed. They can clone themselves and reproduce
* `Predators`: They like poison and dislike food. They are too afraid of Eaters. However, they seek other creatures and
eats them.
* `Eaters`: They are the deadliest and smart ones. They like poison and dislike food. They seek all other creatures and eats them.
Also, They leave food behind as a trap.
* `Avoiders`: They are very fast. They avoid all other creatures, seeks food, eats them and avoid poison. They seem to be nice, but are like the silent killer.
Due to their fast velocities, they reach to food quickly, eats them and creates food scarcity to other creatures.

**These creatures also have cute names based on their gender.**
**Select creatures you want to add and click on screen to add them. Ecosystem manages all creatures by itself, not required to
add creatures, but you can play around if you like.**

## BuildCreature Class
To create different variety of creatures with different traits, I have used **"Builder Pattern"**. This class implements Builder Pattern.
You can learn more about how this works at [here](https://betterprogramming.pub/the-builder-pattern-in-javascript-6f3d85c3ae4a) or [here](https://medium.com/@axelhadfeg/builder-pattern-using-javascript-and-es6-ec1539182e24).

## Creature Class
It's the heart class of the project. This class handles all the logic for the update, render and physics. Each creature
will be provided with some essential traits like health, radius, maximumSpeed, maximumForce, nutritionEffects and so on.

**Some important methods in the Creature Class:**
   * `applySteeringBehavior()`: This method applies the flocking behavior by combining different steering behaviors.
   * `addFearBehavior()`: This method defines the fear behavior which also can be used inversely.
   * `addFoodBehavior()`: This method applies the force which returns from **consumeFood()** method.
   * `consumeFood()`: This method helps creatures to seek nearby food.
   * `reproduce()`: This method handles Reproduction. This will checks for male and female agents, if they are eligible for
reproduction or not and if they are, they can reproduce with their specific DNA and creates a small creature based on their DNA 
data and with some mutation.

## Steer Class
This class implements all the Steering Behavior implementing algorithms. This will take an creatures and
do all the necessary calculations for Steering Behaviors like `Seek`, `Wander`, `Flee`, `Separate`, `Align`, `Cohesion`.

## Ecosystem Class
This class acts like a state manager. This will manage all the creatures and their behaviors.

## Setting up everything
And, finally all parts of code are assembled to create these creatures and give each of them
life like behaviors.

# Debug Mode
This may seem a little bit confusing. There are three debugging mode currently available. They are discussed below:
    
   * `Debug DNA`: We can view creatures DNA weights. Red line represents, how attracted are creatures to poison, and green 
    line represents how attracted are creatures to Food.
   * `Debug Perception`: There are two types of perception that the creatures have. Green circle
    for how close it can perceive Food/other creatures and red circle for how close it can perceive poison/bad creatures.  
   * `Display Health Status`: You can also see the health status of all the creatures.

## Enjoy Watching them all day. 

Done with :heart: by Prajwal Pokhrel using JavaScript.





