import React from "react";
import '../App.css'
import {decode} from 'html-entities';

export default function Question(props) {

    return (
        <div className="que-div">
            <h2>{decode(props.items.question)}</h2>
            <ul
                className="choice-list"
            >
                <li onClick={() => props.holdChoice(props.items.firstChoice.id)}
                    className={`${props.items.firstChoice.isHeld ? 'is-Clicked' : 'not-Clicked'} ${'list-item'}` } >
                    {decode(props.items.firstChoice.value)}
                </li>
                <li onClick={() => props.holdChoice(props.items.secondChoice.id)}
                    className={` ${props.items.secondChoice.isHeld ? 'is-Clicked' : 'not-Clicked'} ${'list-item'}`}  >
                    {decode(props.items.secondChoice.value)}
                </li>
                <li onClick={() => props.holdChoice(props.items.thirdChoice.id)}
                    className={`${props.items.thirdChoice.isHeld ? 'is-Clicked' : 'not-Clicked'} ${'list-item'}`}>
                    {decode(props.items.thirdChoice.value)}
                </li>
                <li onClick={() => props.holdChoice(props.items.fourthChoice.id)}
                    className={` ${props.items.fourthChoice.isHeld ? 'is-Clicked' : 'not-Clicked'} ${'list-item'}`}>
                    {decode(props.items.fourthChoice.value)}
                </li>

            </ul>
        </div>
    )
}