export class ChompGame {
    static MOVE_PLAYER_1 = "move_player_1";
    static MOVE_PLAYER_2 = "move_player_2";
    static WIN_PLAYER_1 = "win_player_1";
    static WIN_PLAYER_2 = "win_player_2";

    static create(rows = 4, columns = 7) {
        return new ChompGame(
            ChompGame.MOVE_PLAYER_1,
            rows,
            columns,
            Array(rows * columns).fill(true)
        );
    }

    constructor(state, rows, columns, field, needNewState = false) {
        this.rows = rows;
        this.columns = columns;
        this.field = field;
        this.state = needNewState ? this.#getNewState(state) : state;
    }

    get finished() {
        return this.state === ChompGame.WIN_PLAYER_1 || this.state === ChompGame.WIN_PLAYER_2;
    }

    isPoison(index) {
        return index === this.rows * this.columns - this.rows;
    }

    indexToXY(index) {
        return {
            row: Math.floor(index / this.rows),
            column: index % this.rows
        };
    }

    xyToIndex(row, column) {
        return row * this.rows + column;
    }

    upperRightList(index) {
        const {row, column} = this.indexToXY(index);
        let res = [];
        for (let i = 0; i <= row; ++i) {
            for (let j = column; j < this.rows; ++j) {
                res.push(this.xyToIndex(i, j));
            }
        }
        return res;
    }

    afterMove(index) {
        let newField = [...this.field];
        for (let i of this.upperRightList(index)) {
            newField[i] = false;
        }
        return new ChompGame(
            this.state,
            this.rows,
            this.columns,
            newField,
            true
        );
    }

    #getNewState(prevState) {
        const barsLeft = this.field.filter(isAlive => isAlive).length;
        if (barsLeft === 0) {
            return this.#getWinner(this.#getNext(prevState));
        } else if (barsLeft === 1) {
            return this.#getWinner(prevState);
        } else {
            return this.#getNext(prevState);
        }
    }

    #getWinner(prevState) {
        return prevState === ChompGame.MOVE_PLAYER_1 ? ChompGame.WIN_PLAYER_1 : ChompGame.WIN_PLAYER_2;
    }

    #getNext(prevState) {
        return prevState === ChompGame.MOVE_PLAYER_1 ? ChompGame.MOVE_PLAYER_2 : ChompGame.MOVE_PLAYER_1;
    }
}