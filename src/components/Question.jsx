import React from "react";
import { useState } from "react";
import { decode } from "html-entities";

const Question = (props) => {
  const { question, answers, onSelectAnswer, selectedAnswer } = props;

  return (
    <div className="">
      <div>
        <p>{decode(question)}</p>
        <div className="flex flex-col gap-2">
          {answers.map((answer, index) => (
            <button
              key={index}
              className={`border p-2 rounded-md hover:shadow-md cursor-pointer ${
                selectedAnswer === answer
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100"
              }`}
              onClick={() => onSelectAnswer(answer)}
            >
              {decode(answer)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Question;
