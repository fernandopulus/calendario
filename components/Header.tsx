
import React from 'react';
import type { FirebaseUser } from '../types';
import { BookOpenIcon } from './Icons';

interface HeaderProps {
  user: FirebaseUser | null;
  onLogout: () => void;
  onNavigateToLogin: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigateToLogin, onNavigateToDashboard, onNavigateToHome }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <BookOpenIcon className="h-8 w-8 text-indigo-600" />
            <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-800">Calendario Académico</h1>
                <h2 className="text-sm text-slate-500">Liceo Industrial de Recoleta</h2>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <button onClick={onNavigateToHome} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Calendario Público
            </button>
            {user ? (
              <>
                <button onClick={onNavigateToDashboard} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  Mi Panel
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <button
                onClick={onNavigateToLogin}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Área Profesores
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
