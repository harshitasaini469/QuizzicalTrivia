import React from "react";
import Question from "./Question";
import { nanoid } from "nanoid";
import { BarLoader } from "react-spinners";
import "../App.css";

export default function Main() {
  const [data, setData] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [displayScore, setDisplayScore] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    show &&
      fetch(
        "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data.results);
          setLoading(false);
        });
  }, [show]);

  const newQuiz = React.useCallback(() => {
    setDisplayScore(false);
    setShow(false);
    setData([]);
    setLoading(true);
  }, []);

  const showQuestions = React.useCallback(() => {
    setShow(true);
  }, []);

  function showScore() {
    setShow(false);
    setDisplayScore(true);
  }

  React.useEffect(() => {
    let getQuestions = data.map((que) => {
      let choices = [...que.incorrect_answers, que.correct_answer].sort(
        () => 0.5 - Math.random()
      );
      return {
        id: nanoid(),
        question: que.question,
        firstChoice: {
          value: choices[0],
          isHeld: false,
          id: nanoid(),
          isRight: false,
          isWrong: false,
        },
        secondChoice: {
          value: choices[1],
          isHeld: false,
          id: nanoid(),
          isRight: false,
          isWrong: false,
        },
        thirdChoice: {
          value: choices[2],
          isHeld: false,
          id: nanoid(),
          isRight: false,
          isWrong: false,
        },
        fourthChoice: {
          value: choices[3],
          isHeld: false,
          id: nanoid(),
          isRight: false,
          isWrong: false,
        },
        correct_answer: que.correct_answer,
      };
    });
    setQuestions(getQuestions);
  }, [data]);

  function HoldChoice(id) {
    setQuestions(
      questions.map((que) => {
        if (que.firstChoice.id === id) {
          let firstChoice = { ...que.firstChoice };
          firstChoice.isHeld = true;
          firstChoice.isRight =
            firstChoice.value === que.correct_answer ? true : false;

          que.secondChoice.isHeld = false;
          que.thirdChoice.isHeld = false;
          que.fourthChoice.isHeld = false;

          return { ...que, firstChoice };
        } else if (que.secondChoice.id === id) {
          let secondChoice = { ...que.secondChoice };
          secondChoice.isHeld = true;
          secondChoice.isRight =
            secondChoice.value === que.correct_answer ? true : false;

          que.firstChoice.isHeld = false;
          que.thirdChoice.isHeld = false;
          que.fourthChoice.isHeld = false;

          return { ...que, secondChoice };
        } else if (que.thirdChoice.id === id) {
          let thirdChoice = { ...que.thirdChoice };
          thirdChoice.isHeld = true;
          thirdChoice.isRight =
            thirdChoice.value === que.correct_answer ? true : false;

          que.firstChoice.isHeld = false;
          que.secondChoice.isHeld = false;
          que.fourthChoice.isHeld = false;

          return { ...que, thirdChoice };
        } else if (que.fourthChoice.id === id) {
          let fourthChoice = { ...que.fourthChoice };
          fourthChoice.isHeld = true;
          fourthChoice.isRight =
            fourthChoice.value === que.correct_answer ? true : false;

          que.firstChoice.isHeld = false;
          que.secondChoice.isHeld = false;
          que.thirdChoice.isHeld = false;

          return { ...que, fourthChoice };
        } else {
          return que;
        }
      })
    );
  }

  function checkAnswers() {
    let correctAns = [];

    questions.forEach((que) =>
      que.firstChoice.isRight && que.firstChoice.isHeld
        ? correctAns.push(que.firstChoice.value)
        : que.secondChoice.isRight && que.secondChoice.isHeld
        ? correctAns.push(que.secondChoice.value)
        : que.thirdChoice.isRight && que.thirdChoice.isHeld
        ? correctAns.push(que.thirdChoice.value)
        : que.fourthChoice.isRight && que.fourthChoice.isHeld
        ? correctAns.push(que.fourthChoice.value)
        : " "
    );

    return correctAns.length;
  }

  let queEle = questions.map((que) => {
    const key = nanoid();
    return <Question items={que} holdChoice={HoldChoice} key={key} id={key} />;
  });

  return (
    <div className="container">
      {!show && !displayScore && (
        <div>
          <h1 className="title">Quizzical</h1>
          <button onClick={showQuestions}>Start Quiz</button>
        </div>
      )}
      {data.length === 0 && show && (
        <BarLoader color="#3498db" loading={loading} height={4} width={150} />
      )}
      {show && data.length !== 0 && (
        <div>
          {queEle}
          {!displayScore && <button onClick={showScore}>Check Score</button>}
        </div>
      )}

      {displayScore && !show && (
        <div className="score-div">
          <p className="score">
            Total score is : {checkAnswers()} / {data.length}
          </p>
          <button onClick={newQuiz}>Play Again</button>{" "}
        </div>
      )}

      <div></div>
    </div>
  );
}
