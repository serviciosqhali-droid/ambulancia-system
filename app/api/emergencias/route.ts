import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {

  const emergencias = await prisma.emergencia.findMany();

  return Response.json(emergencias);
}

export async function POST(request: Request) {

  const body = await request.json();

  const nuevaEmergencia = await prisma.emergencia.create({
    data: {
      paciente: body.paciente,
      prioridad: body.prioridad,
      estado: body.estado,
      ubicacion: body.ubicacion,
      ambulancia: body.ambulancia,
    },
  });

  return Response.json(nuevaEmergencia);
}