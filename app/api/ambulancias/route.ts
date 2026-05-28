import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const ambulancias = await prisma.ambulancia.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(ambulancias);
  } catch (error) {
    console.error("Error obteniendo ambulancias:", error);
    return NextResponse.json(
      { error: "Error al obtener ambulancias" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.placa || !body.modelo || !body.tipo) {
      return NextResponse.json(
        { error: "La placa, modelo y tipo son campos obligatorios" },
        { status: 400 }
      );
    }

    const nuevaAmbulancia = await prisma.ambulancia.create({
      data: {
        placa: body.placa.trim().toUpperCase(),
        modelo: body.modelo.trim(),
        tipo: body.tipo.trim(),
        estado: body.estado || "Disponible",
      },
    });

    return NextResponse.json(nuevaAmbulancia, { status: 201 });
  } catch (error: any) {
    console.error("Error registrando ambulancia:", error);
    
    // Controlar duplicado de placa
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una ambulancia registrada con esa placa" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al guardar la ambulancia" },
      { status: 500 }
    );
  }
}
