import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '../api/adminService.js';
import styles from './AdminPromptsPage.module.css';
import { IoTrash, IoAdd } from 'react-icons/io5';

const AdminPromptsPage = () => {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [newPromptTitle, setNewPromptTitle] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await adminService.getPromptsByLectureId(lectureId);
      setPrompts(data);
    } catch (err) {
      setError('Не удалось загрузить промпты.');
      console.error("Ошибка загрузки промптов:", err.response || err);
    } finally {
      setIsLoading(false);
    }
  }, [lectureId]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const handleCreatePrompt = async (e) => {
    e.preventDefault();
    setError('');
    setIsCreating(true);
    try {
      await adminService.createPrompt(lectureId, { title: newPromptTitle, promptText: newPromptText });
      setNewPromptTitle('');
      setNewPromptText('');
      await fetchPrompts();
    } catch (err) {
      setError(`Не удалось создать промпт. Ответ сервера: ${err.response?.data?.message || err.message}`);
      console.error("Ошибка создания промпта:", err.response || err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePrompt = async (promptId, promptTitle) => {
    setError('');
    if (window.confirm(`Удалить промпт "${promptTitle}"?`)) {
      try {
        await adminService.deletePrompt(promptId);
        setPrompts(prev => prev.filter(p => p.id !== promptId));
      } catch (err) {
        console.error("Ошибка удаления промпта:", err.response || err);
        setError(`Не удалось удалить промпт. Ответ сервера: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  if (isLoading) return <div className={styles.container}>Загрузка...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <button onClick={() => navigate(-1)} className={styles.breadcrumb}>&larr; К лекциям</button>
          <h1>Управление промптами</h1>
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleCreatePrompt} className={styles.form}>
        <h3>Добавить новый промпт</h3>
        <div className={styles.formGroup}>
          <label htmlFor="title">Заголовок промпта</label>
          <input id="title" type="text" value={newPromptTitle} onChange={e => setNewPromptTitle(e.target.value)} required disabled={isCreating} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="text">Текст промпта</label>
          <textarea id="text" value={newPromptText} onChange={e => setNewPromptText(e.target.value)} rows="5" required disabled={isCreating} />
        </div>
        <button type="submit" className={styles.submitButton} disabled={isCreating}>
          <IoAdd /> {isCreating ? 'Добавление...' : 'Добавить промпт'}
        </button>
      </form>

      <div className={styles.listContainer}>
        <h2>Существующие промпты</h2>
        {prompts.length > 0 ? prompts.map(prompt => (
          <div key={prompt.id} className={styles.listItem}>
            <div className={styles.promptContent}>
              <span className={styles.listItemTitle}>{prompt.title}</span>
              <p className={styles.promptText}>{prompt.promptText}</p>
            </div>
            <div className={styles.listItemActions}>
              <button onClick={() => handleDeletePrompt(prompt.id, prompt.title)} className={`${styles.actionButton} ${styles.deleteButton}`}><IoTrash /></button>
            </div>
          </div>
        )) : <p>В этой лекции пока нет промптов.</p>}
      </div>
    </div>
  );
};

export default AdminPromptsPage;