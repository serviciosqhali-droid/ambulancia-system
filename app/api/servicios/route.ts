
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {

  try {

    const body = await request.json();

    const nuevoServicio =
      await prisma.servicio.create({

        data: {

          paciente:
            body.paciente,

          tipoServicio:
            body.tipoServicio,

          origen:
            body.origen,

          destino:
            body.destinos,

          prioridad:
            body.prioridad,

          ambulancia:
            body.ambulancia,

          observaciones:
            body.observaciones,

          contacto:
            body.contacto,

          telefono:
            body.telefono,

          email:
            body.email,

          costo:
            Number(body.costo),

          metodoPago:
            body.metodoPago,

          estado:
            body.estado,

          fechaHora:
            body.fechaHora
              ? new Date(body.fechaHora)
              : null,

          notas:
            body.notas,

        },

      });

    return NextResponse.json(
      nuevoServicio
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Error guardando servicio",
      },
      {
        status: 500,
      }
    );
  }
}

