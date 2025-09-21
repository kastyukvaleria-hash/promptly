import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../api/authService.js';
import { jwtDecode } from 'jwt-decode'; // --- ИМПОРТИРУЕМ БИБЛИОТЕКУ ---

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  // --- НОВОЕ СОСТОЯНИЕ ДЛЯ ХРАНЕНИЯ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ИЗ ТОКЕНА ---
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);

  // Эта функция будет расшифровывать токен и сохранять данные
  const processToken = (currentToken) => {
    if (currentToken) {
      localStorage.setItem('authToken', currentToken);
      try {
        const decodedToken = jwtDecode(currentToken);
        // Достаем роль и ID из токена
        setUser({ 
          id: decodedToken.userId, 
          role: decodedToken.role 
        });
      } catch (error) {
        console.error("Невалидный токен:", error);
        setUser(null);
        localStorage.removeItem('authToken');
      }
    } else {
      localStorage.removeItem('authToken');
      setUser(null);
    }
    setToken(currentToken);
  };

  // useEffect теперь будет вызывать processToken при первой загрузке
  useEffect(() => {
    const initialToken = localStorage.getItem('authToken');
    if (initialToken) {
      processToken(initialToken);
    }
    setIsLoading(false);
  }, []);
  
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response && response.token) {
      processToken(response.token); // Используем новую функцию
    } else {
      throw new Error('Ответ сервера не содержит токен.');
    }
  };

  const register = async (nickname, email, password) => {
    const response = await authService.register(nickname, email, password);
    if (response && response.token) {
      processToken(response.token); // Используем новую функцию
    } else {
      throw new Error('Ответ сервера не содержит токен.');
    }
  };

  const logout = () => {
    authService.logout();
    processToken(null); // Очищаем все
  };

  const value = { 
    token, 
    user, // --- ПЕРЕДАЕМ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ В КОНТЕКСТ ---
    isLoggedIn: !!token, 
    isLoading,
    login, 
    logout, 
    register 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};