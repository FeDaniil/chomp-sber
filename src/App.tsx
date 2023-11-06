import React, {useEffect, useRef, useState} from "react";
import styled, {createGlobalStyle} from "styled-components";

import {createSmartappDebugger, createAssistant, AssistantAppState} from "@salutejs/client";
import {CharacterId, CharacterName} from "@salutejs/scenario";
import {salutejs_eva__dark, salutejs_joy__dark, salutejs_sber__dark} from "@salutejs/plasma-tokens/themes";
import {text, background, gradient} from '@salutejs/plasma-tokens';

import "./App.css";
import Start from "./pages/Start";
import Game from "./pages/Game";

// Theming from Plasma UI example: https://plasma.sberdevices.ru/ui/theming/
const ThemeBackgroundEva = createGlobalStyle(salutejs_eva__dark);
const ThemeBackgroundSber = createGlobalStyle(salutejs_sber__dark);
const ThemeBackgroundJoy = createGlobalStyle(salutejs_joy__dark);

const DocStyles = createGlobalStyle`
  html {
    color: ${text};
    background-color: ${background};
    background-image: ${gradient};
    min-height: 100vh;
  }
`;

function initializeAssistant(getState) {
    if (process.env.NODE_ENV === "development") {
        return createSmartappDebugger({
            token: process.env.REACT_APP_TOKEN ?? "", initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`, getState,
        });
    }
    return createAssistant({getState});
}

function getWrapperWithInsets(insets) {
    return styled.div`
      --insets-left: ${insets.left}px;
      --insets-top: ${insets.top}px;
      --insets-right: ${insets.right}px;
      --insets-bottom: ${insets.bottom * 1.11}px; // Plasma is "a little" inaccurate, so need some safe margin
      --insets: var(--insets-top) var(--insets-right) var(--insets-bottom) var(--insets-left);

      margin: var(--insets);

      width: calc(100vw - var(--insets-left) - var(--insets-right));
      height: calc(100vh - var(--insets-top) - var(--insets-bottom));
    `;
}

const characterIdToName = new Map<CharacterId, CharacterName>([["sber", "Сбер"], ["eva", "Афина"], ["joy", "Джой"]]);

// https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
let appDidInit = false;

export default function App() {
    const [character, setCharacter] = useState("sber" as CharacterId);
    // If insets are set to 0 by default, it takes ~1 second to receive them from event, and it appears as
    // awfully noticeable "blink" of the UI. So default values are the most popular insets from my testing.
    const [AppWrapper, setAppWrapper] = useState(getWrapperWithInsets({left: 0, top: 0, right: 0, bottom: 144}));

    const assistantStateRef = useRef<AssistantAppState>();
    const assistantRef = useRef<ReturnType<typeof createAssistant>>();

    useEffect(() => {
        if (!appDidInit) {
            appDidInit = true;
            assistantRef.current = initializeAssistant(() => assistantStateRef.current);
            assistantRef.current.on("data", (command) => {
                switch (command.type) {
                    case "character":
                        setCharacter(command.character.id);
                        break;
                    case "insets":
                        setAppWrapper(getWrapperWithInsets(command.insets));
                        console.log(command.insets);
                        break;
                    default:
                        console.log("Unhandled on(data): " + command.type);
                        return;
                }
            });
        }
    }, []);

    const [difficulty, setDifficulty] = useState(0);
    const [page, setPage] = useState("start");

    return (
        <AppWrapper>
            {(() => {
                switch (page) {
                    case "start":
                        return <Start difficulty={difficulty} setDifficulty={setDifficulty}
                                      setPageGame={() => setPage("game")}></Start>;
                    case "game":
                        return <Game rows={4} columns={7} difficulty={difficulty}
                                     characterName={characterIdToName.get(character)}
                                     setStartPage={() => setPage("start")}/>;
                    default:
                        return;
                }
            })()}
            <DocStyles/>
            {(() => {
                switch (character) {
                    case "sber":
                        return <ThemeBackgroundSber/>;
                    case "eva":
                        return <ThemeBackgroundEva/>;
                    case "joy":
                        return <ThemeBackgroundJoy/>;
                    default:
                        return;
                }
            })()}
        </AppWrapper>
    );
}
