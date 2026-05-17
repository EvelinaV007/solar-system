// StartScreen.jsx
import React from "react";
import "../styles/StartScreen.css";

export default function StartScreen({ onNext }) {
    return (
        <div className="stars" onClick={onNext}>
            <h1>
                <em>C</em>
                <em className="planet left">O</em>
                <em>S</em>
                <em>M</em>
                <em className="planet right">O</em>
                <em>S</em>
            </h1>

            <p className="tip">натисни, щоб почати</p>
        </div>
    );
}