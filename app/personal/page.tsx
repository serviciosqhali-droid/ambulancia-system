"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Plus, UserPlus, X } from "lucide-react";

type Personal = {
  id: number;
  nombres: string;
  cargo: string | null;
  tipoDocumento: string | null;
  documento: string | null;
  celular: string;
  cuentaBancaria: string | null;
  cci: string | null;
  banco: string | null;
  yape: string | null;
  fechaNacimiento: string | null;
  contactoEmergencia: string | null;
  direccion: string | null;
  cvArchivo: string | null;
  certificadosArchivo: string | null;
};

const CARGOS = [
  "Piloto",
  "Licenciado",
  "Médico",
  "Paramédico",
  "Practicante",
  "Call",
] as const;

const initial = {
  nombres: "",
  cargo: "",
  tipoDocumento: "",
  documento: "",
  celular: "",
  cuentaBancaria: "",
  cci: "",
  banco: "",
  yape: "",
  fechaNacimiento: "",
  contactoEmergencia: "",
  direccion: "",
  cvArchivo: "",
};

function parseCertificados(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(String).map((item) => item.trim()).filter(Boolean);
    }
  } catch {
    // formato anterior: nombres separados por " / "
  }
  return value
    .split(" / ")
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeCertificados(files: string[]) {
  return files.length > 0 ? JSON.stringify(files) : "";
}

