import React, {useState} from "react";

import {Button, Container, H1, TabItem, Tabs, TextL} from "@salutejs/plasma-ui";
import styled from "styled-components";

const StartWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export default function Start() {
    const [difficulty, setDifficulty] = useState(0);

    const tabs = [{label: "Легко"}, {label: "Средне"}, {label: "Сложно"}];

    return (<StartWrapper>
        <img src="/chocolate.svg" alt="шоколадная плитка"
             style={{height: "auto", width: "auto", maxWidth: "90vw", maxHeight: "40vh"}}/>
        <Container><H1 style={{textAlign: "center"}}>Игра отравленная шоколадка</H1></Container>
        <Container><TextL>
            Два игрока по очереди отламывают куски шоколадки.
            Каждый ход игрок выбирает одну из оставшихся плиток.
            Тот, кто будет вынужден съесть ядовитую плитку, проигрывает.
        </TextL></Container>
        <Container><Button text="Начать игру" size="l" view="primary" stretch={true}></Button></Container>
        <Container><Tabs
            size="l"
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