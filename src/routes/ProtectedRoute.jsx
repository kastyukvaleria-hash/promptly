import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { AnimatePresence } from 'framer-motion'; // <-- 1. ИМПОРТИРУЕМ НАШЕГО ДИРИЖЕРА

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // Пока идет проверка, ничего не показываем, чтобы избежать моргания
    return <div>Проверка авторизации...</div>; 
  }

  if (!isLoggedIn) {
    // Если не залогинен, отправляем на страницу входа
    return <Navigate to="/login" replace />;
  }
  
  // --- 2. ОБОРАЧИВАЕМ <Outlet /> В НАШЕГО ДИРИЖЕРА ---
  // <Outlet /> - это то место, куда React Router подставляет нужную страницу (HomePage, LecturePage, TestPage и т.д.)
  // AnimatePresence будет следить за тем, какая страница сейчас внутри, и когда она меняется,
  // он будет запускать анимацию выхода (exit) для старой и входа (initial, animate) для новой.
  return (
    <AnimatePresence mode="wait">
      <Outlet />
    </AnimatePresence>
  );
};

export default ProtectedRoute;