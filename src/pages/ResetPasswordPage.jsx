import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import authService from '../api/authService.js';
import styles from './LoginPage.module.css';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await authService.resetPassword(token, password);
      setMessage('Пароль успешно изменен! Сейчас вы будете перенаправлены на страницу входа.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный или просроченный токен.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Ошибка: отсутствует токен для сброса пароля.</p>
        <Link to="/login">Вернуться на страницу входа</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <h1>Новый пароль</h1>
          <h2>Придумайте надежный пароль</h2>
        </header>
        <div className={styles.formContainer}>
          <h3>Установка нового пароля</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Новый пароль</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}/>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Повторите пароль</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading}/>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.message}>{message}</p>}
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;