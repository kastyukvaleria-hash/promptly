import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminService from '../api/adminService.js';
import styles from './AdminPage.module.css'; 
import { getIconConfigById } from '../utils/iconUtils.jsx';
import { IoPencil, IoTrash, IoClipboardOutline } from 'react-icons/io5';

const AdminPage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await adminService.getAllSections();
      data.sort((a, b) => a.orderIndex - b.orderIndex);
      setSections(data);
    } catch (err) {
      setError('Не удалось загрузить список разделов.');
      console.error("Ошибка загрузки разделов:", err.response || err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleDelete = async (sectionId, sectionTitle) => {
    setError('');
    if (window.confirm(`Вы уверены, что хотите удалить раздел "${sectionTitle}"? Все его главы и уроки также будут удалены!`)) {
      try {
        await adminService.deleteSection(sectionId);
        setSections(prevSections => prevSections.filter(s => s.id !== sectionId));
      } catch (err) {
        console.error("Ошибка удаления раздела:", err.response || err);
        setError(`Не удалось удалить раздел. Ответ сервера: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const renderContent = () => {
    if (isLoading) return <p>Загрузка разделов...</p>;
    if (sections.length === 0 && !error) return <p>Разделы еще не созданы.</p>;

    return (
      <div className={styles.listContainer}>
        {sections.map(section => (
          <div key={section.id} className={styles.listItem}>
            <Link to={`/admin/sections/${section.id}`} className={styles.listItemInfo}>
              <div className={styles.listItemIcon} style={{ background: getIconConfigById(section.iconId).gradient }}>
                {getIconConfigById(section.iconId).icon}
              </div>
              <span className={styles.listItemTitle}>{section.title}</span>
            </Link>
            <div className={styles.listItemActions}>
              <button onClick={() => navigate(`/admin/sections/${section.id}/test`)} className={`${styles.actionButton} ${styles.manageButton}`}>
                <IoClipboardOutline /> Тест
              </button>
              <button onClick={() => alert('Редактирование в разработке')} className={`${styles.actionButton} ${styles.editButton}`}>
                <IoPencil />
              </button>
              <button onClick={() => handleDelete(section.id, section.title)} className={`${styles.actionButton} ${styles.deleteButton}`}>
                <IoTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Управление разделами</h1>
        <Link 
          to="/admin/create-section" 
          state={{ nextOrderIndex: sections.length + 1 }}
          className={styles.createButton}
        >
          + Создать раздел
        </Link>
      </header>
      {error && <p className={styles.error}>{error}</p>}
      {renderContent()}
    </div>
  );
};

export default AdminPage;