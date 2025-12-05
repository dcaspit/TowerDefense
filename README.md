## New Idea 
 - [x] Main Character which u can control with W/A/S/D buttons
 - The character will gather resources from enemies death and map resources
 - Each round will change the paths to the castle
 - Main Goal is to survive and advance the base. 
 - You can improve defense and attack.
 - Insparation: 'Inside Job' at itch.io and the Mobile game Peleg showed me that has alot of marketing on social media 

## General Tasks
- [x] See Grid of map
- [x] Place towers across the map
- [ ] Upgrade towers
- [x] Base that enemies hit and lower health
- [ ] Enemy hit base animation
- [ ] Projectile hit enemy animation

### Game Control (right view panel)
- [x] Start level
- [x] Pause level
- [ ] Quit level

### Game Systems
- [ ] Money
  - [x] Killing Enemies
    - [x] Disable the money earning from death by Base collision
  - [ ] Complete a wave
- [ ] Shop
  - [ ] Buy towers
  - [ ] Upgrade towers - more power
  - [ ] Upgrade Base - more health
  - [ ] Slow all enemies movement Perk
- [ ] Health (tries per level)

### Levels 
- [ ] Add 10 waves for the same map

### Main Menu 
- [x] Start Game
- [ ] Leader Board
- [x] Quit

## Bugs
- [x] We can put more then 1 tower in the same spot
- [x] Enemies not being fired immediatly when entering a circle around a tower
- [x] Not sure - It seems that many towers not damage enemy as expected
- [x] Enemies don't die

## Tech Debts 
- [x] Create one class for waves.
    - [x] Class will get configuration of wave -> (spawnTime, monstersPerSpawn). // monstersPerSpawn <= spawnTime
- [ ] Create 10 Configuration waves. 

## Sprites 
- [ ] Walking Enemy 
    - [ ] Left
    - [ ] right
    - [ ] Top
    - [ ] Bottom
- [ ] Towers
    - [ ] First level tower
    - [ ] Second level tower
    - [ ] Third level tower
    - [ ] Fourth level tower
    - [ ] Fifth level tower
- [ ] Base
    - Five leves bases (like tower)

## Investigation
- [x] Investigate another games and see what they are doing when enemies stack at the end of the path. are they overlap each other or lined up?  
    - Decided to kill enemies when they reach the base

## Nice to have
- [ ] Cards each wave for perks (Pick a perk each wave)

