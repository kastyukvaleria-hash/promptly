// src/pages/TestPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import testService from '../api/testService.js';
import progressService from '../api/progressService.js';
import { useCourseData } from '../context/CourseContext.jsx';
import LivesIndicator from '../components/common/LivesIndicator.jsx';
import Confetti from 'react-confetti-boom';
import { IoCheckmarkCircle, IoHeartDislikeOutline, IoArrowBack } from 'react-icons/io5';
import styles from './TestPage.module.css';

const animation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: 'easeInOut' },
};

const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // из LecturePage: { lectureId, sectionId }
  // из SectionPage (финальный тест раздела): { sectionId, orderIndex }
  const { lectureId, sectionId, orderIndex } = location.state || {};
  const { reloadCourseData } = useCourseData();

  const [testData, setTestData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTest = async () => {
      setIsLoading(true);
      try {
        const data = await testService.getTest(testId);
        setTestData(data);
      } catch {
        setError('Не удалось загрузить тест.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length !== testData?.questions.length) {
      alert('Пожалуйста, ответьте на все вопросы.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const testResult = await testService.submitTest(testId, selectedAnswers);
      setResult(testResult);
      await reloadCourseData(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Произошла ошибка при отправке теста.');
      await reloadCourseData(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async () => {
    // 1) Тест лекции
    if (result?.passed && lectureId && sectionId) {
      try {
        await progressService.completeLecture(lectureId, sectionId);
      } catch {}
      await reloadCourseData(true);
      return navigate(`/section/${sectionId}`);
    }

    // 2) Финальный тест раздела
    if (result?.passed && !lectureId && sectionId && orderIndex) {
      try {
        await progressService.completeSection(orderIndex, sectionId);
      } catch {}
      await reloadCourseData(true);
      return navigate('/'); // ← ТОЛЬКО НА ГЛАВНУЮ
    }

    // 3) Если не сдан/нет данных
    await reloadCourseData();
    if (sectionId) return navigate(`/section/${sectionId}`);
    return navigate('/');
  };

  const handleGoBack = () => {
    if (sectionId) return navigate(`/section/${sectionId}`);
    navigate(-1);
  };

  return (
    <motion.div
      variants={animation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={animation.transition}
      className={styles.container}
    >
      {!result ? (
        <>
          <header className={styles.header}>
            <h1 className={styles.title}>{testData?.title}</h1>
            <LivesIndicator />
          </header>

          <div className={styles.questionsList}>
            {testData?.questions?.map((q, index) => (
              <div key={q.questionId} className={styles.questionBlock}>
                <p className={styles.questionText}>{index + 1}. {q.questionText}</p>
                <div className={styles.answersList}>
                  {q.answers.map(a => (
                    <button
                      key={a.answerId}
                      className={`${styles.answerButton} ${selectedAnswers[q.questionId] === a.answerId ? styles.selected : ''}`}
                      onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.questionId]: a.answerId }))}
                    >
                      {a.answerText}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            className="primaryButton"
            style={{ marginTop: 'auto' }}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Проверка...' : 'Ответить'}
          </button>
        </>
      ) : (
        <div className={styles.resultContainer}>
          {result.passed && (
            <Confetti
              mode="boom"
              particleCount={220}
              colors={['#935EFF']} // фиолетовое конфетти
              animationDuration={2800}
            />
          )}
          <div className={styles.resultBlock}>
            {result.passed ? ( <IoCheckmarkCircle size={80} className={styles.iconSuccess} /> ) : ( <IoHeartDislikeOutline size={80} className={styles.iconFail} /> )}
            <h2 className={styles.resultTitle}>{result.passed ? 'Тест пройден!' : 'Упс... Ошибка!'}</h2>
            <p className={styles.resultMessage}>{result.message}</p>
            <p className={styles.resultStats}>Правильных ответов: {result.correctAnswers} из {result.totalQuestions}</p>
            {error && <p className={styles.error}>{error}</p>}

            {result.passed ? (
              <button className="primaryButton" onClick={handleFinish}>
                Продолжить
              </button>
            ) : (
              <button className={styles.backButton} onClick={handleGoBack}>
                <IoArrowBack /> Вернуться
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TestPage;
