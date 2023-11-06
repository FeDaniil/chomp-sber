const STEPS = 50;
const STEP_TIMEOUT_MS = 100;
const STEP_MAX_ITER = 1000;
const C = Math.sqrt(2);
const DIFF_THRESH = [0.35, 0.5, 0.8];

class Node {
    constructor(game) {
        this.game = game;
        this.wins = 0;
        this.plays = 0;
        this.nxt = [];
    }

    get winP() {
        return this.wins / this.plays;
    }

    randomPlay(expectedWinner) { // assuming parent calls this, so outcome = 1 is a loss for this Node
        const outcome = randomPlay(this.game, expectedWinner);
        this.wins += !outcome;
        this.plays += 1;
        return outcome;
    }

    expand() {
        const nextMoves = this.game.validMoves;
        this.nxt = nextMoves.map(move => ({move, node: new Node(this.game.afterMove(move))}));
        let curWins = 0, curPlays = 0;
        for (let i = 0; i < this.nxt.length; ++i) {
            const outcome = this.nxt[i].node.randomPlay(this.game.currentPlayer);
            curWins += outcome;
            curPlays += 1;
        }
        this.wins += curWins;
        this.plays += curPlays;
        return {wins: curWins, plays: curPlays};
    }

    selectThenExpand(prevPlayer) {
        if (this.game.finished) {
            this.wins += prevPlayer !== this.game.winner;
            this.plays += 1;
            return {wins: prevPlayer !== this.game.winner, plays: 1};
        }
        if (this.nxt.length === 0) {
            return this.expand();
        }
        let maxI = -1, maxValue = -1;
        for (let i = 0; i < this.nxt.length; ++i) {
            const nxt = this.nxt[i].node;
            // UCT formula, (1 - nxt.winP) since we want nxt to lose hence current Node wins
            let curValue = 1 - nxt.winP + C * Math.sqrt(Math.log(this.plays) / nxt.plays);
            if (curValue > maxValue) {
                maxI = i;
                maxValue = curValue;
            }
        }
        const {wins, plays} = this.nxt[maxI].node.selectThenExpand(this.game.currentPlayer);
        this.wins += plays - wins;
        this.plays += plays;
        return {wins: plays - wins, plays};
    }
}

export async function* calcMCTS(game) {
    const root = new Node(game);

    for (let step = 0; step < STEPS; ++step) {
        const startTs = Date.now();
        for (let iter = 0; Date.now() - startTs < STEP_TIMEOUT_MS && iter < STEP_MAX_ITER; ++iter) {
            root.selectThenExpand();
        }

        yield new Promise(resolve => {
            setTimeout(() => resolve(root.nxt.map(({move, node}) => ({
                move,
                winP: 1 - node.winP
            })).sort((a, b) => b.winP - a.winP)), 0)
        });
    }
}

function randomPlay(game, expectedWinner) {
    if (game.finished) {
        return game.winner === expectedWinner;
    }
    const nextMoves = game.validMoves;
    const randomMove = nextMoves[Math.floor(Math.random() * nextMoves.length)];
    return randomPlay(game.afterMove(randomMove), expectedWinner);
}

export async function* pickMoveMCTS(game, difficulty) {
    const mctsGen = calcMCTS(game);
    let lastRes = -1;

    for (let step = 0; step < STEPS; ++step) {
        const itRes = await mctsGen.next();
        const mcts = itRes.value;
        const firstBadMove = (mcts.findIndex(x => x.winP < DIFF_THRESH[difficulty]) + mcts.length + 1) % (mcts.length + 1);
        if (firstBadMove === 0) yield lastRes = mcts[0].move;
        yield lastRes = mcts[Math.floor(Math.random() * firstBadMove)].move;
    }

    return lastRes;
}
