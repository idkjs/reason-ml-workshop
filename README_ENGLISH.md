# ReasonML Workshop

This workshop aims to familiarize participants with the ReasonML language by developing several parts of a Space Invader!

_ReasonML_ is heavily inspired by OCaml and therefore by definition statically strongly typed as well as functional.
ReasonML was designed to be easier to use than OCaml and to come a little closer to classic JavaScript syntax.
ReasonML is strongly linked to another project called [Bucklescript] (bucklescript.github.io]) which is precisely used to compile OCaml or ReasonML into JavaScript.

## Prerequisites

* A computer ... is better :)
* NodeJS & NPM installed
* Visual Studio Code
* _optional but recommended_
  * [Merlin] (https://reasonml.github.io/docs/en/extra-goodies.html#merlin) & ReasonML installed globally: <https://reasonml.github.io/docs/en/global- installation.html>
  * The ReasonML plugin installed. cf. [ReasonML Package] (https://github.com/reasonml-editor/vscode-reasonml)

## Start-up

! [ReasonMl Game screen] (./ src / assets / reasonml-game.png)

> Captain Kirk, the aliens are coming and several Enterprise NC-1701 systems are down, we need you!

To repair it, you will first need to retrieve the sources from the control center here:

`` bash
git clone git@github.com: js-republic / reason-ml-workshop.git
`` ``

You can then start it by entering the terminal at the root of the project:

`` bash
npm install
`` ``

`` bash
npm run init
`` ``

`` bash
npm start
`` ``

> Do not recommend against using `yarn`, as previous participants have had problems with it and we do not have a` yarn.lock` to guarantee you the correct version of the dependencies.

All you have to do is open the control panel (aka. The `index.html` file) in your browser.

Before embarking on this mission, take a few minutes to familiarize yourself with the architecture of the ship and the ReasonML language that makes it up.

## General informations

File structure:

`` ``
src
├── Actions.re <- Contains the different types of actions that can be used in the system
├── Alien.re <- Draw the aliens
├── Alien_reducer.re <- Reducer of alien state
├── Bg.re <- Draw the wallpapers
├── Collision.re <- Used to detect Collisions
├── Constants.re <- Contains constants such as screen height and width
├── Image.re <- Utility file used to draw the images
├── Main.re <- Entry point and heart of the system
├── Reducer.re <- Main application reducer
├── Ship.re <- Draw the ship
├── Ship_reducer.re <- Reducer of the state of the ship
├── Shot.re <- Draw the ship's projectiles
├── Shot_reducer.re <- Reducer of projectile state
├── Stage.re <- Manage the different levels of the game
├── Store.re <- Game store which centralizes all the data
├── Types.re <- Contains all the types of the application
└── index.html <- Index.html file to open to see the games
__tests__
└── All_test.re <- Contains all unit tests
`` ``

The Enterprise NC-1701 system is based on a Flux / Redux architecture coupled with a render loop. Clearly, this means that the set of all states (ex: position, size, image) of each element (Ship, Shot, Alien) are grouped together in a main state, called the `rootState` itself stored in the` store` found in the `Store.re` file.
Each time an element (Ship, Shot, Alien) wishes to change information that concerns it, it must dispatch an `Action` (all available system actions are declared in the` Actions.re` file) to the help of the `dispatch` function of the` Store.re` file.

At each iteration of the render loop, all the actions dispatched since the last iteration are applied to the main reducers, that of Ship, Shot and Alien respectively declared in the files `Reducer.re`,` Ship_reducer.re`, `Shot_reducer.re` and` Alien_reducer.re`. The new states returned by the reducers are then aggregated and build the new state of the `rootState` which will be used for rendering. You can find an explanation of the structure of the `Store` in the file of the same name.

Here is an overview of how the system works:

`` ``
+ ----------- +
| |
| v
| + ------ + ------- +
| | |
| | Pre-reducer |
| | |
| + ------ + ------- +
| |
| v
| + ------ + ------- +
| | |
| | Ship_reducer |
| | Alien_reducer |
| | Shot_reducer |
| | |
| + ------ + ------- +
| |
| v
| + ------ + ------- +
| | |
| | Post-reducer |
| | |
| + ------ + ------- +
| |
| v
| + ------ + ------- +
| | |
| | Render |
| | |
| +
------ + ------- +
| |
+ ----------- +
`` ``

> All the plans of the ship as well as the types used in the system are visible in the file `Types.re`. A very useful file to keep close to not lose in the system;)

### TDD from space!

Even in 2265 the TDD still does wonders to guide men (and women) towards the path of light!

Also, we are told that all StarFleet ships are equipped with a test suite to resolve all ship issues.

You will find this test suite in the `__tests __ / All_test.re` file. These tests are run as soon as you do an `npm test` and their results are available in the console.

Keep this file open, it will be of great help to you throughout your mission.

### Useful information about ReasonML

### Logs

Very useful when you want to debug, if you want to do the equivalent of `console.log` in ReasonMl you can call

`` javascript
Js.log ("My message that I want to display");
Js.log ("My variable is" ++ myVariable); // Provided that myVariable is indeed a string
`` ``

### Modules

In ReasoML, the concept of `Module` is ubiquitous. A `Module` represents a grouping of function, variable, type, etc. In short, pretty much everything we can handle in ReasonML. It can be seen as a Namespace for those who have heard of it in other languages.

Each ReasonML `* .re` file implicitly creates a module of the same name, so the` Image.re` file creates an `Image` module.
To use something located in another file than the one we are in, we will call the module of this other file. Some examples :

* From `Alien.re` to invoke the` draw` function of the `Image` file we will write` Image.draw (...) `
* From `Ship.re` to type the first parameter in` canvasContext` (defined in the `Types` file) we will write` Types.canvasContext`

To learn more about the modules, visit this page:
<https://reasonml.github.io/docs/fr/module.html>

### Useful information :

* Synthetic reminder of ReasonML syntax: <https://reasonml.github.io/docs/en/syntax-cheatsheet.html>
* Another reminder: <https://github.com/arecvlohe/reasonml-cheat-sheet>
* ReasonML API: <https://reasonml.github.io/api/index.html>

> For the more curious: Note that JavaScript files generated from ReasonML sources are placed in the `/ lib / js / src` folder. You will be able to see a bit what it looks like once generated;)

