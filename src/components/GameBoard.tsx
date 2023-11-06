import React, {useState} from "react";
import styled from "styled-components";

import "./GameBoard.css"
import GameBoardCell from "./GameBoardCell";

const BoardWrapper = styled.div`
  display: grid;
`;

export default function GameBoard({game, setGame, difficulty}) {
    const [previewInd, setPreviewInd] = useState(-1);

    let boardItems: JSX.Element[] = [];
    let field = game.field;
    let previewSet = new Set(previewInd !== -1 ? game.upperRightList(previewInd) : []);
    for (let i = 0; i < field.length; ++i) {
        boardItems.push(<GameBoardCell i={i} game={game} setGame={setGame} difficulty={difficulty}
                                       previewInd={previewInd} setPreviewInd={setPreviewInd} previewSet={previewSet}/>)
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