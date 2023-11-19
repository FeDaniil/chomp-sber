import React, {useEffect, useState} from "react";
import styled from "styled-components";

import {Button, Col, Container, H1, Row} from "@salutejs/plasma-ui";
import {ChompGame} from "../logic/ChompGame";
import GameStatus from "../components/GameStatus";
import GameBoard from "../components/GameBoard";
import RulesOverlay from "../components/RulesOverlay";
import {IconHelp, IconReset} from "@salutejs/plasma-icons";

const GameWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const ColHalf = styled(Col)`
  flex: 1;
`;

let isFirstGame = true;

export default function Game({rows = 4, columns = 7, difficulty = 0, character, setStartPage}) {
    const [game, setGame] = useState(ChompGame.create(rows, columns));
    const [showRules, setShowRules] = useState(isFirstGame);

    useEffect(() => {
        isFirstGame = false;
    }, []);

    return (
        <GameWrapper>
            <Container><H1 style={{textAlign: "center"}}>Отравленная шоколадка</H1></Container>
            <Container><GameStatus gameState={game.state} character={character}></GameStatus></Container>
            <GameBoard game={game} setGame={setGame} difficulty={difficulty}></GameBoard>
            <Container><Row>
                <ColHalf><Button text="Новая игра" size="l" view="overlay" stretch={true} contentLeft={<IconReset/>}
                                 shiftLeft={false} shiftRight={false} focused={game.finished}
                                 onClick={setStartPage}/></ColHalf>
                <ColHalf><Button text="Правила" size="l" view="overlay" stretch={true} contentLeft={<IconHelp/>}
                                 shiftLeft={false} shiftRight={false} onClick={() => setShowRules(true)}/></ColHalf>
            </Row></Container>
            {showRules && <RulesOverlay rows={rows} columns={columns} closeRules={() => setShowRules(false)}/>}
        </GameWrapper>
    );
}