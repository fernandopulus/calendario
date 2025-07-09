
import React, { useState, useEffect, useMemo } from 'react';
import { onSnapshot, deleteDoc } from '../services/firebase';
import type { Evaluation, FirebaseUser } from '../types';
import { EditIcon, PlusCircleIcon, TrashIcon } from './Icons';
import EvaluationModal from './EvaluationModal';
import Spinner from './Spinner';

interface TeacherDashboardPageProps {
  user: FirebaseUser;
}

const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({ user }) => {
  const [allEvaluations, setAllEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot((evals) => {
      setAllEvaluations(evals);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const myEvaluations = useMemo(() => {
    return allEvaluations
      .filter(ev => ev.creatorId === user.uid)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvaluations, user.uid]);

  const handleAdd = () => {
    setEditingEvaluation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (evaluation: Evaluation) => {
    setEditingEvaluation(evaluation);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta evaluación?')) {
      try {
        await deleteDoc(id);
      } catch (error) {
        console.error("Error deleting evaluation: ", error);
        alert('Hubo un error al eliminar la evaluación.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-3xl font-bold text-slate-800">Mi Panel de Profesor</h2>
            <p className="text-slate-500 mt-1">Bienvenido/a, {user.email}</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Agregar Evaluación
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-slate-700 mb-4">Mis Evaluaciones Creadas</h3>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : myEvaluations.length > 0 ? (
          <div className="space-y-4">
            {myEvaluations.map(ev => (
              <div key={ev.id} className="p-4 border border-slate-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <p className="font-bold text-indigo-700">{ev.subject}</p>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Fecha:</span> {new Date(ev.date + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })} | <span className="font-semibold">Curso:</span> {ev.course}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Contenido:</span> {ev.content}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Instrumento:</span> {ev.instrument}
                    {ev.instrumentUrl && (
                      <a href={ev.instrumentUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium underline">
                        Ver Enlace
                      </a>
                    )}
                  </p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <button onClick={() => handleEdit(ev)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors">
                    <EditIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(ev.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-10">No ha ingresado ninguna evaluación todavía.</p>
        )}
      </div>

      {isModalOpen && (
        <EvaluationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          evaluation={editingEvaluation}
          user={user}
        />
      )}
    </div>
  );
};

export default TeacherDashboardPage;
