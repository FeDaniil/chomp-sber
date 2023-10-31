import React, {useState} from "react";
import styled from "styled-components";

import "./GameBoard.css"
import {ChompGame} from "../ChompGame";

const BoardWrapper = styled.div`
  display: grid;
  overflow: hidden;
`;

export default function GameBoard({game, setGame}) {
    const [previewInd, setPreviewInd] = useState(-1);
    const setPreviewF = (i) => () => {
        if (!game.isPoison(i))
            setPreviewInd(i)
    }
    const unsetPreviewF = (i) => () => {
        if (previewInd === i)
            setPreviewInd(-1)
    }

    let boardItems: JSX.Element[] = [];
    let field = game.field;
    let previewSet = new Set(previewInd !== -1 ? game.upperRightList(previewInd) : []);
    for (let i = 0; i < field.length; ++i) {
        const playerClass = game.state === ChompGame.MOVE_PLAYER_1 ? "player-1" : "player-2";
        const poisonClass = game.isPoison(i) ? "poison" : "";
        const previewClass = previewSet.has(i) ? "preview" : "";
        const previewMainClass = previewInd === i ? "preview-main" : "";
        const transparentClass = !field[i] ? "transparent" : "";
        const classAccumulated = `board-item ${playerClass} ${poisonClass} ${previewClass} ${previewMainClass} ${transparentClass}`;
        boardItems.push(<div className={classAccumulated}
                             onClick={() => {
                                 if (field[i] && !game.isPoison(i))
                                     setGame(game.afterMove(i));
                             }}
                             onMouseEnter={setPreviewF(i)}
                             onPointerDown={setPreviewF(i)}
                             onMouseLeave={unsetPreviewF(i)}
                             onPointerUp={unsetPreviewF(i)}></div>)
    }
    const rows = game.rows;
    const columns = game.columns;
    return (
        <BoardWrapper style={{
            gridTemplateColumns: `repeat(${rows}, calc(min((60vh - 115px) / ${columns * 1.1 - 0.1}, 90vw / ${rows * 1.1 - 0.1})))`,
            gap: `calc(min((70vh - 110px) / ${columns * 1.1 - 0.1}, 90vw / ${rows * 1.1 - 0.1}) / 10)`
        }}>
            {boardItems}
        </BoardWrapper>
    );
}