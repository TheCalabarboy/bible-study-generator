import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  difficulties as difficultyMeta,
  quizQuestionBank,
  QUESTIONS_PER_LEVEL,
} from '../data/quizQuestions';
import { buildScriptureUrl } from '../utils/linkScriptureReferences';

const LEVELS = Array.from({ length: 10 }, (_, index) => index + 1);

function shuffle(array) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export default function Quiz() {
  const [difficulty, setDifficulty] = useState('easy');
  const [level, setLevel] = useState(1);
  const [sessionSeed, setSessionSeed] = useState(0);

  const [questions, setQuestions] = useState(() => quizQuestionBank.easy || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [showResults, setShowResults] = useState(false);

  const difficultyInfo = useMemo(
    () => difficultyMeta.find((item) => item.key === difficulty) || difficultyMeta[0],
    [difficulty],
  );

  const generateQuestions = useCallback(() => {
    const pool = quizQuestionBank[difficulty] || [];
    if (pool.length === 0) return [];
    const randomised = shuffle(pool);
    return randomised.slice(0, QUESTIONS_PER_LEVEL);
  }, [difficulty, sessionSeed, level]);

  useEffect(() => {
    const nextQuestions = generateQuestions();
    setQuestions(nextQuestions);
    setCurrentIndex(0);
    setSelectedOption('');
    setIsAnswerRevealed(false);
    setScore(0);
    setFeedback('');
    setShowResults(false);
    setAnswers(Array(nextQuestions.length).fill(null));
  }, [generateQuestions]);

  const currentQuestion = questions[currentIndex];
  const progressPercentage = questions.length
    ? Math.round(((currentIndex + (isAnswerRevealed ? 1 : 0)) / questions.length) * 100)
    : 0;

  const handleDifficultyChange = (nextDifficulty) => {
    if (difficulty === nextDifficulty) return;
    setDifficulty(nextDifficulty);
    setLevel(1);
    setSessionSeed((prev) => prev + 1);
  };

  const handleLevelSelect = (nextLevel) => {
    if (level === nextLevel) {
      setSessionSeed((prev) => prev + 1); // refresh questions for the same level
      return;
    }
    setLevel(nextLevel);
    setSessionSeed((prev) => prev + 1);
  };

  const handleOptionSelect = (option) => {
    if (isAnswerRevealed) return;
    setSelectedOption(option);
    setFeedback('');
  };

  const handleCheckAnswer = () => {
    if (isAnswerRevealed) return;
    if (!selectedOption) {
      setFeedback('Select an answer before checking.');
      return;
    }
    if (!currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.answer;
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = {
        selected: selectedOption,
        isCorrect,
      };
      return next;
    });
    setScore((prev) => (isCorrect ? prev + 1 : prev));
    setIsAnswerRevealed(true);
    setFeedback(
      isCorrect
        ? 'Correct! Keep going.'
        : `Not quite. The correct answer is “${currentQuestion.answer}”.`,
    );
  };

  const handleNextQuestion = () => {
    if (!isAnswerRevealed) {
      setFeedback('Check your answer before moving on.');
      return;
    }
    if (currentIndex + 1 >= questions.length) {
      setShowResults(true);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption('');
    setIsAnswerRevealed(false);
    setFeedback('');
  };

  const handleRestartLevel = () => {
    setSessionSeed((prev) => prev + 1);
  };

  const handleAdvanceLevel = () => {
    if (level < LEVELS.length) {
      setLevel((prev) => prev + 1);
      setSessionSeed((prev) => prev + 1);
    } else {
      setFeedback('You have completed all levels for this difficulty! Consider changing difficulty.');
      setShowResults(false);
      setCurrentIndex(0);
      setSelectedOption('');
      setIsAnswerRevealed(false);
    }
  };

  const handleChangeDifficultyFromResults = () => {
    const nextIndex = (difficultyMeta.findIndex((item) => item.key === difficulty) + 1)
      % difficultyMeta.length;
    const nextDifficulty = difficultyMeta[nextIndex].key;
    setDifficulty(nextDifficulty);
    setLevel(1);
    setSessionSeed((prev) => prev + 1);
  };

  const openScriptureReference = (reference) => {
    if (!reference) return;
    const url = buildScriptureUrl(reference);
    window.open(url, 'scriptureReference', 'width=600,height=700,noopener');
  };

  const correctCount = score;
  const accuracy = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <header style={{ marginBottom: 32, textAlign: 'center' }}>
          <p style={{ color: '#6366f1', fontWeight: 600, letterSpacing: 2, marginBottom: 8 }}>
            SERMONDIVE QUIZ LAB
          </p>
          <h1 style={{ fontSize: 42, color: '#1f2937', marginBottom: 12 }}>Bible Knowledge Challenge</h1>
          <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.7 }}>
            Choose a difficulty, advance through ten levels, and tackle twenty fresh questions per
            level. Your mission: test and stretch your understanding of Scripture.
          </p>
        </header>

        <section
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 32,
            boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginBottom: 12 }}>
                Choose Difficulty
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: 12,
                }}
              >
                {difficultyMeta.map((item) => {
                  const isActive = difficulty === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => handleDifficultyChange(item.key)}
                      style={{
                        borderRadius: 14,
                        border: '2px solid',
                        borderColor: isActive ? '#6366f1' : 'rgba(99,102,241,0.2)',
                        background: isActive ? '#eef2ff' : 'white',
                        padding: '16px 20px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        boxShadow: isActive ? '0 10px 25px rgba(99,102,241,0.15)' : 'none',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(event) => {
                        event.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#4338ca' }}>
                        {item.label}
                      </div>
                      <p style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#64748b', marginBottom: 12 }}>
                Select Level
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                  gap: 10,
                }}
              >
                {LEVELS.map((lvl) => {
                  const isActive = lvl === level;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleLevelSelect(lvl)}
                      style={{
                        padding: '12px 0',
                        borderRadius: 12,
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        background: isActive
                          ? 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)'
                          : '#e2e8f0',
                        color: isActive ? 'white' : '#1e293b',
                        boxShadow: isActive ? '0 10px 20px rgba(99,102,241,0.25)' : 'none',
                        transition: 'transform 0.2s ease',
                      }}
                      onMouseEnter={(event) => {
                        if (!isActive) event.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Level {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                padding: '18px 20px',
                background: '#f8fafc',
                borderRadius: 12,
                border: '1px solid rgba(148, 163, 184, 0.25)',
                fontSize: 14,
                color: '#475569',
              }}
            >
              <strong style={{ color: '#4338ca' }}>{difficultyInfo.label}</strong>
              {`: ${difficultyInfo.description}`}
            </div>
          </div>
        </section>

        {showResults ? (
          <section
            style={{
              background: 'white',
              borderRadius: 20,
              padding: 36,
              boxShadow: '0 20px 45px rgba(15,23,42,0.1)',
            }}
          >
            <h2 style={{ fontSize: 32, color: '#1f2937', marginBottom: 12 }}>
              Level {level} Complete!
            </h2>
            <p style={{ color: '#475569', marginBottom: 24, fontSize: 16 }}>
              You answered{' '}
              <strong style={{ color: '#4338ca' }}>
                {correctCount} / {questions.length}
              </strong>{' '}
              questions correctly ({accuracy}% accuracy).
            </p>

            <div
              style={{
                borderRadius: 16,
                padding: 20,
                background: '#f1f5f9',
                border: '1px solid rgba(148,163,184,0.25)',
                marginBottom: 24,
              }}
            >
              <p style={{ fontSize: 15, color: '#475569', marginBottom: 8 }}>
                Keep sharpening your memory—Scripture knowledge grows with repetition.
              </p>
              <ul style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>
                <li>Review any incorrect answers before advancing.</li>
                <li>Replay the level for a fresh set of randomly selected questions.</li>
                <li>Try the next level to keep the challenge moving.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button
                type="button"
                onClick={handleRestartLevel}
                style={{
                  padding: '12px 22px',
                  borderRadius: 999,
                  border: 'none',
                  background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 12px 30px rgba(99,102,241,0.25)',
                }}
              >
                Replay Level
              </button>

              <button
                type="button"
                onClick={handleAdvanceLevel}
                style={{
                  padding: '12px 22px',
                  borderRadius: 999,
                  border: 'none',
                  background: '#e2e8f0',
                  color: '#1e293b',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Next Level
              </button>

              <button
                type="button"
                onClick={handleChangeDifficultyFromResults}
                style={{
                  padding: '12px 22px',
                  borderRadius: 999,
                  border: 'none',
                  background: '#fef3c7',
                  color: '#92400e',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Switch Difficulty
              </button>
            </div>
          </section>
        ) : (
          <section
            style={{
              background: 'white',
              borderRadius: 20,
              padding: 32,
              boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 14, color: '#475569', fontWeight: 600 }}>
                  Level {level} · Question {currentIndex + 1} of {questions.length || 20}
                </span>
                <span style={{ fontSize: 14, color: '#4338ca', fontWeight: 600 }}>
                  Score: {score}
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: '#e2e8f0',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progressPercentage}%`,
                    background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>

            {currentQuestion ? (
              <>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 24, color: '#1f2937', marginBottom: 12 }}>
                    {currentQuestion.question}
                  </h2>
                </div>

                <div style={{ display: 'grid', gap: 14, marginBottom: 24 }}>
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOption === option;
                    const isCorrectAnswer = isAnswerRevealed && option === currentQuestion.answer;
                    const isWrongSelection =
                      isAnswerRevealed && isSelected && option !== currentQuestion.answer;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleOptionSelect(option)}
                        disabled={isAnswerRevealed}
                        style={{
                          padding: '16px 18px',
                          borderRadius: 14,
                          border: '2px solid',
                          borderColor: (() => {
                            if (isCorrectAnswer) return '#22c55e';
                            if (isWrongSelection) return '#ef4444';
                            return isSelected ? '#6366f1' : 'rgba(99,102,241,0.25)';
                          })(),
                          background: (() => {
                            if (isCorrectAnswer) return '#ecfdf5';
                            if (isWrongSelection) return '#fee2e2';
                            return isSelected ? '#eef2ff' : 'white';
                          })(),
                          color: '#1f2937',
                          textAlign: 'left',
                          cursor: isAnswerRevealed ? 'default' : 'pointer',
                          fontSize: 15,
                          fontWeight: 600,
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          boxShadow:
                            isSelected && !isAnswerRevealed
                              ? '0 10px 25px rgba(99,102,241,0.15)'
                              : 'none',
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {(feedback || (isAnswerRevealed && currentQuestion.reference)) && (
                  <div
                    style={{
                      marginBottom: 24,
                      padding: '14px 16px',
                      borderRadius: 12,
                      background: feedback.startsWith('Correct')
                        ? '#ecfdf5'
                        : feedback.startsWith('Not quite')
                          ? '#fee2e2'
                          : '#f8fafc',
                      color: feedback && feedback.startsWith('Correct')
                        ? '#047857'
                        : feedback && feedback.startsWith('Not quite')
                          ? '#b91c1c'
                          : '#475569',
                      border: '1px solid rgba(148,163,184,0.2)',
                      fontSize: 14,
                    }}
                  >
                    {feedback}
                    {isAnswerRevealed && currentQuestion.reference && (
                      <div style={{ marginTop: 8, fontSize: 13, color: '#4338ca', fontWeight: 600 }}>
                        Scripture:{' '}
                        <a
                          href={buildScriptureUrl(currentQuestion.reference)}
                          onClick={(event) => {
                            event.preventDefault();
                            openScriptureReference(currentQuestion.reference);
                          }}
                          style={{
                            color: '#4338ca',
                            textDecoration: 'underline',
                            fontWeight: 600,
                          }}
                        >
                          {currentQuestion.reference}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <button
                    type="button"
                    onClick={handleCheckAnswer}
                    disabled={isAnswerRevealed}
                    style={{
                      padding: '12px 24px',
                      borderRadius: 999,
                      border: 'none',
                      background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                      color: 'white',
                      fontWeight: 600,
                      cursor: isAnswerRevealed ? 'not-allowed' : 'pointer',
                      opacity: isAnswerRevealed ? 0.5 : 1,
                    }}
                  >
                    Check Answer
                  </button>

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    style={{
                      padding: '12px 24px',
                      borderRadius: 999,
                      border: 'none',
                      background: '#e2e8f0',
                      color: '#1f2937',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {currentIndex + 1 >= questions.length ? 'Finish Level' : 'Next Question'}
                  </button>
                </div>
              </>
            ) : (
              <p style={{ color: '#475569' }}>No questions found for this selection.</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
