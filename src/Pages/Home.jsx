import React, { useState } from "react";
import Start from "./Start";
import { Puff } from "react-loader-spinner";
const Home = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [loader, setLoader] = useState(false);
  const EnableLoader = () => {
    setLoader(true);
    setTimeout(() => setLoader(false), 500);
  };
  const reStartQuiz = () => {
    setIsStarted(false);
  };
  return (
    <div className="flex flex-col gap-2 justify-center items-center w-1/2 h-4/5 border-double border-8 border-teal-800 rounded-xl shadow-lg shadow-slate-500 bg-white">
      {!isStarted ? (
        <div className="flex flex-col gap-3 items-center justify-center">
          <h1 className="text-3xl font-mono">Let's start the Quiz!!</h1>
          <button
            className="w-fit text-lg py-2 border rounded-md px-5 bg-emerald-700 text-white hover:shadow-lg cursor-pointer active:bg-white active:text-emerald-700"
            onClick={() => {
              setIsStarted(true), EnableLoader();
            }}
          >
            Start
          </button>
        </div>
      ) : !loader && isStarted ? (
        <Start reStartQuiz={reStartQuiz} />
      ) : (
        <Puff
          visible={true}
          height="80"
          width="80"
          color="#047857"
          ariaLabel="puff-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      )}
    </div>
  );
};

export default Home;
