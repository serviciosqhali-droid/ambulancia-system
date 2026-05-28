"use client";

interface Props {
  diagnostico: string;
  setDiagnostico: (value: string) => void;
  enfermedadFondo: string;
  setEnfermedadFondo: (value: string) => void;
  sintomas: string;
  setSintomas: (value: string) => void;
  tratamientoActual: string;
  setTratamientoActual: (value: string) => void;
  requiereOxigeno: string;
  setRequiereOxigeno: (value: string) => void;
  litrosOxigeno: string;
  setLitrosOxigeno: (value: string) => void;
  anteriorPaso: () => void;
  siguientePaso: () => void;
}

export default function PasoMedico({
  diagnostico,
  setDiagnostico,
  enfermedadFondo,
  setEnfermedadFondo,
  sintomas,
  setSintomas,
  tratamientoActual,
  setTratamientoActual,
  requiereOxigeno,
  setRequiereOxigeno,
  litrosOxigeno,
  setLitrosOxigeno,
  anteriorPaso,
  siguientePaso,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-8">
        Información Médica del Paciente
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Diagnóstico (Opcional)
          </label>
          <input
            type="text"
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
            placeholder="Diagnóstico del paciente"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Enfermedad de Fondo (Opcional)
          </label>
          <input
            type="text"
            value={enfermedadFondo}
            onChange={(e) => setEnfermedadFondo(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
            placeholder="Ej: Hipertensión, diabetes, asma..."
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Síntomas Actuales (Opcional)
          </label>
          <textarea
            value={sintomas}
            onChange={(e) => setSintomas(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 h-28 focus:outline-none focus:border-red-500"
            placeholder="Síntomas que presenta en el momento del registro"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Tratamiento Actual (Opcional)
          </label>
          <textarea
            value={tratamientoActual}
            onChange={(e) => setTratamientoActual(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 h-28 focus:outline-none focus:border-red-500"
            placeholder="Medicamentos que está tomando o soporte requerido"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            ¿Requiere Oxígeno?
          </label>
          <select
            value={requiereOxigeno}
            onChange={(e) => {
              setRequiereOxigeno(e.target.value);
              if (e.target.value === "No") setLitrosOxigeno("");
            }}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 bg-white"
          >
            <option value="No">No</option>
            <option value="Si">Sí</option>
          </select>
        </div>

        {requiereOxigeno === "Si" && (
          <div className="animate-fadeIn">
            <label className="block mb-2 font-medium text-gray-700">
              Litros de Oxígeno por Minuto (LPM) *
            </label>
            <input
              type="number"
              placeholder="Ej: 3"
              value={litrosOxigeno}
              onChange={(e) => setLitrosOxigeno(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 w-full sm:w-64 focus:outline-none focus:border-red-500"
              required
            />
          </div>
        )}
      </div>

      <div className="flex justify-between mt-10">
        <button
          type="button"
          onClick={anteriorPaso}
          className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          ← Atrás
        </button>

        <button
          type="button"
          onClick={siguientePaso}
          className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}