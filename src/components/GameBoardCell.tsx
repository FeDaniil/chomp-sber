import React from "react";

import {ChompGame} from "../logic/ChompGame";
import {pickMoveMCTS} from "../logic/ai";

export default function GameBoardCell({i, game, setGame, difficulty, previewInd, setPreviewInd, previewSet}) {
    const setPreviewF = (i) => () => {
        if (game.currentPlayer === 1 && game.isValidMove(i))
            setPreviewInd(i)
    }
    const unsetPreviewF = (i) => () => {
        if (previewInd === i)
            setPreviewInd(-1)
    }

    const playerClass = game.state === ChompGame.MOVE_PLAYER_1 ? "player-1" : "player-2";
    const poisonClass = game.isPoison(i) ? "poison" : "";
    const previewClass = previewSet.has(i) ? "preview" : "";
    const previewMainClass = previewInd === i ? "preview-main" : "";
    const transparentClass = !game.field[i] ? "transparent" : "";
    const classAccumulated = `board-item ${playerClass} ${poisonClass} ${previewClass} ${previewMainClass} ${transparentClass}`;

    return <div className={classAccumulated}
                onClick={() => {
                    if (game.currentPlayer === 1 && game.isValidMove(i)) {
                        const nextGame = game.afterMove(i);
                        setGame(nextGame);
                        unsetPreviewF(i);
                        if (!nextGame.finished) {
                            setTimeout(async () => {
                                const aiGenerator = pickMoveMCTS(nextGame, difficulty);
                                let tick = 0;
                                while (true) {
                                    const itRes = await aiGenerator.next();
                                    const aiMove = itRes.value;
                                    if (tick % 10 === 0) setPreviewInd(aiMove);
                                    if (itRes.done) {
                                        await new Promise(resolve => setTimeout(resolve, 250));
                                        setGame(nextGame.afterMove(aiMove));
                                        break;
                                    }
                                    ++tick;
                                }
                            }, 0)
                        }
                    }
                }}
                onPointerEnter={setPreviewF(i)}
                onPointerOut={unsetPreviewF(i)}/>
}