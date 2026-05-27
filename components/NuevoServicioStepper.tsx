interface Props {
  pasoActual: number;
}

export default function NuevoServicioStepper({
  pasoActual,
}: Props) {

  const pasos = [
    "Tipo servicio",
    "Paciente",
    "Direcciones",
    "Médico",
    "Contacto",
  ];

  return (

    <div className="flex items-center gap-4 mt-10 mb-10 flex-wrap">

      {pasos.map((paso, index) => {

        const numero = index + 1;

        const activo = numero === pasoActual;

        const completado = numero < pasoActual;

        return (

          <div
            key={numero}
            className="flex items-center gap-3"
          >

            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${activo ? "bg-red-600 text-white" : ""}
                ${completado ? "bg-green-500 text-white" : ""}
                ${!activo && !completado ? "bg-gray-200 text-gray-500" : ""}
              `}
            >
              {numero}
            </div>

            <span
              className={`
                text-sm font-medium
                ${activo ? "text-red-600" : "text-gray-500"}
              `}
            >
              {paso}
            </span>

          </div>
        );
      })}

    </div>
  );
}