import React, { useState, useEffect, useMemo } from 'react';
import { onSnapshot } from '../services/firebase';
import type { Evaluation } from '../types';
import { COURSES, SUBJECTS } from '../constants';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import Spinner from './Spinner';
import EvaluationDetailPopover from './EvaluationDetailPopover';

const PublicCalendarPage: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot((evals) => {
      setEvaluations(evals);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(ev => 
      (selectedCourse === 'all' || ev.course === selectedCourse) &&
      (selectedSubject === 'all' || ev.subject === selectedSubject)
    );
  }, [evaluations, selectedCourse, selectedSubject]);

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = monthEnd.getDate();
  const startDayOfWeek = monthStart.getDay(); // 0 for Sunday, 1 for Monday...

  const days = [];
  // Add blank days for the start of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(<div key={`blank-${i}`} className="border-r border-b border-slate-200"></div>);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayDateString = dayDate.toISOString().split('T')[0];
    const evaluationsForDay = filteredEvaluations.filter(ev => ev.date === dayDateString);

    days.push(
      <div key={day} className="border-r border-b border-slate-200 p-2 min-h-[120px] flex flex-col">
        <span className="font-semibold text-slate-700">{day}</span>
        <div className="flex-grow mt-1 space-y-1 overflow-y-auto">
          {evaluationsForDay.map(ev => (
            <div 
                key={ev.id} 
                className="bg-indigo-100 text-indigo-800 text-xs p-1 rounded-md truncate cursor-pointer hover:bg-indigo-200 transition-colors" 
                title={`${ev.subject} - ${ev.course}`}
                onClick={() => setSelectedEvaluation(ev)}
            >
              {ev.subject}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 md:mb-0">Calendario de Evaluaciones</h2>
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Todos los Cursos</option>
              {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">Todas las Asignaturas</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronLeftIcon className="h-6 w-6 text-slate-600"/>
          </button>
          <h3 className="text-xl font-semibold text-slate-700">
            {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
          </h3>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100">
            <ChevronRightIcon className="h-6 w-6 text-slate-600"/>
          </button>
        </div>

        {loading ? (
            <div className="h-[500px] flex items-center justify-center"><Spinner /></div>
        ) : (
            <div className="grid grid-cols-7 border-t border-l border-slate-200">
                <div className="text-center font-medium text-sm text-slate-500 p-2 border-r border-b">Dom</div>
                <div className="text-center font-medium text-sm text-slate-500 p-2 border-r border-b">Lun</div>
                <div className="text-center font-medium text-sm text-slate-500 p-2 border-r border-b">Mar</div>
                <div className="text-center font-medium text-sm text-slate-500 p-2 border-r border-b">Mié</div>
                <div className="text-center font-medium text-sm text-slate-500 p-2 border-r border-b">Jue</div>
                <div className="text-center font-medium text-sm text-slate-500 p-2 border-r border-b">Vie</div>
                <div className="text-center font-medium text-sm text-slate-500 p-2 border-r border-b">Sáb</div>
                {days}
            </div>
        )}
      </div>

       {selectedEvaluation && (
        <EvaluationDetailPopover 
          evaluation={selectedEvaluation} 
          onClose={() => setSelectedEvaluation(null)}
        />
      )}
    </div>
  );
};

export default PublicCalendarPage;