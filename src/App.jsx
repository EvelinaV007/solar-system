import React, { useState } from "react";
import StartScreen from "./components/StartScreen";
import Meadow from "./components/Meadow";
import Launch from "./components/Launch";
import SolarSystem from "./components/SolarSystem";
export default function App() {
    const [stage, setStage] = useState("start");
    switch (stage) {
        case "start":
            return <StartScreen onNext={() => setStage("meadow")} />;
        case "meadow":
            return <Meadow onNext={() => setStage("launch")} />;
        case "launch":
            return <Launch onNext={() => setStage("solarsystem")} />;
        case "solarsystem":
            return <SolarSystem />;
        default:
            return null;
    }
}