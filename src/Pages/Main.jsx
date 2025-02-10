import React, { useEffect, useState, useCallback } from "react";
import Question from "../components/Question";
import { Puff } from "react-loader-spinner";

const Main = ({ questionsData, handleRestart }) => {
  const { amount, categoryId, difficulty } = questionsData;
  const [questions, setQuestions] = useState(() => {
    const storedQuestions = localStorage.getItem("questions");
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  });
  const [queNo, setQueNo] = useState(() => {
    const queNo = localStorage.getItem("queNo");
    return queNo ? Number(queNo) : 0;
  });
  const [selectedAns, setSelectedAns] = useState(null);
  const [score, setScore] = useState(() => {
    const storedScore = localStorage.getItem("score");
    return storedScore ? Number(storedScore) : 0;
  });
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(() => {
    const finished = localStorage.getItem("gameOver");
    return finished ? JSON.parse(finished) : false;
  });
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (questions.length === 0) {
      const fetchQuestions = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay API call
          console.log("fetching questions");
          const response = await fetch(
            `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`,
          );
          if (!response.ok) throw new Error("Failed to fetch questions");

          const data = await response.json();
          const questions = data.results;

          if (questions.length === 0) throw new Error("No Questions Found");
          console.log(questions);
          setQuestions(questions);
          localStorage.setItem("questions", JSON.stringify(questions));
        } catch (err) {
          console.log(err.message);
        } finally {
          setLoading(false);
        }
      };
      if (questions.length === 0) fetchQuestions();
    } else return;
  }, [amount, categoryId, difficulty]);

  useEffect(() => {
    const storedQuestions = localStorage.getItem("questions");
    if (storedQuestions) {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    localStorage.setItem("queNo", queNo);
  }, [queNo]);
  useEffect(() => {
    localStorage.setItem("score", score);
  }, [score]);

  useEffect(() => {
    localStorage.setItem("gameOver", isFinished);
  }, [isFinished]);

  useEffect(() => {
    const clearStorageOnClose = () => {
      localStorage.clear();
    };
    window.addEventListener("beforeunload", clearStorageOnClose);
    return () => {
      window.removeEventListener("beforeunload", clearStorageOnClose);
    };
  }, []);

  const handleNext = () => {
    if (questions[queNo] && selectedAns === questions[queNo].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
    console.log(score);
    setSelectedAns(null);
    if (queNo < questions.length - 1) setQueNo((queNo) => queNo + 1);
  };

  const handleFinishing = () => {
    setIsFinished(true);
  };
  const restart = useCallback(() => {
    setQueNo(0);
    setScore(0);
    localStorage.clear();
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
        color="#047857"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    );
  }

  // Guard for when queNo exceeds the number of questions
  if (isFinished) {
    return (
      <div className="flex flex-col gap-2 items-center font-serif">
        <p className="text-lg">
          Your Final Score is {score + "/" + questions.length}
        </p>

        <button
          className="w-fit text-lg py-2 border rounded-md px-5 bg-emerald-700 text-white hover:shadow-lg cursor-pointer active:bg-white active:text-emerald-700 "
          onClick={restart}
        >
          Play Again?
        </button>
      </div>
    );
  }

  return (
    <>
      {!isFinished && (
        <div className="flex flex-col gap-3 items-center justify-center w-3/5 font-serif">
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
              className={`cursor-pointer w-fit px-4 py-2 hover:shadow-md rounded-md ${selectedAns ? "bg-emerald-700 text-white " : "bg-gray-100"}`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => {
                handleNext(), handleFinishing();
              }}
              className={`cursor-pointer w-fit px-4 py-2 hover:shadow-md rounded-md ${selectedAns ? "bg-emerald-700 text-white" : "bg-gray-100"}`}
            >
              Submit
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Main;
