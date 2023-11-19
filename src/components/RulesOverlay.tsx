import React from "react";
import styled from "styled-components";

import {Button, Container, H1, TextL} from "@salutejs/plasma-ui";

const ShadeBackground = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(4px);
  z-index: 1;
`;

const RulesText = styled(Container)`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-left: var(--plasma-grid-margin);
  margin-right: var(--plasma-grid-margin);
  padding-top: 32px;
  padding-bottom: 32px;
  width: calc(100% - 2 * var(--plasma-grid-margin));
  border-radius: 16px;
  background: var(--plasma-colors-voice-phrase-gradient);
  z-index: 1;
`;

export default function RulesOverlay({rows, columns, closeRules}) {
    return <>
        <ShadeBackground onClick={closeRules}/>
        <RulesText>
            <H1>Правила</H1>
            <TextL>Дана шоколадка из {rows} x {columns} плиток, плитка в левом-нижнем углу ядовитая.</TextL>
            <TextL>Двое по очереди выбирают одну из оставшихся плиток, отламывают и съедают правый-верхний угол
                шоколадки (выбранную плитку и все плитки не ниже и не левее её).</TextL>
            <TextL>Тот, кому достанется последняя, ядовитая плитка, проигрывает.</TextL>
            <Button text="Закрыть" size="l" view="checked" stretch={true} onClick={closeRules}></Button>
        </RulesText>
    </>;
}