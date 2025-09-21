import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '../api/adminService.js';
import styles from './AdminTestPage.module.css';
import { IoTrash, IoAdd, IoRadioButtonOn, IoRadioButtonOff } from 'react-icons/io5';

const AdminTestPage = () => {
  const { lectureId, chapterId, sectionId } = useParams();
  const navigate = useNavigate();

  const { entityType, entityId } = useMemo(() => {
    if (lectureId) return { entityType: 'Лекция', entityId: lectureId };
    if (chapterId) return { entityType: 'Глава', entityId: chapterId };
    if (sectionId) return { entityType: 'Раздел', entityId: sectionId };
    return { entityType: null, entityId: null };
  }, [lectureId, chapterId, sectionId]);

  const [test, setTest] = useState(null);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [passingScore, setPassingScore] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      if (!entityId) {
        setError("Не удалось определить ID сущности (лекции, главы или раздела).");
        setIsLoading(false);
        return;
      }

      setError('');
      setIsLoading(true);
      
      try {
        let data;
        // --- ВОТ ГЛАВНОЕ ИСПРАВЛЕНИЕ: УБИРАЕМ ЗАГЛУШКИ ---
        switch (entityType) {
          case 'Лекция':
            data = await adminService.getTestByLectureId(entityId);
            break;
          case 'Глава':
            data = await adminService.getTestByChapterId(entityId);
            break;
          case 'Раздел':
            data = await adminService.getTestBySectionId(entityId);
            break;
          default:
            throw new Error('Неизвестный тип сущности');
        }

        setTest(data);
        setTitle(data.title || `Тест для "${entityType}"`);
        const sanitizedQuestions = (data.questions || []).map(q => ({
            ...q,
            answers: (q.answers || []).map(a => ({...a, isCorrect: a.isCorrect || false}))
        }));
        setQuestions(sanitizedQuestions.length > 0 ? sanitizedQuestions : [{ questionText: '', answers: [{ answerText: '', isCorrect: true }, { answerText: '', isCorrect: false }] }]);
        setPassingScore(data.passingScore || 1);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setTest(null);
          setTitle(`Тест для "${entityType}"`);
          setQuestions([{ questionText: '', answers: [{ answerText: '', isCorrect: true }, { answerText: '', isCorrect: false }] }]);
          setPassingScore(1);
        } else {
          setError('Не удалось загрузить данные теста. Убедись, что на бэкенде есть нужные GET-ручки.');
          console.error("Ошибка загрузки теста:", err.response || err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTest();
  }, [entityType, entityId]);
  
  useEffect(() => {
    if (questions.length > 0 && passingScore > questions.length) {
      setPassingScore(questions.length);
    } else if (passingScore < 1) {
      setPassingScore(1);
    }
  }, [questions.length, passingScore]);

  const handleQuestionChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].questionText = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex].answerText = value;
    setQuestions(newQuestions);
  };
  
  const handleCorrectAnswerChange = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers.forEach((ans, i) => ans.isCorrect = i === aIndex);
    setQuestions(newQuestions);
  };
  
  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', answers: [{ answerText: '', isCorrect: true }, { answerText: '', isCorrect: false }] }]);
  };

  const addAnswer = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers.push({ answerText: '', isCorrect: false });
    setQuestions(newQuestions);
  };
  
  const removeQuestion = (qIndex) => {
    if (questions.length > 1) {
        setQuestions(questions.filter((_, i) => i !== qIndex));
    } else {
        alert('В тесте должен быть как минимум один вопрос.');
    }
  };

  const removeAnswer = (qIndex, aIndex) => {
    if (questions[qIndex].answers.length > 2) {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, i) => i !== aIndex);
        setQuestions(newQuestions);
    } else {
        alert('В вопросе должно быть как минимум два варианта ответа.');
    }
  };

  const handleSaveTest = async () => {
    setError('');
    setIsSaving(true);
    try {
      const testData = { title, questions, passingScore: Number(passingScore) };
      
      switch (entityType) {
        case 'Лекция':
          await adminService.createOrUpdateTestForLecture(entityId, testData);
          break;
        case 'Глава':
          await adminService.createOrUpdateTestForChapter(entityId, testData);
          break;
        case 'Раздел':
          await adminService.createOrUpdateTestForSection(entityId, testData);
          break;
        default:
          throw new Error('Неизвестный тип сущности для сохранения');
      }
      navigate(-1);
    } catch (err) {
      setError(`Не удалось сохранить тест. Ответ сервера: ${err.response?.data?.message || err.message}`);
      console.error("Ошибка сохранения теста:", err.response || err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTest = async () => {
    setError('');
    if (test && test.id) {
        if (window.confirm('Вы уверены, что хотите удалить этот тест?')) {
            try {
                await adminService.deleteTest(test.id);
                navigate(-1);
            } catch (err) {
                setError(`Не удалось удалить тест. Ответ сервера: ${err.response?.data?.message || err.message}`);
                console.error("Ошибка удаления теста:", err.response || err);
            }
        }
    } else {
        alert("Нечего удалять. Сначала создайте и сохраните тест.");
    }
  };

  if (isLoading) return <div className={styles.container}>Загрузка конструктора...</div>;

  return (
    <div className={styles.container}>
        <header className={styles.header}>
            <div className={styles.headerText}>
                <button onClick={() => navigate(-1)} className={styles.breadcrumb}>&larr; Назад</button>
                <h1>{test ? 'Редактирование' : 'Создание'} теста для: {entityType}</h1>
            </div>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.form}>
            <div className={styles.formGroup}>
                <label>Название теста</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
                <label>Проходной балл (количество правильных ответов)</label>
                <input 
                  type="number" 
                  value={passingScore} 
                  onChange={e => setPassingScore(Number(e.target.value))} 
                  min="1"
                  max={questions.length || 1}
                  required 
                />
            </div>
            
            <hr className={styles.divider} />
            
            {questions.map((q, qIndex) => (
                <div key={qIndex} className={styles.questionBlock}>
                    <div className={styles.questionHeader}>
                        <h4>Вопрос {qIndex + 1}</h4>
                        <button type="button" onClick={() => removeQuestion(qIndex)} className={styles.removeButton}><IoTrash/></button>
                    </div>
                    <textarea 
                        value={q.questionText} 
                        onChange={e => handleQuestionChange(qIndex, e.target.value)} 
                        placeholder="Текст вопроса"
                        rows="2"
                        required
                    />
                    
                    <div className={styles.answersList}>
                        {q.answers.map((a, aIndex) => (
                            <div key={aIndex} className={styles.answerItem}>
                                <button type="button" onClick={() => handleCorrectAnswerChange(qIndex, aIndex)} className={styles.radio}>
                                    {a.isCorrect ? <IoRadioButtonOn/> : <IoRadioButtonOff/>}
                                </button>
                                <input 
                                    type="text" 
                                    value={a.answerText} 
                                    onChange={e => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                    placeholder={`Ответ ${aIndex + 1}`}
                                    required
                                />
                                <button type="button" onClick={() => removeAnswer(qIndex, aIndex)} className={styles.removeButton}><IoTrash/></button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={() => addAnswer(qIndex)} className={styles.addButton}><IoAdd/> Добавить ответ</button>
                </div>
            ))}
            
            <button type="button" onClick={addQuestion} className={styles.addButton}><IoAdd/> Добавить вопрос</button>

            <hr className={styles.divider} />

            <div className={styles.footerActions}>
                <button onClick={handleDeleteTest} className={styles.deleteButton} disabled={!test}>Удалить тест</button>
                <button onClick={handleSaveTest} className={styles.submitButton} disabled={isSaving}>
                  {isSaving ? 'Сохранение...' : 'Сохранить тест'}
                </button>
            </div>
        </div>
    </div>
  );
};

export default AdminTestPage;