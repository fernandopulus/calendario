
import React, { useEffect } from 'react';
import type { Evaluation } from '../types';
import { XIcon } from './Icons';

interface EvaluationDetailPopoverProps {
  evaluation: Evaluation;
  onClose: () => void;
}

const EvaluationDetailPopover: React.FC<EvaluationDetailPopoverProps> = ({ evaluation, onClose }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!evaluation) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-slate-800">Detalles de la Evaluación</h3>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-4 text-slate-700">
            <div>
              <p className="text-sm font-medium text-slate-500">Asignatura</p>
              <p className="font-semibold text-lg text-indigo-700">{evaluation.subject}</p>
            </div>
             <div>
              <p className="text-sm font-medium text-slate-500">Fecha</p>
              <p className="text-md">{new Date(evaluation.date + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Curso</p>
              <p className="text-md">{evaluation.course}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Contenidos a Evaluar</p>
              <p className="text-md bg-slate-50 p-3 rounded-md border border-slate-200 max-h-40 overflow-y-auto">{evaluation.content}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Instrumento</p>
              <p className="text-md">
                {evaluation.instrument}
                {evaluation.instrumentUrl && (
                  <a href={evaluation.instrumentUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium underline">
                    Ver Enlace
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDetailPopover;
