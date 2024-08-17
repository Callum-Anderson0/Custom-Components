import React from "react";
import Card from "./Card";

export default function({Cards , DisplayedAtOnce}){
    return (
        <div className="flex bg-gray-300">
            <button className="p-5 ">A</button>
            <div className ="flex overflow-hidden overflow-x-scroll">
                {Array.from({length: Cards}).map((_,index) =>(
                    <Card></Card>
                ))}
            </div>
            <button className="p-5">B</button>
        </div>
    )
}