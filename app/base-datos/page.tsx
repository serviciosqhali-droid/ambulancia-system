"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Database, Download, Search } from "lucide-react";

type ServicioRow = {
  id: number;
  codigo: string;
  paciente: string;
  tipoServicio: string;
  estado: string;
  origen: string;
  destinos: string;
  contacto: string;
  telefono: string;
  ambulancia: string;
  fechaProgramada: string;
  fechaRegistro: string;
  costoBase: number;
  costoEspera: number;
  costoCamilla: number;
  total: number;
  metodoPago: string;
  comprobanteTipo: string;
  comprobanteNumero: string;
};

function formatInputDate(date: Date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function defaultFrom() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return formatInputDate(date);
}

function defaultTo() {
  return formatInputDate(new Date());
}

function daysBetween(from: string, to: string) {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  return Math.ceil((end.getTime() - start.getTime()) / 86400000);
}

export default function BaseDatosPage() {
  const [from, setFrom] = useState(defaultFrom());
  const [to, setTo] = useState(defaultTo());
  const [query, setQuery] = useState("");
  const [servicios, setServicios] = useState<ServicioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return servicios.filter((servicio) => {
      return (
        servicio.codigo.toLowerCase().includes(term) ||
        servicio.paciente.toLowerCase().includes(term) ||
        servicio.tipoServicio.toLowerCase().includes(term) ||
        servicio.estado.toLowerCase().includes(term) ||
        servicio.contacto.toLowerCase().includes(term) ||
        servicio.telefono.includes(query)
      );
    });
  }, [query, servicios]);

  const total = filtered.reduce((sum, servicio) => sum + servicio.total, 0);
  const exportUrl = `/api/base-datos/export?from=${from}&to=${to}`;

  async function loadServicios() {
    setLoading(true);
    setError("");

    if (daysBetween(from, to) > 366) {
      setError("El rango máximo permitido es de 1 año.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/base-datos?from=${from}&to=${to}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No se pudo cargar la base de datos.");
        return;
      }

      setServicios(data.servicios);
    } catch (err) {
      console.error("Error cargando base de datos", err);
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadServicios();
  }

  useEffect(() => {
    loadServicios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
            <Database className="text-red-600" size={36} />
            Base de datos
          </h1>
          <p className="text-gray-500 mt-2">
            Listado histórico de todos los servicios registrados, sin importar el estado.
          </p>
        </div>

        <a
          href={exportUrl}
          className="bg-green-600 hover:bg-green-500 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-100"
        >
          <Download size={20} />
          Descargar Excel
        </a>
      </div>

      <form onSubmit={applyFilters} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-1.5">Desde</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500" />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-1.5">Hasta</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500" />
          </label>
          <label className="block md:col-span-2">
            <span className="block text-sm font-semibold text-gray-700 mb-1.5">Buscar</span>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Código, paciente, estado, contacto o teléfono" className="w-full border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-red-500" />
            </div>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-2xl">
            Aplicar filtros
          </button>
          <p className="text-sm text-gray-400">Rango máximo permitido: 1 año.</p>
        </div>
        {error && <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-semibold">Servicios encontrados</p>
          <h2 className="text-4xl font-black mt-4 text-gray-800">{filtered.length}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-semibold">Ingresos del rango</p>
          <h2 className="text-3xl font-black mt-4 text-green-600">S/. {total.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-semibold">Periodo</p>
          <h2 className="text-lg font-black mt-4 text-gray-800">{from} al {to}</h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mt-8 overflow-x-auto">
        {loading ? (
          <p className="py-12 text-center text-gray-400">Cargando servicios...</p>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-gray-400">No se encontraron servicios para el rango seleccionado.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500">
                <th className="p-3">Código</th>
                <th className="p-3">Paciente / Cliente</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Fecha</th>
                <th className="p-3">Contacto</th>
                <th className="p-3">Ambulancia</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-50">
                  <td className="p-3 font-bold text-gray-800">{servicio.codigo}</td>
                  <td className="p-3 text-gray-700">{servicio.paciente}</td>
                  <td className="p-3 text-gray-500">{servicio.tipoServicio}</td>
                  <td className="p-3"><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">{servicio.estado}</span></td>
                  <td className="p-3 text-gray-500">{servicio.fechaProgramada || servicio.fechaRegistro}</td>
                  <td className="p-3 text-gray-500">{servicio.contacto || "-"}<br />{servicio.telefono}</td>
                  <td className="p-3 text-gray-500">{servicio.ambulancia || "-"}</td>
                  <td className="p-3 text-right font-black text-green-600">S/. {servicio.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
