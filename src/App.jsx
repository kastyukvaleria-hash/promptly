// src/App.jsx
import AppProviders from './AppProviders.jsx';
import WelcomeScreen from './components/common/WelcomeScreen.jsx';
import TransitionOverlay from './components/common/TransitionOverlay.jsx';
import { useTransition } from './context/TransitionContext.jsx';
import { useAuth } from './hooks/useAuth.js';
import AppRouter from './routes/index.jsx';

// ⬇️ добавили
import DailyStreakManager from "./components/layout/DailyStreakManager.jsx";
// Этот компонент решает, что рендерить: роутер или ничего
function AppContent() {
  const { isLoggedIn, isLoading } = useAuth();
  const { showWelcome } = useTransition();
  
  // Пока идёт проверка авторизации — ничего не показываем
  if (isLoading) return null;

  // Если НЕ показываем "Добро пожаловать" и пользователь залогинен — показываем роутер
  if (!showWelcome && isLoggedIn) return <AppRouter />;

  // Если не залогинен — роутер сам отправит на /login
  if (!isLoggedIn) return <AppRouter />;

  // Иначе (когда showWelcome = true) — не рендерим ничего, экран приветствия сверху
  return null;
}

function App() {
  return (
    <AppProviders>
      <AppWrapper />
    </AppProviders>
  );
}

// Обёртка, чтобы иметь доступ к контекстам внутри провайдеров
function AppWrapper() {
  const { showWelcome } = useTransition();

  return (
    <>
      {/* Фоновый менеджер активных дней / страйка.
          Внутри сам проверяет isLoggedIn и шлёт check-in максимум раз в сутки */}
      <DailyStreakManager />

      <TransitionOverlay />
      <WelcomeScreen isVisible={showWelcome} />
      <AppContent />
    </>
  );
}

export default App;
