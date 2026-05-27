import prisma from "@/lib/prisma";
import DashboardLayout from "@/components/Layout/DashboardLayout";

export default async function ServiciosPage() {

const servicios = await prisma.servicio.findMany({
  orderBy: {
    createdAt: "desc",
  },
});

  return (

    <DashboardLayout>

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-gray-800">
            Servicios
          </h1>

          <p className="text-gray-500 mt-2">
            Gestión de todos los servicios registrados
          </p>

        </div>

        <button
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl"
        >
          Nuevo Servicio
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            Total servicios
          </p>

          <h2 className="text-4xl font-bold mt-4">
            5
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            En curso
          </p>

          <h2 className="text-4xl font-bold mt-4 text-orange-500">
            1
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            activos ahora
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            Traslados
          </p>

          <h2 className="text-4xl font-bold mt-4">
            3
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <p className="text-gray-500">
            Ingresos
          </p>

          <h2 className="text-4xl font-bold mt-4 text-green-600">
            S/. 2,030
          </h2>

        </div>

      </div>

      <div className="bg-white rounded-2xl shadow p-6 mt-10">

        <div className="flex flex-col md:flex-row gap-4 justify-between">

          <input
            type="text"
            placeholder="Buscar por paciente, evento, ID o contacto..."
            className="border border-gray-300 rounded-xl px-4 py-3 w-full md:w-[400px]"
          />

          <div className="flex gap-4">

            <button
              className="border border-gray-300 px-4 py-3 rounded-xl"
            >
              Filtros
            </button>

            <select
              className="border border-gray-300 rounded-xl px-4 py-3"
            >
              <option>Fecha</option>
              <option>Costo</option>
              <option>ID</option>
            </select>

          </div>

        </div>

        <p className="text-gray-500 mt-6">
          5 servicios encontrados
        </p>

        <div className="space-y-6 mt-8">

          {servicios.map((servicio: any) => (

            <div key={servicio.id} 
            className="bg-white border border-gray-200 rounded-2xl p-6" > 
            <div className="flex items-start justify-between"> 
                <div className="flex gap-4"> 
                    <div className="bg-orange-100 p-3 rounded-2xl"> 🚑 
                        </div> 
                        <div> 
                            <div className="flex items-center gap-3 flex-wrap"> 
                                <h2 className="text-2xl font-bold text-gray-800"> 
                                    {servicio.paciente} </h2> 
                                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"> 
                                        {servicio.tipoServicio} </span> 
                                        <span className={` px-3 py-1 rounded-full text-sm ${ 
                                        servicio.estado === "En Curso" ? "bg-yellow-100 text-yellow-700" : 
                                        servicio.estado === "Confirmado" ? "bg-blue-100 text-blue-700" : 
                                        servicio.estado === "Completado" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700" } `} > 
                                        {servicio.estado} 
                                        </span> </div> 
                                        <p className="text-gray-500 mt-3"> Recojo: 
                                            {servicio.origen} </p> 
                                            <div className="flex flex-wrap gap-6 mt-5 text-sm text-gray-500"> 
                                                <span> SRV-{servicio.id} </span> 
                                                <span> 👤 {servicio.contacto} </span> 
                                                <span> 📞 {servicio.telefono} </span> 
                                                <span> 📍 {servicio.destino} </span> 
                                                </div> 
                                                </div> 
                                                </div> 
                                                <div className="flex flex-col items-end"> 
                                                    <div className="text-right"> 
                                                        <p className="text-2xl font-bold text-green-600"> S/. {servicio.costo} 
                                                            </p> 
                                                        <p className="text-sm text-gray-500 mt-2"> 
                                                            { new Date( servicio.createdAt ).toLocaleDateString() } 
                                                            </p> 
                                                            </div> <div className="flex gap-3 mt-6"> 
                                                                <button className="border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100" >
                                                                    👁 Ver </button> 
                                                                <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl" > ✏️ Editar 
                                                                    </button> 
                                                                    </div> 
                                                                    </div> 
                                                                    </div> 
                                                                    </div>       

          ))}

        </div>

      </div>

    </DashboardLayout>

  );
}