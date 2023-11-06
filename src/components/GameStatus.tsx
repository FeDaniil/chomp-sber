import React from "react";
import styled from "styled-components";

import {TextL} from "@salutejs/plasma-ui";
import {ChompGame} from "../logic/ChompGame";

const GameStatusTextL = styled(TextL)`
  display: flex;
  flex-direction: column;
  text-align: center;
  background: #1A1A1A;
  opacity: 0.8;
  border-radius: 1.25rem;
  padding: 1rem;
`;


export default function GameStatus({gameState, characterName}) {
    const textSpan =
        gameState === ChompGame.MOVE_PLAYER_1 ?
            <span style={{color: "#2AC673"}}>Ваш ход, отломите шоколадку</span> :
        gameState === ChompGame.MOVE_PLAYER_2 ?
            <span style={{color: "#2990FF"}}>Ходит {characterName}</span> :
        gameState === ChompGame.WIN_PLAYER_1 ?
            <span style={{color: "#2AC673"}}>Конец игры! Вы победили.</span> :
        gameState === ChompGame.WIN_PLAYER_2 ?
            <span style={{color: "#DC283A"}}>Конец игры! Вы проиграли.</span> : <></>;
    return (
        <>
            <GameStatusTextL bold={gameState !== ChompGame.MOVE_PLAYER_2}>
                {textSpan}
            </GameStatusTextL>
        </>
    );
}