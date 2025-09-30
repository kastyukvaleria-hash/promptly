// src/pages/AdminCreateSectionPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import adminService from '../api/adminService.js';
import { getAllIconConfigs, getIconConfigById } from '../utils/iconUtils.jsx';
import styles from './AdminCreateSectionPage.module.css'; 

const AdminCreateSectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [orderIndex, setOrderIndex] = useState(location.state?.nextOrderIndex || 1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIconId, setSelectedIconId] = useState(1);
  // --- НАЧАЛО ИЗМЕНЕНИЙ ---
  const [isPremium, setIsPremium] = useState(false); // Новое состояние для чекбокса
  // --- КОНЕЦ ИЗМЕНЕНИЙ ---
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const availableIcons = getAllIconConfigs();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newSectionData = {
        title,
        description,
        orderIndex: Number(orderIndex),
        iconId: Number(selectedIconId),
        isPremium: isPremium, // <-- Отправляем новое поле на бэкенд
      };
      await adminService.createSection(newSectionData);
      navigate('/admin'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось создать раздел.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Создать новый раздел</h1>
        <button onClick={() => navigate('/admin')} className={styles.backButton}>Назад</button>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Заголовок</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="orderIndex">Порядковый номер</label>
          <input id="orderIndex" type="number" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Иконка и стиль</label>
          <div className={styles.iconSelector}>
            {availableIcons.map(icon => (
              <button type="button" key={icon.id} className={`${styles.iconOption} ${selectedIconId === icon.id ? styles.selected : ''}`} onClick={() => setSelectedIconId(icon.id)} style={{ background: getIconConfigById(icon.id).gradient }}>
                {icon.icon}
              </button>
            ))}
          </div>
        </div>
        
        {/* --- НАЧАЛО ИЗМЕНЕНИЙ: ДОБАВЛЯЕМ ЧЕКБОКС --- */}
        <div className={styles.checkboxGroup}>
          <input 
            id="isPremium" 
            type="checkbox" 
            checked={isPremium} 
            onChange={(e) => setIsPremium(e.target.checked)} 
          />
          <label htmlFor="isPremium">Это премиум-раздел (Практика)?</label>
        </div>
        {/* --- КОНЕЦ ИЗМЕНЕНИЙ --- */}
        
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Создание...' : 'Создать раздел'}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateSectionPage;