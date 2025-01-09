import React, { useEffect, useState, useCallback } from "react";
import Question from "../components/Question";
import { Puff } from "react-loader-spinner";

const Main = ({ questionsData, handleRestart }) => {
  const { amount, categoryId, difficulty } = questionsData;
  const [questions, setQuestions] = useState([]);
  const [queNo, setQueNo] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`,
        );
        if (!response.ok) throw new Error("Failed to fetch questions");

        const data = await response.json();
        const questions = data.results;

        if (questions.length === 0) throw new Error("No Questions Found");

        setQuestions(questions);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [amount, categoryId, difficulty]);

  useEffect(() => {
    if (questions && questions.length > 0 && queNo < questions.length) {
      setAnswers(
        [
          questions[queNo].correct_answer,
          ...questions[queNo].incorrect_answers,
        ].sort(() => Math.random() - 0.5),
      );
    }
  }, [queNo, questions]);

  const handleNext = () => {
    if (questions[queNo] && selectedAns === questions[queNo].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
    console.log(score);
    setSelectedAns(null);
    setQueNo((queNo) => queNo + 1);
  };

  const restart = useCallback(() => {
    setQueNo(0);
    setScore(0);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleRestart();
    }, 500);
  }, []);

  if (loading) {
    return (
      <Puff
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    );
  }

  // Guard for when queNo exceeds the number of questions
  if (isFinished) {
    return (
      <div className="flex flex-col items-center">
        <p>You've completed all the questions!</p>
        <p>Your final Score is {score + "/" + questions.length}</p>
        <button
          className="w-fit text-lg py-2 border rounded-md px-5 hover:shadow-md bg-teal-600 hover:shadow-lg cursor-pointer active:bg-teal-700 "
          onClick={restart}
        >
          Play Again?
        </button>
      </div>
    );
  }

  return (
    <>
      {
        <div className="flex flex-col gap-3 items-center justify-center w-3/5">
          <p>Total : {score}</p>
          <Question
            question={questions[queNo].question}
            correct_answer={questions[queNo].correct_answer}
            answers={answers}
            onSelectAnswer={(ans) => setSelectedAns(ans)}
            selectedAnswer={selectedAns}
          />
          {queNo < questions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!selectedAns}
              className={`cursor-pointer w-fit px-4 py-2 hover:shadow-md rounded-md ${selectedAns ? "bg-teal-600 hover:bg-teal-700 hover:text-white " : "bg-gray-100"}`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => setIsFinished(true)}
              className={`cursor-pointer w-fit px-4 py-2 hover:shadow-md rounded-md ${selectedAns ? "bg-teal-600 hover:bg-teal-700 hover:text-white " : "bg-gray-100"}`}
            >
              Submit
            </button>
          )}
        </div>
      }
    </>
  );
};

export default Main;
