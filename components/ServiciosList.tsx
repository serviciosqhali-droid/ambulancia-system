"use client";

import { useState } from "react";
import { 
  Search, 
  User, 
  Phone, 
  Eye, 
  Calendar,
  AlertCircle
} from "lucide-react";

interface Servicio {
  id: number;
  paciente: string;
  edad: number | null;
  peso: number | null;
  tipoServicio: string;
  origen: string;
  referencia: string | null;
  destinos: string; // JSON String
  esIdaYVuelta: boolean | null;
  diagnostico: string | null;
  enfermedadFondo: string | null;
  sintomas: string | null;
  tratamientoActual: string | null;
  requiereOxigeno: string | null;
  litrosOxigeno: number | null;
  prioridad: string | null;
  ambulancia: string | null;
  observaciones: string | null;
  contacto: string | null;
  telefono: string | null;
  email: string | null;
  costo: number | null;
  metodoPago: string | null;
  estado: string | null;
  fechaHora: string | null;
  notas: string | null;
  createdAt: string;
}

interface Props {
  initialServicios: Servicio[];
}

export default function ServiciosList({ initialServicios }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [sortBy, setSortBy] = useState("Fecha");
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);

  // Filtrado de servicios
  const filteredServicios = initialServicios.filter((s) => {
    const matchesSearch = 
      s.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.contacto && s.contacto.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.telefono && s.telefono.includes(searchTerm)) ||
      `SRV-${s.id}`.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = filterEstado === "Todos" || s.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  // Ordenación de servicios
  const sortedServicios = [...filteredServicios].sort((a, b) => {
    if (sortBy === "Fecha") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "Costo") {
      return (b.costo || 0) - (a.costo || 0);
    } else if (sortBy === "ID") {
      return b.id - a.id;
    }
    return 0;
  });

  function parseDestinos(destinosStr: string): string[] {
    try {
      const parsed = JSON.parse(destinosStr);
      if (Array.isArray(parsed)) return parsed;
      return [destinosStr];
    } catch {
      return [destinosStr];
    }
  }

  return (
    <div className="mt-10">
      {/* Barra de Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative w-full lg:w-[450px]">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por paciente, contacto, teléfono o ID (SRV-003)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 border border-gray-200 rounded-2xl w-full text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div className="flex gap-4 self-end lg:self-center w-full lg:w-auto">
            <div className="w-1/2 lg:w-40">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 bg-white cursor-pointer"
              >
                <option value="Todos">Todos los Estados</option>
                <option value="Cotización">Cotización</option>
                <option value="Confirmado">Confirmado</option>
                <option value="En Curso">En Curso</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="w-1/2 lg:w-40">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 bg-white cursor-pointer"
              >
                <option value="Fecha">Ordenar por Fecha</option>
                <option value="Costo">Ordenar por Costo</option>
                <option value="ID">Ordenar por ID</option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-400 font-medium mt-6">
          {sortedServicios.length} servicios encontrados
        </div>

        {/* Listado de Tarjetas */}
        <div className="space-y-6 mt-8">
          {sortedServicios.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="font-semibold text-lg">No se encontraron servicios</p>
              <p className="text-sm text-gray-400 mt-1">Pruebe modificando los términos de búsqueda o filtros.</p>
            </div>
          ) : (
            sortedServicios.map((servicio) => {
              const listDestinos = parseDestinos(servicio.destinos);
              return (
                <div
                  key={servicio.id}
                  className="bg-white border border-gray-100 hover:border-red-100 rounded-3xl p-6 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                      <div className={`p-4 rounded-2xl flex items-center justify-center font-bold text-2xl ${
                        servicio.tipoServicio === "Traslado" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                      }`}>
                        🚑
                      </div>
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-black text-gray-800">
                            {servicio.paciente}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            servicio.tipoServicio === "Traslado" ? "bg-red-50 text-red-700 border border-red-100" : "bg-blue-50 text-blue-700 border border-blue-100"
                          }`}>
                            {servicio.tipoServicio}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            servicio.estado === "En Curso" ? "bg-yellow-50 text-yellow-700 border border-yellow-100" :
                            servicio.estado === "Confirmado" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                            servicio.estado === "Completado" ? "bg-green-50 text-green-700 border border-green-100" :
                            servicio.estado === "Cotización" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                            "bg-gray-50 text-gray-700 border border-gray-100"
                          }`}>
                            {servicio.estado}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm font-semibold flex items-center gap-1.5">
                          <span className="text-red-500 font-bold">Recojo:</span> {servicio.origen}
                        </p>
                        
                        <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5">
                          <span className="text-blue-500 font-bold">Destino:</span> {listDestinos.join(" ➔ ")}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-400 font-semibold">
                          <span className="bg-gray-50 px-2 py-1 rounded-lg">SRV-{String(servicio.id).padStart(3, "0")}</span>
                          {servicio.contacto && (
                            <span className="flex items-center gap-1">
                              <User size={12} /> {servicio.contacto}
                            </span>
                          )}
                          {servicio.telefono && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} /> {servicio.telefono}
                            </span>
                          )}
                          {servicio.ambulancia && (
                            <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg">🚒 {servicio.ambulancia}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between self-stretch lg:self-auto gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-black text-green-600">S/. {servicio.costo?.toFixed(2)}</p>
                        <p className="text-xs text-gray-400 font-semibold mt-1 flex items-center gap-1 justify-end">
                          <Calendar size={12} />
                          {servicio.fechaHora ? new Date(servicio.fechaHora).toLocaleDateString() : new Date(servicio.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedServicio(servicio)}
                          className="border border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={14} /> Ver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Modal Detalle */}
      {selectedServicio && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 border border-gray-100 max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                <span>🚑 Detalles del Servicio</span>
                <span className="text-sm bg-gray-100 text-gray-500 font-bold px-2 py-1 rounded-lg">
                  SRV-{String(selectedServicio.id).padStart(3, "0")}
                </span>
              </h3>
              <button
                onClick={() => setSelectedServicio(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-6 text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Paciente</p>
                  <p className="font-bold text-gray-900 text-lg">{selectedServicio.paciente}</p>
                  {selectedServicio.edad && <p className="text-sm text-gray-500">Edad: {selectedServicio.edad} años</p>}
                  {selectedServicio.peso && <p className="text-sm text-gray-500">Peso: {selectedServicio.peso} kg</p>}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Tipo Servicio</p>
                  <p className="font-bold text-gray-900 text-lg">{selectedServicio.tipoServicio}</p>
                  <p className="text-sm text-gray-500">Estado: <span className="font-semibold text-red-600">{selectedServicio.estado}</span></p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Punto de Recojo</p>
                  <p className="font-semibold text-gray-800">{selectedServicio.origen}</p>
                  {selectedServicio.referencia && <p className="text-xs text-gray-500 italic mt-0.5">Ref: {selectedServicio.referencia}</p>}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Ruta de Destinos</p>
                  <p className="font-semibold text-gray-800">{parseDestinos(selectedServicio.destinos).join(" ➔ ")}</p>
                  {selectedServicio.esIdaYVuelta && <p className="text-xs text-blue-600 font-bold mt-1">✓ Incluye retorno (Ida y vuelta)</p>}
                </div>
              </div>

              {selectedServicio.tipoServicio === "Traslado" && (
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-bold uppercase">Información Médica</p>
                    <p className="text-sm"><span className="font-bold">Diagnóstico:</span> {selectedServicio.diagnostico || "No registrado"}</p>
                    <p className="text-sm"><span className="font-bold">Síntomas:</span> {selectedServicio.sintomas || "No registrado"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-bold uppercase">Soporte Médico</p>
                    <p className="text-sm"><span className="font-bold">Oxígeno:</span> {selectedServicio.requiereOxigeno}</p>
                    {selectedServicio.requiereOxigeno === "Si" && <p className="text-sm"><span className="font-bold">Flujo:</span> {selectedServicio.litrosOxigeno} LPM</p>}
                    <p className="text-sm"><span className="font-bold">Enfermedades:</span> {selectedServicio.enfermedadFondo || "Ninguna"}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Contacto despacho</p>
                  <p className="font-bold text-gray-800">{selectedServicio.contacto || "No especificado"}</p>
                  <p className="text-sm text-gray-500">📞 {selectedServicio.telefono || "No especificado"}</p>
                  {selectedServicio.email && <p className="text-sm text-gray-500">✉ {selectedServicio.email}</p>}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Costo y Pago</p>
                  <p className="font-bold text-green-600 text-lg">S/. {selectedServicio.costo?.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Método: {selectedServicio.metodoPago}</p>
                  {selectedServicio.ambulancia && <p className="text-sm text-red-600 font-bold">Unidad Asignada: {selectedServicio.ambulancia}</p>}
                </div>
              </div>

              {selectedServicio.observaciones && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400 font-bold uppercase">Observaciones Operativas</p>
                  <p className="text-sm text-gray-700 italic mt-1">{selectedServicio.observaciones}</p>
                </div>
              )}

              {selectedServicio.notas && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400 font-bold uppercase">Notas Adicionales Internas</p>
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-1">{selectedServicio.notas}</p>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedServicio(null)}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-2xl transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
