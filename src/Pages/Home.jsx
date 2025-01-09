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
    <div className="flex flex-col gap-2 justify-center items-center w-1/2 h-4/5 border border-teal-800 rounded-xl">
      {!isStarted ? (
        <div className="flex flex-col gap-3 items-center justify-center">
          <h1 className="text-2xl">Let's start the game!!</h1>
          <button
            className="w-fit text-lg py-2 border rounded-md px-5 hover:shadow-md bg-teal-600 hover:shadow-lg cursor-pointer active:bg-teal-700 "
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
          color="#4fa94d"
          ariaLabel="puff-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      )}
    </div>
  );
};

export default Home;
