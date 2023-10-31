import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import {DeviceThemeProvider, SSRProvider} from "@salutejs/plasma-ui";

ReactDOM.render(
    <DeviceThemeProvider responsiveTypo>
        <SSRProvider>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </SSRProvider>
    </DeviceThemeProvider>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
