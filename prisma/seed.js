/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de la base de datos...");

  // Limpiar base de datos
  await prisma.servicio.deleteMany();
  await prisma.emergencia.deleteMany();
  await prisma.paciente.deleteMany();
  await prisma.ambulancia.deleteMany();

  console.log("Limpieza completada.");

  // Crear Ambulancias
  await prisma.ambulancia.create({
    data: {
      placa: "EUA-102",
      modelo: "Toyota Hiace 2024",
      tipo: "Tipo II (Soporte Vital Básico)",
      estado: "Disponible",
    },
  });

  await prisma.ambulancia.create({
    data: {
      placa: "EUB-405",
      modelo: "Mercedes-Benz Sprinter 2025",
      tipo: "SAMU (Soporte Vital Avanzado)",
      estado: "En Servicio",
    },
  });

  await prisma.ambulancia.create({
    data: {
      placa: "EUC-882",
      modelo: "Hyundai H350 2023",
      tipo: "Tipo III (Unidad de Cuidados Intensivos)",
      estado: "Mantenimiento",
    },
  });

  await prisma.ambulancia.create({
    data: {
      placa: "EUD-311",
      modelo: "Nissan Urvan 2024",
      tipo: "Tipo I (Traslado Simple)",
      estado: "Disponible",
    },
  });

  console.log("Ambulancias creadas con éxito.");

  // Crear Pacientes
  await prisma.paciente.create({
    data: {
      nombres: "Juan Pérez Delgado",
      tipoDocumento: "DNI",
      numeroDocumento: "45871236",
      telefono: "987654321",
      direccion: "Av. Las Gaviotas 123, Chorrillos",
    },
  });

  await prisma.paciente.create({
    data: {
      nombres: "María Rodríguez Quispe",
      tipoDocumento: "DNI",
      numeroDocumento: "70125896",
      telefono: "912345678",
      direccion: "Jr. Los Jazmines 456, Surco",
    },
  });

  await prisma.paciente.create({
    data: {
      nombres: "Carlos García Montes",
      tipoDocumento: "CE",
      numeroDocumento: "001254789",
      telefono: "998877665",
      direccion: "Av. Larco 789, Miraflores",
    },
  });

  console.log("Pacientes creados con éxito.");

  // Crear Emergencias
  await prisma.emergencia.create({
    data: {
      paciente: "Juan Pérez Delgado",
      prioridad: "Alta",
      estado: "Atendido",
      ubicacion: "Av. Las Gaviotas 123, Chorrillos",
      ambulancia: "EUA-102",
    },
  });

  await prisma.emergencia.create({
    data: {
      paciente: "Pedro Infante Loli",
      prioridad: "Crítica",
      estado: "En Curso",
      ubicacion: "Av. Salaverry 1500, Jesús María",
      ambulancia: "EUB-405",
    },
  });

  console.log("Emergencias creadas con éxito.");

  // Crear Servicios (destinos debe guardarse como string JSON en SQLite)
  await prisma.servicio.create({
    data: {
      paciente: "María Rodríguez Quispe",
      edad: 68,
      peso: 62,
      tipoServicio: "Traslado",
      origen: "Jr. Los Jazmines 456, Surco",
      referencia: "Frente al parque principal",
      destinos: JSON.stringify(["Clínica Delgado, Miraflores"]),
      esIdaYVuelta: false,
      diagnostico: "Post-operatorio de cadera",
      enfermedadFondo: "Hipertensión controlada",
      sintomas: "Dolor moderado en zona de sutura",
      tratamientoActual: "Analgésicos prescritos",
      requiereOxigeno: "No",
      prioridad: "Media",
      ambulancia: "EUD-311",
      observaciones: "Paciente en camilla, requiere asistencia para bajar escaleras.",
      contacto: "Laura Rodríguez (Hija)",
      telefono: "912345678",
      email: "laura.rod@gmail.com",
      costo: 350.0,
      metodoPago: "Transferencia",
      estado: "Completado",
      fechaHora: new Date(),
      notas: "Servicio culminado sin percances.",
    },
  });

  await prisma.servicio.create({
    data: {
      paciente: "Carlos García Montes",
      edad: 45,
      peso: 80,
      tipoServicio: "Traslado",
      origen: "Av. Larco 789, Miraflores",
      referencia: "Cerca al óvalo de Miraflores",
      destinos: JSON.stringify(["Hospital Rebagliati, Jesús María", "Av. Larco 789, Miraflores"]),
      esIdaYVuelta: true,
      diagnostico: "Insuficiencia renal crónica",
      enfermedadFondo: "Diabetes Tipo 2",
      sintomas: "Fatiga general",
      tratamientoActual: "Sesión de hemodiálisis",
      requiereOxigeno: "Si",
      litrosOxigeno: 3,
      prioridad: "Alta",
      ambulancia: "EUA-102",
      observaciones: "Paciente viaja sentado. Lleva cilindro de oxígeno propio pero requiere soporte del equipo.",
      contacto: "Carlos García (Titular)",
      telefono: "998877665",
      email: "carlos.garcia@outlook.com",
      costo: 480.0,
      metodoPago: "Tarjeta",
      estado: "En Curso",
      fechaHora: new Date(),
      notas: "Traslado de ida en progreso hacia el hospital.",
    },
  });

  await prisma.servicio.create({
    data: {
      paciente: "Empresa Eventos S.A.",
      tipoServicio: "Evento",
      origen: "Explanada del Estadio Monumental, Ate",
      referencia: "Puerta de ingreso vehicular N° 4",
      destinos: JSON.stringify(["Explanada del Estadio Monumental"]),
      esIdaYVuelta: false,
      prioridad: "Baja",
      ambulancia: "EUD-311",
      observaciones: "Cobertura médica para concierto musical. 1 Ambulancia Tipo I de retén por 8 horas.",
      contacto: "Martín Rivas (Organizador)",
      telefono: "945123789",
      email: "mrivas@eventos.pe",
      costo: 1200.0,
      metodoPago: "Transferencia",
      estado: "Confirmado",
      fechaHora: new Date(Date.now() + 86400000), // Mañana
      notas: "Servicio cotizado y pagado al 100%. Despachar a las 15:00 hrs.",
    },
  });

  console.log("Servicios creados con éxito.");
  console.log("Seed completado de manera exitosa! 🌱");
}

main()
  .catch((e) => {
    console.error("Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
