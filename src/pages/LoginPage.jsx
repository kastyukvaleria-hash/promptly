import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useTransition } from '../context/TransitionContext.jsx';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const { transitionToApp } = useTransition();

  // --- ВОТ ИСПРАВЛЕННАЯ ЛОГИКА ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. СНАЧАЛА пытаемся выполнить логин или регистрацию
      if (isLoginMode) {
        await auth.login(email, password);
      } else {
        await auth.register(nickname, email, password);
      }

      // 2. ЕСЛИ код дошел до сюда, значит, ошибки не было. УСПЕХ!
      //    ТОЛЬКО ТЕПЕРЬ запускаем анимацию перехода.
      await transitionToApp(() => {
        // Действие внутри анимации - это просто переход на главную.
        navigate('/');
      });

    } catch (err) {
      // 3. ЕСЛИ на шаге 1 произошла ошибка, мы попадаем сюда.
      //    Анимация НЕ БЫЛА запущена.
      if (err.response) {
        const status = err.response.status;
        if (isLoginMode) {
          if (status === 401 || status === 403) {
            setError('Неверный email или пароль.');
          } else {
            setError('Произошла ошибка на сервере.');
          }
        } else {
          if (status === 400 || status === 409) {
            setError('Пользователь с таким email уже существует.');
          } else {
            setError('Не удалось зарегистрироваться.');
          }
        }
      } else {
        setError('Не удалось подключиться к серверу.');
      }
      // Важно: сбрасываем загрузку, чтобы пользователь мог попробовать снова.
      setLoading(false);
    } 
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <h1>Привет 👋</h1>
          <h2>{isLoginMode ? 'Для начала войди в систему' : 'Создайте новый аккаунт'}</h2>
        </header>
        <div className={styles.formContainer}>
          <h3>{isLoginMode ? 'Авторизация' : 'Регистрация'}</h3>
          <form onSubmit={handleSubmit}>
            {!isLoginMode && (
              <div className={styles.inputGroup}>
                <label htmlFor="nickname">Никнейм</label>
                <input type="text" id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Ваш никнейм" required disabled={loading}/>
              </div>
            )}
            <div className={styles.inputGroup}>
              <label htmlFor="email">Почта</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" required disabled={loading}/>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Пароль</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Не менее 8 символов" required disabled={loading}/>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Создать аккаунт')}
            </button>
          </form>
          <div className={styles.linksContainer}>
            {isLoginMode && (
              <Link to="/forgot-password" className={styles.toggleText}>
                Забыли пароль?
              </Link>
            )}
            <p className={styles.toggleText} onClick={() => !loading && setIsLoginMode(!isLoginMode)}>
              {isLoginMode ? 'Зарегистрироваться' : 'У меня уже есть аккаунт'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;