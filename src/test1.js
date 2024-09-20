import React, { useEffect, useState } from 'react';
import api from "./axioshelper"
import TypingEffect from 'react-typing-effect';
import { useNavigate, useLocation } from 'react-router-dom';

import image1 from "./assets/image8.jpeg";
import image2 from "./assets/image9.jpeg";
import image3 from "./assets/image10.jpeg";
import image4 from "./assets/image11.webp";
import image5 from "./assets/image12.jpeg";
import image6 from "./assets/image13.jpeg";
import image7 from "./assets/image14.jpeg";
import image8 from "./assets/backround4.jpg";

import './BackgroundSlider.css';

const Test1 = () => {
  const images = [image1, image2, image3, image4, image5, image6, image7, image8];

  const [currentImage, setCurrentImage] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [answerTime, setAnswerTime] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const myData = location.state?.myData;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('http://localhost:8081/api/questions/for-module-1');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();

    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestion]);

  const handleNextQuestion = () => {
    setCurrentQuestion((prevQuestion) => (prevQuestion + 1) % questions.length);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setIsCorrect(null);
    setIsAnswered(false);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleAnswerSubmit = async () => {
    if (startTime !== null && selectedAnswer !== null) {
      const currentTime = Date.now();
      const timeTaken = Math.round((currentTime - startTime) / 1000);
      setAnswerTime((prevTimes) => [...prevTimes, timeTaken]);
      setStartTime(Date.now());

      const answerData = {
        questionId: questions[currentQuestion]?.id,
        time: timeTaken,
        answer: selectedAnswer,
        userID: localStorage.getItem("userId"),
      };

      try {
        await api.post('http://localhost:8081/api/answers', answerData);
        console.log(`Answer for question ${currentQuestion + 1} submitted successfully`);
      } catch (error) {
        console.error('Error submitting answer:', error);
      }

      setIsAnswered(true);

      if (selectedAnswer === questions[currentQuestion].correct_answer) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
      setCorrectAnswer(questions[currentQuestion].correct_answer);
    }
  };

  return (
    <div className='btns'>
      <div className='title2'>
        <div className='parent-container'>
          <h2>1ο τέστ αξιολόγησης</h2>
        </div>
      </div>
      <div>
        <div
          className="background-slider"
          style={{ backgroundImage: `url(${images[currentImage]})` }}
        >
          <div className="content">
            {questions.length > 0 && (
              <>
                <TypingEffect
                  key={questions[currentQuestion]?.id}
                  text={[questions[currentQuestion]?.question || '']}
                  speed={70}
                  eraseSpeed={0}
                  eraseDelay={100000}
                  typingDelay={500}
                />
              </>
            )}
            <div className="answers">
              {['option1', 'option2', 'option3', 'option4'].map((option, index) => (
                questions[currentQuestion]?.[option] && (
                  <div key={index}>
                    {isAnswered && (
                      <div
                        style={{
                          backgroundColor:
                            selectedAnswer === questions[currentQuestion][option]
                              ? isCorrect
                                ? 'green'
                                : 'red'
                              : correctAnswer === questions[currentQuestion][option]
                              ? 'green'
                              : 'transparent',
                        }}
                      >
                        <input
                          type="radio"
                          id={`answer-${questions[currentQuestion].id}-${index}`}
                          name={`answer-${questions[currentQuestion].id}`}
                          value={questions[currentQuestion][option]}
                          checked={selectedAnswer === questions[currentQuestion][option]}
                          onChange={() => handleAnswerSelect(questions[currentQuestion][option])}
                          disabled={selectedAnswer !== null}
                        />
                        <label htmlFor={`answer-${questions[currentQuestion].id}-${index}`}>
                          {questions[currentQuestion][option]}
                        </label>
                      </div>
                    )}
                    {!isAnswered && (
                      <div key={index}>
                        <input
                          type="radio"
                          id={`answer-${questions[currentQuestion].id}-${index}`}
                          name={`answer-${questions[currentQuestion].id}`}
                          value={questions[currentQuestion][option]}
                          checked={selectedAnswer === questions[currentQuestion][option]}
                          onChange={() => handleAnswerSelect(questions[currentQuestion][option])}
                        />
                        <label htmlFor={`answer-${questions[currentQuestion].id}-${index}`}>
                          {questions[currentQuestion][option]}
                        </label>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedAnswer !== null && currentQuestion < questions.length - 1 && isAnswered && (
        <button className='rightButton' onClick={handleNextQuestion}>Επόμενο <br /> &#8594;</button>
      )}
      <div className='submitBtnContainer'>
        <button onClick={handleAnswerSubmit}>Υποβολή</button>
      </div>
      {selectedAnswer !== null && currentQuestion === questions.length - 1 && (
        <button className='rightButton' onClick={() => navigate('/theory-part-2', { state: { myData: myData } })}>Επόμενη ενότητα <br /> &#8594;</button>
      )}
    </div>
  );
};

export default Test1;
