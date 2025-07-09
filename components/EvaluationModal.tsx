
import React, { useState, useEffect } from 'react';
import { addDoc, updateDoc } from '../services/firebase';
import type { Evaluation, FirebaseUser } from '../types';
import { COURSES, SUBJECTS, INSTRUMENTS } from '../constants';
import Spinner from './Spinner';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: Evaluation | null;
  user: FirebaseUser;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({ isOpen, onClose, evaluation, user }) => {
  const [formData, setFormData] = useState({
    date: '',
    subject: '',
    course: '',
    content: '',
    instrument: '',
    instrumentUrl: '',
  });
  const [loading, setLoading] = useState(false);

  const showUrlField = formData.instrument === 'Rúbrica' || formData.instrument === 'Pauta de Cotejo';

  useEffect(() => {
    if (evaluation) {
      setFormData({
        date: evaluation.date,
        subject: evaluation.subject,
        course: evaluation.course,
        content: evaluation.content,
        instrument: evaluation.instrument,
        instrumentUrl: evaluation.instrumentUrl || '',
      });
    } else {
      // Reset form for new evaluation
      setFormData({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        course: '',
        content: '',
        instrument: '',
        instrumentUrl: '',
      });
    }
  }, [evaluation, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSave: Partial<Omit<Evaluation, 'id' | 'creatorId'>> = {
      date: formData.date,
      subject: formData.subject,
      course: formData.course,
      content: formData.content,
      instrument: formData.instrument,
      instrumentUrl: showUrlField ? formData.instrumentUrl : '',
    };

    try {
      if (evaluation) {
        // Update existing evaluation
        await updateDoc(evaluation.id, dataToSave);
      } else {
        // Add new evaluation
        const newEvaluationData = {
          ...(dataToSave as Omit<Evaluation, 'id' | 'creatorId'>),
          creatorId: user.uid,
        };
        await addDoc('evaluations', newEvaluationData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving evaluation:", error);
      alert('Hubo un error al guardar la evaluación.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800">{evaluation ? 'Editar Evaluación' : 'Agregar Evaluación'}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-3xl font-light leading-none">&times;</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-slate-700">Fecha</label>
                  <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                 <div>
                  <label htmlFor="course" className="block text-sm font-medium text-slate-700">Curso</label>
                  <select name="course" id="course" value={formData.course} onChange={handleChange} required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Seleccione un curso</option>
                    {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Asignatura</label>
              <select name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Seleccione una asignatura</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700">Contenidos a Evaluar</label>
              <textarea name="content" id="content" value={formData.content} onChange={handleChange} required rows={4} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div>
              <label htmlFor="instrument" className="block text-sm font-medium text-slate-700">Instrumento de Evaluación</label>
              <select name="instrument" id="instrument" value={formData.instrument} onChange={handleChange} required className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="" disabled>Seleccione un instrumento</option>
                {INSTRUMENTS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            
            {showUrlField && (
              <div className="animate-fade-in-up">
                <label htmlFor="instrumentUrl" className="block text-sm font-medium text-slate-700">Enlace del Instrumento (URL)</label>
                <input 
                  type="url" 
                  name="instrumentUrl" 
                  id="instrumentUrl" 
                  value={formData.instrumentUrl} 
                  onChange={handleChange} 
                  required 
                  placeholder="https://ejemplo.com/documento.pdf"
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors">Cancelar</button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center transition-colors">
                 {loading ? <Spinner size="small" /> : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
