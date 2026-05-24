import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const pacientes = await prisma.paciente.findMany();

  return Response.json(pacientes);
}

export async function POST(request: Request) {
  const body = await request.json();

  const nuevoPaciente = await prisma.paciente.create({
    data: {
      nombres: body.nombres,
      tipoDocumento: body.tipoDocumento,
      numeroDocumento: body.numeroDocumento,
      telefono: body.telefono,
      direccion: body.direccion,
    },
  });

  return Response.json(nuevoPaciente);
}