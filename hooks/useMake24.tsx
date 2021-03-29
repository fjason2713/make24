import { useEffect, useState } from 'react';

export const useMake24 = () => {
  const [questionNums, setQuestionNums] = useState([] as string[]);
  const [solution, setSolution] = useState('');
  const [targetNum, setTargetNum] = useState(24);

  useEffect(() => {
    generateNextQuestion();
  }, []);

  useEffect(() => {
    const answer = solve24(questionNums);
    setSolution(answer);
  }, [questionNums]);

  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const toggleOrder = () => {
    setQuestionNums([...shuffleArray(questionNums)]);
  };

  // helper [start]
  const toString = (num: number) => {
    if (num === 11) {
      return 'J';
    } else if (num === 12) {
      return 'Q';
    } else if (num === 13) {
      return 'K';
    }
    return `${num}`;
  };
  const toNumber = (numberStr: string) => {
    let number = parseInt(numberStr);
    if (isNaN(number)) {
      switch (numberStr) {
        case 'J':
          return 11;
        case 'Q':
          return 12;
        case 'K':
          return 13;
        default:
          console.error('cannot parse number str:', numberStr);
          return 0;
      }
    }
    return number;
  };
  // helper [end]

  const generateNextQuestion = (cardCount: number = 4) => {
    let randomNumArray = Array.from({ length: cardCount }, () => Math.floor(Math.random() * 13) + 1);
    let question = randomNumArray.map(toString);
    let answer = solve24(question);

    while (answer === '') {
      randomNumArray = Array.from({ length: cardCount }, () => Math.floor(Math.random() * 13) + 1);
      question = randomNumArray.map(toString);
      answer = solve24(question);
    }
    setQuestionNums(question);
    setSolution(answer);
  };

  /* Algorithm [start] */
  const solveNumbersToTarget = (numbers: number[], target: number): string => {
    // base case: 2 numbers
    if (numbers.length === 2) {
      const num1 = numbers[0];
      const num2 = numbers[1];

      const card1 = toString(num1);
      const card2 = toString(num2);

      // (+)
      if (num1 + num2 === target) {
        return `( ${card1} + ${card2} )`;
      }

      // (-)
      if (Math.abs(num1 - num2) === target) {
        return `( ${toString(Math.max(num1, num2))} - ${toString(Math.min(num1, num2))} )`;
      }

      // (*)
      if (num1 * num2 === target) {
        return `( ${card1} * ${card2} )`;
      }

      // (/)
      if (num1 / num2 === target) {
        return `( ${card1} / ${card2} )`;
      }

      return ''; // no solution
    }

    // main case
    for (let i = 0; i < numbers.length; i++) {
      const remaining = numbers.filter((_, index) => index !== i);
      const number = numbers[i];

      const addAttempt = solveNumbersToTarget(remaining, target - number);
      const minusAttempt = solveNumbersToTarget(remaining, target + number);
      const multiplyAttempt = solveNumbersToTarget(remaining, target / number);
      const divideAttempt = solveNumbersToTarget(remaining, target * number);

      if (addAttempt !== '') {
        return `( ${toString(number)} + ` + addAttempt + ' )';
      } else if (minusAttempt !== '') {
        return '( ' + minusAttempt + ` - ${toString(number)} )`;
      } else if (multiplyAttempt !== '') {
        return `( ${toString(number)} * ` + multiplyAttempt + ' )';
      } else if (divideAttempt !== '') {
        return `( ${divideAttempt} / ` + toString(number) + ' )';
      }
    }
    return '';
  };

  const solve24 = (numberStrs: string[]) => {
    const numbers = numberStrs.map(toNumber);
    const answer = solveNumbersToTarget(numbers, targetNum);
    // console.log('answer:', answer);
    return answer;
  };
  /* Algorithm [end] */

  return { questionNums, solution, toggleOrder, generateNextQuestion, setTargetNum };
};
