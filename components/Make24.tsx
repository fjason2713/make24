import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useMake24 } from '../hooks/useMake24';
import styles from './Make24.module.scss';
import NumberCard from './NumberCard/NumberCard';

interface IMake24Props {}

const Make24: React.FunctionComponent<IMake24Props> = (props) => {
  // game settings
  const defaultCardCount = 4;
  const defaultTargetNum = 24;
  const timeAllow = 30;

  const [cardCount, setcardCount] = useState(defaultCardCount);
  const [displayTargetNum, setDisplayTargetNum] = useState(defaultTargetNum);

  const [secondsRemain, setSecondsRemain] = useState(timeAllow);
  const [showSolution, toggleShowSolution] = useState(false);
  const [ansStyle, setAnsStyle] = useState({});
  const [ansCount, setAnsCount] = useState(0);
  const [displayTargetStyle, setDisplayTargetStyle] = useState({});

  const { questionNums, solution, toggleOrder, generateNextQuestion, setTargetNum } = useMake24();

  const timer = useRef<number>();
  const debounceTimer = useRef<number>();

  useEffect(() => {
    timer.current = window.setInterval(() => {
      setSecondsRemain((second) => second - 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (secondsRemain < 10) {
      setAnsStyle({ color: 'red' });
    }
    if (secondsRemain < 1) {
      clearInterval(timer.current);
    }
  }, [secondsRemain]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    setDisplayTargetStyle({ borderColor: 'red' });
    debounceTimer.current = window.setTimeout(() => {
      setTargetNum(displayTargetNum);
      if (ansCount > 0) {
        handleGotoNextQuestion(cardCount);
      }
      setAnsCount(ansCount + 1);
      setDisplayTargetStyle({});
    }, 1000);
  }, [displayTargetNum]);

  const handleGotoNextQuestion = (newCount: number) => {
    generateNextQuestion(newCount);
    toggleShowSolution(false);

    setcardCount(newCount);
    setAnsCount(ansCount + 1);

    // reset the timer
    setSecondsRemain(timeAllow);
    setAnsStyle({});
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setInterval(() => {
      setSecondsRemain((second) => second - 1);
    }, 1000);
  };

  const handleTargetChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setDisplayTargetNum(0);
      return;
    }
    const value = parseInt(e.target.value);
    if (isNaN(value) || value > 99) {
      return;
    }
    setDisplayTargetNum(value);
  };
  return (
    <div className={styles.make24}>
      <h1>
        Make <input style={displayTargetStyle} value={displayTargetNum} onChange={handleTargetChange} />!
      </h1>
      <div className={styles.numberCards}>
        {questionNums.map((numStr, index) => (
          <NumberCard key={index}>{numStr}</NumberCard>
        ))}
        <p className={styles.arrow}>
          {'=>'} {displayTargetNum}?
        </p>
      </div>

      <div className={styles.solutions}>
        {showSolution ? (
          <p style={{ color: 'lightcoral' }}>{solution}</p>
        ) : secondsRemain > 0 ? (
          <p style={ansStyle}>Answer in {secondsRemain}</p>
        ) : (
          <p style={ansStyle}>Time up!</p>
        )}
      </div>

      <div className={styles.buttons}>
        <button className={styles.toggle} onClick={toggleOrder}>
          Some shuffling might help
        </button>
        <button
          style={secondsRemain > 25 ? { opacity: 0.5, pointerEvents: 'none' } : { opacity: 1 }}
          className={styles.showSolution}
          onClick={() => toggleShowSolution(!showSolution)}
        >
          Show me the answer
        </button>
        <button
          className={styles.nextQuestion}
          onClick={() => {
            handleGotoNextQuestion(cardCount);
          }}
        >
          Next one
        </button>
      </div>

      <p>Wanna spice up the game?</p>
      <div className={styles.buttons}>
        <button
          style={{ width: 50, opacity: cardCount > 2 ? 1 : 0.2 }}
          onClick={() => {
            if (cardCount > 2) {
              handleGotoNextQuestion(cardCount - 1);
            }
          }}
        >
          -
        </button>
        <p>{cardCount}</p>
        <button
          style={{ width: 50, opacity: cardCount < 8 ? 1 : 0.2 }}
          onClick={() => {
            if (cardCount < 8) {
              handleGotoNextQuestion(cardCount + 1);
            }
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Make24;