> Your mission begins here captain, we are counting on you and your fine team.

## Scrambled intergalactic GPS - (Step 1)

`` ``
#option, #patternMatching, #labeledArguments
`` ``

Your first task will be to repair the Enterprise NC-1701 GPS. Indeed for the moment the ship does not even appear on the map:

! [The Void of Space] (./ docs / step1.png)

Go to the `Ship.re` file, to reactivate the rendering of our ship on the map by implementing the` render` function.

`` '' reason
let render = (canvasContext: Types.canvasContext, state: Types.shipState) =>
  switch state.potentialSprite {
  | None => ()
  };
`` ``

The `render` function takes as argument, first the canvas context ([API Canvas Context] (https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D)) and second, the state current of the vessel visible in the file `Types.re` at [line 7] (./ src / Types.re # L7).

Chief Engineer Scott, tells us via the communicator that the ship image is represented as an `option (Image)` (cf. [line 17] (./ src / Types.re # L17) of the `Types.re` file). An `option` is a particular type present natively in ReasonML called a` Variant`. It is in a way a shell coming to include a variable of which we do not know if it is valued or not. It can detect valuation in a more elegant and powerful way than a simple `maVar? DO_SOME_THING (): DO_NOTHING () `.

In our case, it is an `image option` so it is in a way a shell potentially containing an image (or not).
`option` can take either the` Some` state in the case where the` option` contains a value, or the `None` state if the` option` contains nothing.
To learn more about the option type, he sends us the following Spatio-link: <https://reasonml.github.io/docs/en/variant.html#option>

Spock gives us a guide on pattern matching. According to him, pattern matching is one of the best features of ReasonML, and it is thanks to it that we will be able to know the state of the option. He adds that currently `render` only manages the state where there is nothing in the` option` (aka `None`) and that the repair of the` render` function is just to add the `Some case `to draw the image. Doc:
<https://reasonml.github.io/docs/en/pattern-matching.html#usage>

> Once the `Some` case has been dealt with, we are advised to use the`
draw` in the file `Image.re` at [line 20] (./ src / Image.re # L20). This function has the particularity of using `labeled arguments` or named arguments. A named argument is an argument whose name is specified when calling the function where it is declared. This makes it possible, among other things, to improve the clarity of the given parameters. To learn more: (<https://reasonml.github.io/docs/en/function.html#labeled-arguments>).

<details>
<summary> <i> Discover the solution here </i> </summary>
<p>
<pre>
let render = (canvasContext: Types.canvasContext, state: Types.shipState) =>
  switch state.potentialShipSprite {
  | Some (sprite) => Image.draw (canvasContext, sprite, ~ x = state.x, ~ y = state.y)
  | None => ()
  };
</pre>
</p>
</details>

---

## Restart the auxiliary thrusters - (Step 2)

`` ``
#patternMatching, # immutability, #record, #spread
`` ``

Our ship is now visible but remains grounded and there is nothing we can do to defend the United Federation of Planets. We need to fix the booster thrusters.

! [Our ship is blocked] (./ docs / step2.png)

> Spock reminds us that our ship is based on a Flux architecture and that it has actions listed in the `Actions.re` file. These actions can be dispatched using the `dispatch` function of the` Store` module, which can be found in the `Store.re` file.

So that the ship can move again, you must implement the `onKeyDown` function of the` Ship.re` file to dispatch the `GoLeft` or` GoRight` actions of the `Actions` module according to the keyboard keys.

`` '' reason
let onKeyDown = (keyCode: string): unit =>
  switch keyCode {
  | _ => ()
  };
`` ``

Pay close attention to the results of the `Ship.re` part of the unit tests visible in the console. They tell you the expected behavior of `onKeyDown` in detail.

<details>
<summary> <i> Discover the solution here </i> </summary>
<p>
<pre>
let onKeyDown = (keyCode: string): unit =>
  switch keyCode {
  | "ArrowLeft" => Store.dispatch (Actions.GoLeft)
  | "ArrowRight" => Store.dispatch (Actions.GoRight)
  | _ => ()
  };
</pre>
</p>
</details>

---

The reducer of the ship `Ship_reducer.re` must also be updated to handle the actions` GoLeft` and `GoRight` in order to apply a translation of the ship in` x` depending on the direction you have dispatched. ..

> The Enterprise reducers have the particularity of taking in addition to the usual `action` and` state` parameters of classic reducers, an additional parameter called `elapsedTime`. This _float_ type parameter is actually the time spent since the last render loop. The time is indeed not always the same between two rendering loops and consequently having the time between two loops will allow to have movements at constant speed.

`` '' reason
let shipSpeed ​​= 0.5;

let reducer = (elapsedTime: float, state: Types.shipState, action: Ations.all): Types.shipState =>
  switch action {
  | _ => state
  };
`` ``

> _A very important reminder_: Remember that in our galaxy, the coordinates (0, 0) are those of the top left corner as illustrated below:

`` ``
(0,0) ---------------->
|
|
|
|
| (ship)
v
`` ``

> `Max` and` min` functions are available as well as a `constants` module containing the size of the map. And remember, you should always return a new instance of the state never modify it directly. You can use the Spread operator (<https://github.com/arecvlohe/reasonml-cheat-sheet#spread>) for this.

Pay close attention to the results of the unit tests visible in the console. They tell you the expected behavior of reducer in detail.

<details>
<summary> <i> Discover the solution here </i> </summary>
<p>
<pre>
let shipSpeed ​​= 0.7;
/ ** /
let reducer = (elapsedTime: float, state: Types.shipState, action: Actions.all): Types.shipState =>
  switch action {
  | GoLeft => {... state, x: max (0., State.x -. ElapsedTime *. ShipSpeed)}
  | GoRight => {
      ... state,
      x: min (Constants.width -. state.width, state.x +. elapsedTime *. shipSpeed)
    }
  | _ => state
  };
</pre>
</p>
</details>

---

## Alien detection

`` ``
#tuple, #patternMatching, #list, #spread
`` ``

The scouts tell us that the Aliens have a camouflage system making them undetectable to our radars.

It is the end !

Luckily, ears pointed to a solution: Relying on the ship's active intelligence and data from many previous battles, Spock has come to determine what the Aliens' exact trajectory will be during their attack. He then proposes to simulate these trajectories in the control screen so as not to be blind!

The simulation result would look like this:

`` ``
(0,0) ---------->
| x-O - O - O --- +
| |
| + - O - O - O - +
| |
| + -O - O - O --- +
| |
v v
`` ``

To implement this simulation, we will modify
r the alien shortwave radar implemented in `Alien_reducer.re` by following what unit tests tell us:

`` '' reason
let alienSpeed ​​= 0.3;

let nextX = (elapsedTime: float, a: Types.alien): float => 0 .;

let isOnEdge = (newX: float, alien: Types.alien): (bool, bool) => (true, true);

let alienStep = 70 .;

let moveOnLeftEdge = (a: Types.alien): Types.alien => a;

let moveOnRightEdge = (a: Types.alien): Types.alien => a;

let moveAlien = (elapsedTime: float, a: Types.alien): Types.alien => a;

let isStillInMap = (alien: Types.alien) => a;

let moveAliens = (aliens: list (Types.alien), elapsedTime: float): list (Types.alien) => aliens;

let reducer = (elapsedTime: float, state: Types.alienState, action: Actions.all): Types.alienState =>
  switch action {
  | Tick ​​=> {... state, aliens: moveAliens (state.aliens, elapsedTime)}
  | _ => state
  };
`` ``

To implement the `nextX` function, you will need the` float_of_int` function to convert an `int` to a` float`.

The `isOnEdge` function will return a type that we haven't used yet, because it is a` tuple`, a two-element Tuple to be more precise. A tuple represents a set of variables, when it comes to a tuple of two we often even say that it is a pair. `isOnEdge` will return a tuple composed for its left part of a boolean to know if the alien passed in parameter touches the left edge, and of another boolean for its right part to know if the alien passed in parameter touches the right edge. More info [here] (https://reasonml.github.io/docs/fr/tuple.html).

To implement `moveAlien`, you will call the` nextX`, `isOnEdge`,` moveOnLeftEdge`, `moveOnRightEdge` functions.

> Good to know: you can do pattern matching on a tuple ;-)

To implement `moveAliens` you will use a very nice syntax called the` pipe operator` as well as the ReasonML `list` API. More info here:
<http://2ality.com/2017/12/functions-reasonml.html#the-reverse-application-operator>

<details>
<summary> <i> Discover the solution here </i> </summary>
<p>
<pre>
let alienSpeed ​​= 0.3;
/ * * /
let nextX = (elapsedTime: float, a: Types.alien) =>
  a.x +. elapsedTime *. alienSpeed ​​*. float_of_int (a.direction);
/ * * /
let isOnEdge = (newX: float, alien: Types.alien): (bool, bool) => (
  newX <0.,
  newX +. alien.width> Constants.width
);
/ * * /
let alienStep = 70 .;
/ * * /
let moveOnLeftEdge = (a: Types.alien): Types.alien => {
  ...at,
  x: 0.,
  y: a.y +. alienStep,
  direction: 1
};
/ * * /
let moveOnRightEdge = (a: Types.alien): Types.alien => {
  ...at,
  x: Constants.width -. a.width,
  y: a.y +. alienStep,
  direction: (-1)
};
/ * * /
let moveAlien = (elapsedTime: float, a: Types.alien): Types.alien => {
  let x = nextX (elapsedTime, a);
  switch (isOnEdge (x, a)) {
  | (false, false) => {... a, x}
  | (true, _) => moveOnLeftEdge (a)
  | (_, true) => moveOnRightEdge (a)
  };
};
/ * * /
let isStillInMap = (alien: Types.alien) => alien.y <Constants.height;
/ * * /
let moveAliens = (aliens: list (Types.alien), elapsedTime: float): list (Types.alien) =>
  aliens |> List.map (moveAlien (elapsedTime)) |> List.filter (isStillInMap);
/ * * /
let reducer = (elapsedTime: float, state: Types.alienState, action: Actions.all): Types.alienState =>
  switch action {
  | Tick ​​=> {... state, aliens: moveAliens (state.aliens, elapsedTime)}
  | _ => state
  };
</pre>
</p>
</details>

## Collision !

`` ``
#tuple, #list, #concatenation
`` ``

The business is almost ready! Only the collision detection system remains inoperative. Press the space bar and you will see the problem!

! [Hard to repel an invasion like this!] (./ docs / no-Collision.gif)

Look at the `Collision.re` file, it contains the` findNotCollided` function responsible for taking aliens and projectiles and only bringing out those that have not had a collision between them. As with the last chapters, you can rely on unit tests to guide you. For this function we will have to use the `fold_left` function of the` List` module, and the concatenation of `list` thanks to the` @ `operator.

<details>
<summary> <i> Discover the solution here </i> </summary>
<p>
<pre>
let removeKilledBy = (shot: Types.shot, aliens: list (Types.alien)): list (Types.alien) =>
  List.filter (
    (alien: Types.alien) =>
      ! (
        shot.x <alien.x
        +. alien.width
        && shot.x
        +. shot.width> alien.x
        && shot.y <alien.y
        +. alien.height
        && shot.height
        +. shot.y> alien.y
      ),
    aliens
  );
let findNotCollided =
    (aliens: list (Types.alien), shots: list (Types.shot))
    : (list (Types.alien), list (Types.shot)) => {
  let initValue: (list (Types.alien), list (Types.shot)) = (aliens, []);
  List.fold_left (
    ((aliensStillAlive, missedShots), shot: Types.shot) => {
      let newAliensStillAlive = aliensStillAlive |> removeKilledBy (shot);
      let isShotHit = List.length (newAliensStillAlive)! =
List.length (aliensStillAlive);
       let newMissedShot = isShotHit? missedShots: missedShots @ [shot];
       (newAliensStillAlive, newMissedShot);
     },
     initValue,
     shots
   );
};
</pre>
</p>
</details>
