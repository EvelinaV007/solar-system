import React, { useEffect } from "react";
import "../styles/Launch.css";

export default function Launch({ onNext }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onNext) onNext();
        }, 4200);

        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <div className="space-launch">
            {Array.from({ length: 14 }).map((_, index) => (
                <span key={index} className={`speed-line speed-line-${index + 1}`}></span>
            ))}

            <div className="solo-rocket-wrap">
                <div className="solo-rocket">
                    <div className="solo-rocket-nose"></div>
                    <div className="solo-rocket-body"></div>
                    <div className="solo-rocket-window"></div>
                    <div className="solo-rocket-fin solo-rocket-fin-left"></div>
                    <div className="solo-rocket-fin solo-rocket-fin-right"></div>
                    <div className="solo-rocket-nozzle"></div>
                </div>
                <div className="solo-fire">
                    <span></span>
                </div>
            </div>
        </div>
    );
}
