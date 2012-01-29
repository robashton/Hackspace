This is a hack project for hacking things together in, hence a 'hack space'



-----

Thoughts
----

Data + Sync
----

- Entities have initial data
  - Some is set by the entity constructor itself (width, height, max health, etc)
  - Some are set by the outside world (what type of monster is it? Where is it in the world?)

- When constructing an entity we need the outside world state, this needs sending across the network too
  - Entity Id
  - Entity Type
  - Entity Data
    - x,y
    - enemy type
    
- Some values change however
  - x,y -> The entity moves
  - health -> The entity is hit/recovers
  
  
It doesn't matter whether the state is initially set by the constructor or not, it needs sending anyway 
When we call 'get data' from an entity, we need all the mutable data to be extracted
So fine, we can do the whole 'two methods' thing, where once is responsible for copying relevant state into an object
And the other is responsible for copying relevant state out of the object
But when we create an entity for the first time on the server, we need to keep track of the initial data used to do so
And transmission of 'entire scene' to client is  the transmission of initial states + extracted updated states
   
- Really need this to be a push, rather than pull operation - maintaining the state of objects and their serialized state should
- be done 'as it happens' or we're going to end up with some horrible loops
