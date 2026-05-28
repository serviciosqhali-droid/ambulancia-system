import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = "then" in params ? await params : params;
    const id = Number(resolvedParams.id);
    const body = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const data: any = {};
    if (body.placa !== undefined) data.placa = body.placa.trim().toUpperCase();
    if (body.modelo !== undefined) data.modelo = body.modelo.trim();
    if (body.tipo !== undefined) data.tipo = body.tipo.trim();
    if (body.estado !== undefined) data.estado = body.estado;

    const ambulanciaActualizada = await prisma.ambulancia.update({
      where: { id },
      data,
    });

    return NextResponse.json(ambulanciaActualizada);
  } catch (error: any) {
    console.error("Error actualizando ambulancia:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Ambulancia no encontrada" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Error al actualizar la ambulancia" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = "then" in params ? await params : params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.ambulancia.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Ambulancia eliminada con éxito" });
  } catch (error: any) {
    console.error("Error eliminando ambulancia:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Ambulancia no encontrada" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Error al eliminar la ambulancia" },
      { status: 500 }
    );
  }
}
