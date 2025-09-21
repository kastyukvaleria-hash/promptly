import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../api/userService.js';
import styles from './LoginPage.module.css';

const LinkAccountPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await userService.linkAccount(email, password);
      setSuccess(true);
      setTimeout(() => navigate('/profile', { replace: true }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка. Возможно, эта почта уже занята.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.formContainer}>
            <h3>Отлично!</h3>
            <p className={styles.message}>Ваша почта успешно привязана. Возвращаемся в профиль...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <h1>Привязка аккаунта</h1>
          <h2>Задайте почту и пароль для входа через сайт</h2>
        </header>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Почта</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Новый пароль</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Повторите пароль</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Привязка...' : 'Привязать аккаунт'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LinkAccountPage;