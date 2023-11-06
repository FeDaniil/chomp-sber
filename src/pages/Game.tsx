import React, {useState} from "react";
import styled from "styled-components";

import {Button, Container, H1} from "@salutejs/plasma-ui";
import {CharacterName} from "@salutejs/scenario";
import {ChompGame} from "../logic/ChompGame";
import GameStatus from "../components/GameStatus";
import GameBoard from "../components/GameBoard";
import RulesOverlay from "../components/RulesOverlay";
import {IconReset} from "@salutejs/plasma-icons";

const GameWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

export default function Game({
                                 rows = 4, columns = 7, difficulty = 0,
                                 characterName = "Сбер" as CharacterName,
                                 setStartPage
                             }) {
    const [game, setGame] = useState(ChompGame.create(rows, columns));
    const [showRules, setShowRules] = useState(false);

    return (
        <GameWrapper>
            <Container><H1 style={{textAlign: "center"}}>Отравленная шоколадка</H1></Container>
            <Container><GameStatus gameState={game.state} characterName={characterName}></GameStatus></Container>
            <GameBoard game={game} setGame={setGame} difficulty={difficulty}></GameBoard>
            <Container>{game.finished ?
                <Button text="Новая игра" size="l" view="overlay" stretch={true} contentLeft={<IconReset/>}
                        onClick={setStartPage}></Button> :
                <Button text="Правила" size="l" view="overlay" stretch={true}
                        onClick={() => setShowRules(true)}></Button>}
            </Container>
            {showRules && <RulesOverlay rows={rows} columns={columns} closeRules={() => setShowRules(false)}/>}
        </GameWrapper>
    );
}