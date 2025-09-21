import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import adminService from '../api/adminService.js';
import styles from './AdminLecturesPage.module.css';
import { IoPencil, IoTrash, IoAdd, IoDocumentTextOutline, IoClipboardOutline } from 'react-icons/io5';

const AdminLecturesPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newLectureTitle, setNewLectureTitle] = useState('');
  const [newLectureContent, setNewLectureContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const lecturesData = await adminService.getLecturesByChapterId(chapterId);
      lecturesData.sort((a, b) => a.orderIndex - b.orderIndex);
      setLectures(lecturesData);
    } catch (err) {
      setError('Не удалось загрузить данные лекций.');
      console.error("Ошибка загрузки лекций:", err.response || err);
    } finally {
      setIsLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateLecture = async (e) => {
    e.preventDefault();
    setError('');
    setIsCreating(true);
    try {
      const newLectureData = {
        title: newLectureTitle,
        contentText: newLectureContent,
        videoUrl: '',
        orderIndex: lectures.length,
      };
      await adminService.createLecture(chapterId, newLectureData);
      setNewLectureTitle('');
      setNewLectureContent('');
      setIsFormVisible(false);
      await fetchData();
    } catch (err) {
      setError(`Не удалось создать лекцию. Ответ сервера: ${err.response?.data?.message || err.message}`);
      console.error("Ошибка создания лекции:", err.response || err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteLecture = async (lectureId, lectureTitle) => {
    setError('');
    if (window.confirm(`Вы уверены, что хотите удалить лекцию "${lectureTitle}"?`)) {
      try {
        // 1. Пытаемся найти связанный тест
        try {
          const test = await adminService.getTestByLectureId(lectureId);
          if (test && test.id) {
            // 2. Если тест найден, СНАЧАЛА удаляем его
            console.log(`Найден связанный тест с ID: ${test.id}. Удаляем его...`);
            await adminService.deleteTest(test.id);
          }
        } catch (err) {
          // Если получили 404, значит теста нет. Это НЕ ошибка, игнорируем.
          if (err.response && err.response.status !== 404) {
            throw new Error('Не удалось удалить связанный тест перед удалением лекции.');
          }
          console.log('Связанный тест не найден, продолжаем удаление лекции.');
        }
        
        // 3. ТЕПЕРЬ удаляем саму лекцию
        await adminService.deleteLecture(lectureId);
        
        // 4. Обновляем UI
        setLectures(prev => prev.filter(l => l.id !== lectureId));

      } catch (err) {
        console.error("Ошибка удаления лекции:", err.response || err);
        setError(`Не удалось удалить лекцию. Ответ сервера: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  if (isLoading) return <div className={styles.container}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
           <button onClick={() => navigate(-1)} className={styles.breadcrumb}>&larr; К списку глав</button>
           <h1>Лекции в главе</h1>
        </div>
        <button onClick={() => setIsFormVisible(!isFormVisible)} className={styles.createButton}>
          {isFormVisible ? 'Отмена' : '+ Создать лекцию'}
        </button>
      </header>
      
      {error && <p className={styles.error}>{error}</p>}
      
      {isFormVisible && (
        <form onSubmit={handleCreateLecture} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Заголовок лекции</label>
            <input id="title" type="text" value={newLectureTitle} onChange={e => setNewLectureTitle(e.target.value)} required disabled={isCreating} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Текст лекции</label>
            <textarea id="content" value={newLectureContent} onChange={e => setNewLectureContent(e.target.value)} rows="5" required disabled={isCreating} />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isCreating}>
            {isCreating ? 'Сохранение...' : 'Сохранить лекцию'}
          </button>
        </form>
      )}
      
      <div className={styles.listContainer}>
        {lectures.length > 0 ? lectures.map(lecture => (
          <div key={lecture.id} className={styles.listItem}>
            <span className={styles.listItemTitle}>{lecture.title}</span>
            <div className={styles.listItemActions}>
                <button 
                  className={`${styles.actionButton} ${styles.manageButton}`} 
                  onClick={() => navigate(`/admin/lectures/${lecture.id}/test`)}
                >
                    <IoClipboardOutline /> Тест
                </button>
                <button 
                  className={`${styles.actionButton} ${styles.manageButton}`} 
                  onClick={() => navigate(`/admin/lectures/${lecture.id}/prompts`)}
                >
                    <IoDocumentTextOutline /> Промпты
                </button>
                <button className={`${styles.actionButton} ${styles.editButton}`}><IoPencil /></button>
                <button onClick={() => handleDeleteLecture(lecture.id, lecture.title)} className={`${styles.actionButton} ${styles.deleteButton}`}><IoTrash /></button>
            </div>
          </div>
        )) : <p>В этой главе пока нет лекций.</p>}
      </div>
    </div>
  );
};

export default AdminLecturesPage;