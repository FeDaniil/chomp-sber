import React from "react";
import styled from "styled-components";

import {Button, TextL} from "@salutejs/plasma-ui";
import {IconMenu, IconReset} from "@salutejs/plasma-icons";
import {ChompGame} from "../ChompGame";

const GameEndWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  z-index: 1;
`;

export default function GameEnd() {
    return <GameEndWrapper>
        <Button size="l" contentLeft={<IconReset/>} text="Заново?" view="primary"/>
        <span style={{height: "1rem"}}></span>
        <Button size="s" contentLeft={<IconMenu/>} text="Меню" view="secondary"/>
    </GameEndWrapper>;
}