import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import serviceService from '../services/serviceService.js';

/**
 * Formulario de creación de talleres para HOST
 */
const CreateServicePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    date: '',
    time: '',
    duration: '',
    modality: 'Presencial',
    capacity: '',
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error específico de validación al escribir
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setValidationErrors({});

    // Validaciones locales rápidas
    const errors = {};
    if (!formData.title.trim()) errors.title = 'El título es obligatorio.';
    if (!formData.description.trim()) errors.description = 'La descripción es obligatoria.';
    if (!formData.category.trim()) errors.category = 'La categoría es obligatoria.';
    if (!formData.price) {
      errors.price = 'El precio es obligatorio.';
    } else if (parseFloat(formData.price) <= 0) {
      errors.price = 'El precio debe ser mayor a 0.';
    }
    if (!formData.date.trim()) errors.date = 'La fecha es obligatoria.';
    if (!formData.time.trim()) errors.time = 'La hora es obligatoria.';
    if (!formData.duration.trim()) errors.duration = 'La duración es obligatoria.';
    if (!formData.location.trim()) errors.location = 'La ubicación es obligatoria.';
    if (!formData.capacity) {
      errors.capacity = 'Los cupos son obligatorios.';
    } else if (parseInt(formData.capacity, 10) <= 0) {
      errors.capacity = 'Debe haber al menos 1 cupo.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await serviceService.createService({
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
        date: formData.date.trim(),
        time: formData.time.trim(),
        duration: formData.duration.trim(),
        modality: formData.modality,
        capacity: parseInt(formData.capacity, 10),
        location: formData.location.trim(),
      });
      navigate('/services');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error === 'ValidationError') {
        const errorsMap = {};
        err.response.data.errors.forEach((e) => {
          errorsMap[e.campo] = e.mensaje;
        });
        setValidationErrors(errorsMap);
      } else {
        setErrorMsg(err.response?.data?.message || 'Hubo un error al crear el taller.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Botón de retroceso y Título */}
      <div className="space-y-2">
        <Link
          to="/services"
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Mis Talleres
        </Link>
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Crear Nuevo Taller</h2>
        <p className="text-xs text-slate-500">
          Publica un nuevo taller en la plataforma. Será enviado a moderación por un administrador.
        </p>
      </div>

      {/* Banner de error */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-800 text-xs font-medium animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-150 rounded-2xl shadow-xs p-6 space-y-5">
        <div className="space-y-1">
          <label htmlFor="title" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
            Título del Taller
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Ej. Clases de Violín Clásico"
            value={formData.title}
            onChange={handleChange}
            className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
              validationErrors.title ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-500'
            }`}
          />
          {validationErrors.title && (
            <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.title}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
            Descripción Detallada
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            placeholder="Describe detalladamente en qué consiste tu taller, requisitos previos, materiales..."
            value={formData.description}
            onChange={handleChange}
            className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none resize-none ${
              validationErrors.description ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-500'
            }`}
          />
          {validationErrors.description && (
            <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="date" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
              Fecha *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
                validationErrors.date ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-500'
              }`}
            />
            {validationErrors.date && (
              <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.date}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="time" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
              Hora
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
                validationErrors.time ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-500'
              }`}
            />
            {validationErrors.time && (
              <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.time}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="duration" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
              Duración
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              placeholder="Ej: 3 horas, 2 días"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
                validationErrors.duration ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-500'
              }`}
            />
            {validationErrors.duration && (
              <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.duration}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="modality" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
              Modalidad
            </label>
            <select
              id="modality"
              name="modality"
              value={formData.modality}
              onChange={handleChange}
              className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
                validationErrors.modality ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-500'
              }`}
            >
              <option value="Presencial">🏢 Presencial</option>
              <option value="Virtual">💻 Virtual</option>
              <option value="Híbrido">🔄 Híbrido</option>
            </select>
            {validationErrors.modality && (
              <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.modality}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="price" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
              Precio (Bs.)
            </label>
            <input
              type="number"
              step="0.01"
              id="price"
              name="price"
              placeholder="Ej. 150"
              value={formData.price}
              onChange={handleChange}
              className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
                validationErrors.price ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-500'
              }`}
            />
            {validationErrors.price && (
              <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.price}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="capacity" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
              Cupos totales
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              placeholder="Ej. 10"
              value={formData.capacity}
              onChange={handleChange}
              className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
                validationErrors.capacity ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-500'
              }`}
            />
            {validationErrors.capacity && (
              <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.capacity}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="location" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
            Ubicación
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Ej: Centro Cultural Sucre, Calle Junín 123"
            value={formData.location}
            onChange={handleChange}
            className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
              validationErrors.location ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-500'
            }`}
          />
          {validationErrors.location && (
            <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.location}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="category" className="block text-2xs font-semibold uppercase tracking-wider text-slate-400">
            Categoría general
          </label>
          <input
            type="text"
            id="category"
            name="category"
            placeholder="Ej. Música, Educación, Limpieza"
            value={formData.category}
            onChange={handleChange}
            className={`w-full border rounded-xl p-3 text-xs bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all outline-none ${
              validationErrors.category ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-emerald-500'
            }`}
          />
          {validationErrors.category && (
            <p className="text-2xs font-medium text-rose-600 mt-1">{validationErrors.category}</p>
          )}
        </div>

        <div className="flex gap-3 pt-3 border-t border-slate-100">
          <Link
            to="/services"
            className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 transition-all"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex justify-center items-center px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            {loading ? 'Publicando...' : '🚀 Publicar taller'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateServicePage;
