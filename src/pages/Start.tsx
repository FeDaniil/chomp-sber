import React from "react";

import {Button, Container, H2, TabItem, Tabs, TextM} from "@salutejs/plasma-ui";
import styled from "styled-components";

const StartWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export default function Start({difficulty, setDifficulty, setPageGame}) {
    const tabs = [{label: "Легко"}, {label: "Средне"}, {label: "Сложно"}];

    return (<StartWrapper>
        <img src="/chocolate.svg" alt="шоколадная плитка"
             style={{height: "auto", width: "auto", maxWidth: "90vw", maxHeight: "20vh"}}/>
        <Container><H2 style={{textAlign: "center"}}>Игра отравленная шоколадка</H2></Container>
        <Container><TextM>
            Два игрока по очереди отламывают куски шоколадки.
            Каждый ход игрок выбирает одну из оставшихся плиток.
            Тот, кто будет вынужден съесть ядовитую плитку, проигрывает.
        </TextM></Container>
        <Container><Button text="Начать игру" size="m" view="primary" stretch={true}
                           onClick={setPageGame}></Button></Container>
        <Container><Tabs
            size="m"
            view="secondary"
            stretch={true}
            pilled={false}
            scaleOnPress={true}
            outlined={false}
            index={difficulty}
            animated={true}
        >
            {tabs.map((e, i) => (
                <TabItem
                    key={`item:${i}`}
                    isActive={i === difficulty}
                    onClick={() => setDifficulty(i)}
                >
                    {e.label}
                </TabItem>
            ))}
        </Tabs></Container>
    </StartWrapper>);
}