enum Die { Green, Yellow, Red }

enum DieSide { Brain, Shot, Footprint }

const DICE: Array<Die> = [
    Die.Green, Die.Green, Die.Green, Die.Green, Die.Green, Die.Green,
    Die.Yellow, Die.Yellow, Die.Yellow, Die.Yellow,
    Die.Red, Die.Red, Die.Red,
];

class RolledDie {
    die: Die
    side: DieSide

    constructor(die: Die, side: DieSide) {
        this.die = die;
        this.side = side;
    }

    toString() {
        return `[${Die[this.die]} ${DieSide[this.side]}]`;
    }
}

class GameState {
    availableDice: Array<Die> = DICE.slice(); // Make a copy to not overwrite it.
    playedDice: Array<RolledDie> = [];
    inHand: Array<Die> = [];

    takeTreeDice() {
        if (this.inHand.length > 0) {
            return;
        }

        this.inHand = this.playedDice.filter(d => d.side == DieSide.Footprint).map(d => d.die);
        this.playedDice = this.playedDice.filter(d => d.side != DieSide.Footprint);

        if (this.availableDice.length == 0) {
            return;
        }

        for (var i = this.inHand.length; i < 3; i++) {
            const die = this.availableDice[Math.floor(Math.random() * this.availableDice.length)];

            this.inHand.push(die);
            this.availableDice.splice(this.availableDice.indexOf(die), 1);
        }
    }

    rollDice() {
        const rolled = this.inHand.map(rollDie);
        this.playedDice = this.playedDice.concat(rolled);
        this.inHand = [];
    }

    isEndState(): boolean {
        return this.playedDice.filter(d => d.side == DieSide.Shot).length >= 3;
    }
}

function distribution(die: Die): Array<DieSide> {
    switch (die) {
        case Die.Green:
            return [DieSide.Brain, DieSide.Brain, DieSide.Brain, DieSide.Footprint, DieSide.Footprint, DieSide.Shot];
        case Die.Yellow:
            return [DieSide.Brain, DieSide.Brain, DieSide.Footprint, DieSide.Footprint, DieSide.Shot, DieSide.Shot];
        case Die.Red:
            return [DieSide.Brain, DieSide.Footprint, DieSide.Footprint, DieSide.Shot, DieSide.Shot, DieSide.Shot];
    }
}

function rollDie(die: Die): RolledDie {
    const sides = distribution(die);
    const side = sides[Math.floor(Math.random() * sides.length)];
    return new RolledDie(die, side);
}

//////////////////////////////////////////////////////////////////////////

const available = document.getElementById('available') as HTMLSpanElement;
const played = document.getElementById('played') as HTMLSpanElement;
const in_hand = document.getElementById('in-hand') as HTMLSpanElement;

const brains = document.getElementById('brains') as HTMLSpanElement;
const shots = document.getElementById('shots') as HTMLSpanElement;

const button_start = document.getElementById('button-start') as HTMLButtonElement;
const button_take = document.getElementById('button-take') as HTMLButtonElement;
const button_play = document.getElementById('button-play') as HTMLButtonElement;

var gamestate: GameState;

function printGameState() {
    available.textContent = gamestate.availableDice.map(d => Die[d]).toString();
    played.textContent = gamestate.playedDice.toString();
    in_hand.textContent = gamestate.inHand.map(d => Die[d]).toString();

    brains.textContent = gamestate.playedDice.filter(d => d.side == DieSide.Brain).length.toString();
    shots.textContent = gamestate.playedDice.filter(d => d.side == DieSide.Shot).length.toString();
}

function start() {
    gamestate = new GameState();
    printGameState();

    button_take.disabled = false;
    button_play.disabled = false;
}

function take() {
    gamestate.takeTreeDice();
    printGameState();
}

function play() {
    gamestate.rollDice();
    printGameState();

    if (gamestate.isEndState()) {
        alert('You lose!');
        button_take.disabled = true;
        button_play.disabled = true;
    }
}