import React, { useEffect, useState } from "react";
import Main from "./Main";

const Start = ({ reStartQuiz }) => {
  const [begin, setBegin] = useState(false);
  const [questionsData, setQuestionsData] = useState({
    amount: 5,
    categoryId: 0,
    difficulty: "",
  });
  const [categories, seCategories] = useState([]);
  const difficultyLevel = ["easy", "medium", "hard"];

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => {
        seCategories(data.trivia_categories);
      })
      .catch((error) => console.error("Failed to fetch categories:", error));
  }, []);

  const handleRestart = () => {
    setBegin(false);
    reStartQuiz();
  };
  return (
    <>
      {!begin ? (
        <form
          className="flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the page from refreshing
            setBegin(true); // Start the quiz
          }}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="amount">
              How many questions do you want to play?
            </label>
            <input
              id="amount"
              type="number"
              value={questionsData?.amount}
              onChange={(e) =>
                setQuestionsData({ ...questionsData, amount: e.target.value })
              }
              required
              min="1" // Minimum value validation
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category">What category do you want to play?</label>
            <select
              id="category"
              value={questionsData?.categoryId}
              onChange={(e) =>
                setQuestionsData({
                  ...questionsData,
                  categoryId: e.target.value,
                })
              }
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="difficulty">
              What difficulty do you want to play?
            </label>
            <select
              id="difficulty"
              value={questionsData?.difficulty}
              onChange={(e) =>
                setQuestionsData({
                  ...questionsData,
                  difficulty: e.target.value,
                })
              }
              required
            >
              <option value="">Select Difficulty</option>
              {difficultyLevel.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-fit text-lg py-2 border rounded-md px-5 hover:shadow-md bg-teal-600 hover:shadow-lg cursor-pointer active:bg-teal-700"
            // Prevent submission if inputs are empty
          >
            Let's Begin
          </button>
        </form>
      ) : (
        <Main questionsData={questionsData} handleRestart={handleRestart} />
      )}
    </>
  );
};

export default Start;
