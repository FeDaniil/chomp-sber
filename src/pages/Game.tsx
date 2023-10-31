import React, {useState} from "react";
import styled from "styled-components";

import {Container, H1} from "@salutejs/plasma-ui";
import {CharacterName} from "@salutejs/scenario";
import {ChompGame} from "../ChompGame";
import GameStatus from "../components/GameStatus";
import GameBoard from "../components/GameBoard";
import GameEnd from "../components/GameEnd";

const GameWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

export default function Game({rows = 4, columns = 7, characterName = "Сбер" as CharacterName}) {
    const [game, setGame] = useState(ChompGame.create(rows, columns));

    return (
        <GameWrapper>
            <Container><H1 style={{textAlign: "center"}}>Отравленная шоколадка</H1></Container>
            <Container><GameStatus gameState={game.state} characterName={characterName} gameFinished={game.finished}></GameStatus></Container>
            <GameBoard game={game} setGame={setGame}></GameBoard>
        </GameWrapper>
    );
}