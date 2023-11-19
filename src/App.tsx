import React, {useEffect, useRef, useState} from "react";
import styled, {createGlobalStyle} from "styled-components";

import {
    createSmartappDebugger,
    createAssistant,
    AssistantAppState,
    ThemeColorName,
    Character,
    CharacterId
} from "@salutejs/client";
import {
    salutejs_eva__dark, salutejs_eva__light,
    salutejs_joy__dark, salutejs_joy__light,
    salutejs_sber__dark, salutejs_sber__light
} from "@salutejs/plasma-tokens/themes";
import {text, background, gradient} from '@salutejs/plasma-tokens';

import "./App.css";
import Start from "./pages/Start";
import Game from "./pages/Game";

// Theming from Plasma UI example: https://plasma.sberdevices.ru/ui/theming/
const ThemeBackgroundEvaDark = createGlobalStyle(salutejs_eva__dark);
const ThemeBackgroundSberDark = createGlobalStyle(salutejs_sber__dark);
const ThemeBackgroundJoyDark = createGlobalStyle(salutejs_joy__dark);
const ThemeBackgroundEvaLight = createGlobalStyle(salutejs_eva__light);
const ThemeBackgroundSberLight = createGlobalStyle(salutejs_sber__light);
const ThemeBackgroundJoyLight = createGlobalStyle(salutejs_joy__light);

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
            nativePanel: {
                // Стартовый текст в поле ввода пользовательского запроса
                defaultText: 'Покажи что-нибудь',
                // Позволяет включить вид панели, максимально приближенный к панели на реальном устройстве
                screenshotMode: false,
                // Атрибут `tabindex` поля ввода пользовательского запроса
                tabIndex: -1,
            }
        });
    }
    return createAssistant({getState});
}

// I hate Sber: they don't provide that info with "character" command, also nowhere in SaluteJS.
// Manually derived the map from human-readable doc at https://developers.sber.ru/docs/ru/va/background/assistants
function characterById(id: CharacterId): Character {
    switch (id) {
        case "sber":
            return {
                id: "sber",
                name: "Сбер",
                gender: "male",
                appeal: "official"
            };
        case "eva":
            return {
                id: "eva",
                name: "Афина",
                gender: "female",
                appeal: "official"
            };
        case "joy":
            return {
                id: "joy",
                name: "Джой",
                gender: "female",
                appeal: "no_official"
            };
    }
}

// I don't use insets since they are just useless: the numbers I get from assistant on real device are just too huge.
// From Salute telegram chat I deduced that most people just use magic constant margin-bottom: 144px and it works fine.
const AppWrapper = styled.div`
  margin-bottom: 144px;
  padding: 30px 0 0;
  width: 100vw;
  height: calc(100vh - 144px);
`;

// https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
let appDidInit = false;

export default function App() {
    const [character, setCharacter] = useState(characterById("sber"));
    const setCharacterById = (id: CharacterId) => setCharacter(characterById(id));
    const [theme, setTheme] = useState("dark" as ThemeColorName);

    const assistantStateRef = useRef<AssistantAppState>();
    const assistantRef = useRef<ReturnType<typeof createAssistant>>();

    useEffect(() => {
        if (!appDidInit) {
            appDidInit = true;
            assistantRef.current = initializeAssistant(() => assistantStateRef.current);
            assistantRef.current.on("data", (command) => {
                switch (command.type) {
                    case "theme":
                        setTheme(command.theme.name);
                        break;
                    case "character":
                        setCharacterById(command.character.id);
                        break;
                    default:
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
                                     character={character} setStartPage={() => setPage("start")}/>;
                    default:
                        return;
                }
            })()}
            <DocStyles/>
            {(() => {
                switch (character.id) {
                    case "sber":
                        return theme === "dark" ? <ThemeBackgroundSberDark/> : <ThemeBackgroundSberLight/>;
                    case "eva":
                        return theme === "dark" ? <ThemeBackgroundEvaDark/> : <ThemeBackgroundEvaLight/>;
                    case "joy":
                        return theme === "dark" ? <ThemeBackgroundJoyDark/> : <ThemeBackgroundJoyLight/>;
                }
            })()}
        </AppWrapper>
    );
}