export default function PersonalPage() {
  const [items, setItems] = useState<Personal[]>([]);
  const [form, setForm] = useState(initial);
  const [certificados, setCertificados] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const certificadosInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/personal")
      .then((response) => (response.ok ? response.json() : []))
      .then(setItems)
      .catch((err) => console.error("Error cargando personal", err));
  }, []);

  function setField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function agregarCertificados(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const nuevos = Array.from(fileList).map((file) => file.name);
    setCertificados((current) => {
      const merged = [...current];
      for (const name of nuevos) {
        if (!merged.includes(name)) merged.push(name);
      }
      return merged;
    });
    if (certificadosInputRef.current) {
      certificadosInputRef.current.value = "";
    }
  }

  function quitarCertificado(nombre: string) {
    setCertificados((current) => current.filter((item) => item !== nombre));
  }

  function resetForm() {
    setForm(initial);
    setCertificados([]);
    setEditingId(null);
    if (certificadosInputRef.current) {
      certificadosInputRef.current.value = "";
    }
  }

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/personal/${editingId}` : "/api/personal";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          certificadosArchivo: serializeCertificados(certificados),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No se pudo guardar personal.");
        return;
      }
      if (editingId) {
        setItems((current) =>
          current.map((item) => (item.id === editingId ? data : item))
        );
      } else {
        setItems((current) => [data, ...current]);
      }
      resetForm();
    } catch (err) {
      console.error("Error guardando personal", err);
      setError("Error de conexión.");
    } finally {
      setSaving(false);
    }
  }

  async function eliminar(id: number) {
    if (!confirm("¿Desea eliminar este registro?")) return;

    try {
      const response = await fetch(`/api/personal/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar");
      }

      setItems((current) => current.filter((item) => item.id !== id));
      if (editingId === id) resetForm();
    } catch (error) {
      console.error(error);
      alert("Error eliminando personal");
    }
  }

  function editar(item: Personal) {
    setEditingId(item.id);

    setForm({
      nombres: item.nombres || "",
      cargo: item.cargo || "",
      tipoDocumento: item.tipoDocumento || "",
      documento: item.documento || "",
      celular: item.celular || "",
      cuentaBancaria: item.cuentaBancaria || "",
      cci: item.cci || "",
      banco: item.banco || "",
      yape: item.yape || "",
      fechaNacimiento: item.fechaNacimiento
        ? item.fechaNacimiento.substring(0, 10)
        : "",
      contactoEmergencia: item.contactoEmergencia || "",
      direccion: item.direccion || "",
      cvArchivo: item.cvArchivo || "",
    });
    setCertificados(parseCertificados(item.certificadosArchivo));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-black text-gray-800 flex items-center gap-3">
          <UserPlus className="text-red-600" />
          Personal Qhali Kay
        </h1>
        <p className="text-gray-500 mt-2">Registro del personal que trabaja contigo.</p>
      </div>
      <form
        onSubmit={guardar}
        className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field
            label="Nombre y Apellido *"
            value={form.nombres}
            onChange={(v) => setField("nombres", v)}
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Cargo</span>
            <select
              value={form.cargo}
              onChange={(e) => setField("cargo", e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-red-500 focus:outline-none"
            >
              <option value="">Seleccionar cargo</option>
              {CARGOS.map((cargo) => (
                <option key={cargo} value={cargo}>
                  {cargo}
                </option>
              ))}
            </select>
          </label>
          <Select
            label="Tipo de documento"
            value={form.tipoDocumento}
            onChange={(v) => setField("tipoDocumento", v)}
          />
          <Field
            label="Documento"
            value={form.documento}
            onChange={(v) => setField("documento", v)}
          />
          <Field
            label="Celular *"
            value={form.celular}
            onChange={(v) => setField("celular", v.replace(/\D/g, "").slice(0, 9))}
          />
          <Field
            label="Cuenta Bancaria"
            value={form.cuentaBancaria}
            onChange={(v) => setField("cuentaBancaria", v)}
          />
          <Field label="CCI" value={form.cci} onChange={(v) => setField("cci", v)} />
          <Field label="Banco" value={form.banco} onChange={(v) => setField("banco", v)} />
          <Field
            label="Yape"
            value={form.yape}
            onChange={(v) => setField("yape", v.replace(/\D/g, "").slice(0, 9))}
          />
          <Field
            label="Fecha de nacimiento"
            type="date"
            value={form.fechaNacimiento}
            onChange={(v) => setField("fechaNacimiento", v)}
          />
          <Field
            label="Contacto de emergencia"
            value={form.contactoEmergencia}
            onChange={(v) => setField("contactoEmergencia", v)}
          />
          <Field
            label="Dirección domicilio"
            value={form.direccion}
            onChange={(v) => setField("direccion", v)}
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Adjuntar CV</span>
            <input
              type="file"
              onChange={(e) => setField("cvArchivo", e.target.files?.[0]?.name || "")}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">{form.cvArchivo}</p>
          </label>
          <div className="block md:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">
              Adjuntar certificados
            </span>
            <div className="rounded-2xl border border-gray-200 p-4">
              {certificados.length > 0 ? (
                <ul className="mb-3 space-y-2">
                  {certificados.map((nombre) => (
                    <li
                      key={nombre}
                      className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700"
                    >
                      <span className="truncate">{nombre}</span>
                      <button
                        type="button"
                        onClick={() => quitarCertificado(nombre)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        aria-label={`Quitar ${nombre}`}
                      >
                        <X size={14} />
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-3 text-xs text-gray-400">
                  Aún no hay certificados. Puedes agregar varios.
                </p>
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:border-red-400 hover:text-red-600">
                <Plus size={16} />
                {certificados.length > 0 ? "Agregar más certificados" : "Elegir archivos"}
                <input
                  ref={certificadosInputRef}
                  type="file"
                  multiple
                  onChange={(e) => agregarCertificados(e.target.files)}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            disabled={saving}
            className="rounded-2xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500 disabled:bg-red-300"
          >
            {saving ? "Guardando..." : editingId ? "Actualizar personal" : "Guardar personal"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl border border-gray-200 px-6 py-3 font-bold text-gray-600 hover:bg-gray-50"
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>
      <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-gray-800 mb-5">Personal registrado</h2>
        {items.length === 0 ? (
          <p className="py-8 text-center text-gray-400">No hay personal registrado.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {items.map((item) => {
              const certificadosItem = parseCertificados(item.certificadosArchivo);
              return (
              <div key={item.id} className="rounded-2xl border border-gray-100 p-5">
                <h3 className="font-black text-gray-800">{item.nombres}</h3>
                <p className="text-sm text-red-600 font-semibold">
                  Cargo: {item.cargo || "-"}
                </p>
                <p className="text-sm text-gray-500">
                  {item.tipoDocumento || "Doc"} {item.documento || "-"}
                </p>
                <p className="text-sm text-gray-500">Celular: {item.celular}</p>
                <p className="text-sm text-gray-500">
                  Banco: {item.banco || "-"} / CCI: {item.cci || "-"}
                </p>
                <p className="text-sm text-gray-500">Yape: {item.yape || "-"}</p>
                <p className="text-sm text-gray-500">CV: {item.cvArchivo || "-"}</p>
                <div className="text-sm text-gray-500">
                  <p>Certificados:</p>
                  {certificadosItem.length === 0 ? (
                    <p>-</p>
                  ) : (
                    <ul className="mt-1 list-disc pl-5">
                      {certificadosItem.map((nombre) => (
                        <li key={nombre}>{nombre}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => editar(item)}
                    className="rounded-xl bg-blue-600 px-3 py-2 text-white"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminar(item.id)}
                    className="rounded-xl bg-red-600 px-3 py-2 text-white"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-red-500 focus:outline-none"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm"
      >
        <option value="">Seleccionar</option>
        <option>DNI</option>
        <option>RUC</option>
        <option>Pasaporte</option>
        <option>Carnet de Extranjería</option>
      </select>
    </label>
  );
}
