import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-red-600">Error 404</p>
        <h1 className="mt-2 text-3xl font-black text-gray-800">Página no encontrada</h1>
        <p className="mt-3 text-sm text-gray-500">
          Si esto aparece en todos los módulos, detén el servidor, ejecuta{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">npm run fresh</code>{" "}
          y vuelve a entrar.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-500"
          >
            Ir al Dashboard
          </Link>
          <Link
            href="/pacientes"
            className="rounded-2xl border border-gray-200 px-5 py-3 font-bold text-gray-700 hover:bg-gray-50"
          >
            Ir a Pacientes
          </Link>
          <Link
            href="/servicios"
            className="rounded-2xl border border-gray-200 px-5 py-3 font-bold text-gray-700 hover:bg-gray-50"
          >
            Ir a Servicios
          </Link>
        </div>
      </div>
    </main>
  );
}
