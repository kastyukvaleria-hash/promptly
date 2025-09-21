import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { CourseProvider } from './context/CourseContext.jsx';
import { TransitionProvider } from './context/TransitionContext.jsx';

// Этот компонент теперь просто оборачивает дочерние элементы в нужные контексты
const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <CourseProvider>
        <TransitionProvider>
          {children}
        </TransitionProvider> 
      </CourseProvider>
    </AuthProvider>
  );
};

export default AppProviders;