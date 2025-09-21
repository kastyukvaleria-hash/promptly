import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import adminService from '../api/adminService.js';
import styles from './AdminChaptersPage.module.css'; 
import { IoPencil, IoTrash, IoAdd, IoClipboardOutline } from 'react-icons/io5';

const AdminChaptersPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchChapters = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await adminService.getSectionById(sectionId);
      data.chapters.sort((a, b) => a.orderIndex - b.orderIndex);
      setSection(data);
      setChapters(data.chapters);
    } catch (err) {
      setError('Не удалось загрузить данные раздела.');
      console.error("Ошибка загрузки глав:", err.response || err);
    } finally {
      setIsLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);
  
  const handleCreateChapter = async (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;
    setError('');
    setIsCreating(true);
    try {
      const newChapterData = {
        title: newChapterTitle,
        orderIndex: chapters.length,
      };
      await adminService.createChapter(sectionId, newChapterData);
      setNewChapterTitle('');
      await fetchChapters();
    } catch (err) {
      setError(`Не удалось создать главу. Ответ сервера: ${err.response?.data?.message || err.message}`);
      console.error("Ошибка создания главы:", err.response || err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteChapter = async (chapterId, chapterTitle) => {
    setError('');
    if (window.confirm(`Вы уверены, что хотите удалить главу "${chapterTitle}"?`)) {
      try {
        await adminService.deleteChapter(chapterId);
        setChapters(prev => prev.filter(c => c.id !== chapterId));
      } catch (err) {
        console.error("Ошибка удаления главы:", err.response || err);
        setError(`Не удалось удалить главу. Ответ сервера: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  if (isLoading) return <div className={styles.container}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <Link to="/admin" className={styles.breadcrumb}>&larr; К разделам</Link>
          <h1>{section ? `Главы в разделе "${section.title}"` : 'Главы раздела'}</h1>
        </div>
      </header>
      
      {error && <p className={styles.error}>{error}</p>}
      
      <form onSubmit={handleCreateChapter} className={styles.createForm}>
        <input 
          type="text"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          placeholder="Название новой главы"
          required
          disabled={isCreating}
        />
        <button type="submit" disabled={isCreating}>
          <IoAdd size={20} /> {isCreating ? 'Создание...' : 'Добавить'}
        </button>
      </form>
      
      <div className={styles.listContainer}>
        {chapters.length > 0 ? chapters.map(chapter => (
          <div key={chapter.id} className={styles.listItem}>
            <Link to={`/admin/chapters/${chapter.id}`} className={styles.listItemInfo}>
              <span className={styles.listItemTitle}>{chapter.title}</span>
            </Link>
            <div className={styles.listItemActions}>
              <button onClick={() => navigate(`/admin/chapters/${chapter.id}/test`)} className={`${styles.actionButton} ${styles.manageButton}`}>
                <IoClipboardOutline /> Тест
              </button>
              <button className={`${styles.actionButton} ${styles.editButton}`}><IoPencil /></button>
              <button onClick={() => handleDeleteChapter(chapter.id, chapter.title)} className={`${styles.actionButton} ${styles.deleteButton}`}><IoTrash /></button>
            </div>
          </div>
        )) : <p>В этом разделе пока нет глав. Создайте первую!</p>}
      </div>
    </div>
  );
};

export default AdminChaptersPage;