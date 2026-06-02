"use client";

import { type FormEvent, useEffect, useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { UserPlus } from "lucide-react";

type Personal = { id: number; nombres: string; tipoDocumento: string | null; documento: string | null; celular: string; cuentaBancaria: string | null; cci: string | null; banco: string | null; yape: string | null; fechaNacimiento: string | null; contactoEmergencia: string | null; direccion: string | null; cvArchivo: string | null; certificadosArchivo: string | null };

const initial = { nombres: "", tipoDocumento: "", documento: "", celular: "", cuentaBancaria: "", cci: "", banco: "", yape: "", fechaNacimiento: "", contactoEmergencia: "", direccion: "", cvArchivo: "", certificadosArchivo: "" };

export default function PersonalPage() {
  const [items, setItems] = useState<Personal[]>([]);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/personal").then((response) => response.ok ? response.json() : []).then(setItems).catch((err) => console.error("Error cargando personal", err));
  }, []);

  function setField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function guardar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/personal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "No se pudo guardar personal."); return; }
      setItems((current) => [data, ...current]);
      setForm(initial);
    } catch (err) {
      console.error("Error guardando personal", err);
      setError("Error de conexión.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <div><h1 className="text-4xl font-black text-gray-800 flex items-center gap-3"><UserPlus className="text-red-600" />Personal Qhali Kay</h1><p className="text-gray-500 mt-2">Registro del personal que trabaja contigo.</p></div>
      <form onSubmit={guardar} className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Nombre y Apellido *" value={form.nombres} onChange={(v) => setField("nombres", v)} />
          <Select label="Tipo de documento" value={form.tipoDocumento} onChange={(v) => setField("tipoDocumento", v)} />
          <Field label="Documento" value={form.documento} onChange={(v) => setField("documento", v)} />
          <Field label="Celular *" value={form.celular} onChange={(v) => setField("celular", v.replace(/\D/g, "").slice(0, 9))} />
          <Field label="Cuenta Bancaria" value={form.cuentaBancaria} onChange={(v) => setField("cuentaBancaria", v)} />
          <Field label="CCI" value={form.cci} onChange={(v) => setField("cci", v)} />
          <Field label="Banco" value={form.banco} onChange={(v) => setField("banco", v)} />
          <Field label="Yape" value={form.yape} onChange={(v) => setField("yape", v.replace(/\D/g, "").slice(0, 9))} />
          <Field label="Fecha de nacimiento" type="date" value={form.fechaNacimiento} onChange={(v) => setField("fechaNacimiento", v)} />
          <Field label="Contacto de emergencia" value={form.contactoEmergencia} onChange={(v) => setField("contactoEmergencia", v)} />
          <Field label="Dirección domicilio" value={form.direccion} onChange={(v) => setField("direccion", v)} />
          <label className="block"><span className="mb-1.5 block text-sm font-semibold text-gray-700">Adjuntar CV</span><input type="file" onChange={(e) => setField("cvArchivo", e.target.files?.[0]?.name || "")} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm" /><p className="text-xs text-gray-400 mt-1">{form.cvArchivo}</p></label>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold text-gray-700">Adjuntar certificados</span><input type="file" multiple onChange={(e) => setField("certificadosArchivo", Array.from(e.target.files || []).map((file) => file.name).join(" / "))} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm" /><p className="text-xs text-gray-400 mt-1">{form.certificadosArchivo}</p></label>
        </div>
        <button disabled={saving} className="mt-6 rounded-2xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500 disabled:bg-red-300">{saving ? "Guardando..." : "Guardar personal"}</button>
      </form>
      <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black text-gray-800 mb-5">Personal registrado</h2>{items.length === 0 ? <p className="py-8 text-center text-gray-400">No hay personal registrado.</p> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{items.map((item) => <div key={item.id} className="rounded-2xl border border-gray-100 p-5"><h3 className="font-black text-gray-800">{item.nombres}</h3><p className="text-sm text-gray-500">{item.tipoDocumento || "Doc"} {item.documento || "-"}</p><p className="text-sm text-gray-500">Celular: {item.celular}</p><p className="text-sm text-gray-500">Banco: {item.banco || "-"} / CCI: {item.cci || "-"}</p><p className="text-sm text-gray-500">Yape: {item.yape || "-"}</p><p className="text-sm text-gray-500">CV: {item.cvArchivo || "-"}</p><p className="text-sm text-gray-500">Certificados: {item.certificadosArchivo || "-"}</p></div>)}</div>}</div>
    </DashboardLayout>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { return <label className="block"><span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-red-500 focus:outline-none" /></label>; }
function Select({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block"><span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm"><option value="">Seleccionar</option><option>DNI</option><option>RUC</option><option>Pasaporte</option><option>Carnet de Extranjería</option></select></label>; }
