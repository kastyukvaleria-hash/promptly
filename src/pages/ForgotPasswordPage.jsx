import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../api/authService.js';
import styles from './LoginPage.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setMessage('Если такой email существует, на него будет отправлена ссылка для сброса пароля.');
    } catch (err) {
      setError('Произошла ошибка на сервере. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <h1>Забыли пароль?</h1>
          <h2>Введите ваш email, и мы пришлем инструкцию</h2>
        </header>
        <div className={styles.formContainer}>
          <h3>Восстановление пароля</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Почта</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="example@mail.com" 
                required 
                disabled={loading}
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.message}>{message}</p>}
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
          <Link to="/login" className={styles.toggleText}>Вернуться ко входу</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;