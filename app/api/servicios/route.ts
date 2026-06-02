import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const destinos = Array.isArray(body.destinos)
      ? body.destinos.filter((destino: unknown) => typeof destino === "string" && destino.trim())
      : [];
    const costo = Number(body.costo);

    if (
      !body.paciente?.trim() ||
      !body.tipoServicio?.trim() ||
      !body.origen?.trim() ||
      destinos.length === 0 ||
      !Number.isFinite(costo) ||
      costo < 0
    ) {
      return NextResponse.json(
        { error: "Los campos paciente, tipo de servicio, origen, destinos y costo válido son obligatorios." },
        { status: 400 }
      );
    }

    // --- AUTOCREACIÓN DE PACIENTE ---
    const pacienteNombre = body.paciente.trim();
    
    // Solo aplica para personas naturales, no para empresas de eventos
    if (body.tipoServicio === "Traslado") {
      const pacienteExistente = await prisma.paciente.findFirst({
        where: {
          nombres: {
            equals: pacienteNombre,
          },
        },
      });

      if (!pacienteExistente) {
        console.log(`Paciente no encontrado. Creando paciente: "${pacienteNombre}" de forma automática.`);
        
        // Generar un número de documento DNI aleatorio y único de 8 dígitos para satisfacer el @unique
        let dniUnico = false;
        let dniGenerado = "";
        
        while (!dniUnico) {
          dniGenerado = String(Math.floor(10000000 + Math.random() * 90000000));
          const dniCheck = await prisma.paciente.findUnique({
            where: { numeroDocumento: dniGenerado },
          });
          if (!dniCheck) {
            dniUnico = true;
          }
        }

        await prisma.paciente.create({
          data: {
            nombres: pacienteNombre,
            tipoDocumento: "DNI",
            numeroDocumento: dniGenerado,
            telefono: body.telefono ? body.telefono.split(" / ")[0] : "999999999",
            direccion: body.origen,
          },
        });
        console.log(`Paciente creado automáticamente con DNI ${dniGenerado}.`);
      }
    }

    // --- REGISTRO DEL SERVICIO ---
    // En SQLite, destinos se guarda como String. Guardamos la representación JSON stringificada.
    const destinosString = JSON.stringify(destinos);

    if (body.ambulancia && body.estado === "En Curso") {
      const amb = await prisma.ambulancia.findUnique({
        where: { placa: body.ambulancia },
      });

      if (!amb) {
        return NextResponse.json(
          { error: "La ambulancia seleccionada no existe." },
          { status: 400 }
        );
      }

      if (amb.estado !== "Disponible") {
        return NextResponse.json(
          { error: "La ambulancia seleccionada no está disponible para iniciar el servicio." },
          { status: 409 }
        );
      }
    }

    const nuevoServicio = await prisma.servicio.create({
      data: {
        paciente: pacienteNombre,
        edad: body.edad ? Number(body.edad) : null,
        peso: body.peso ? Number(body.peso) : null,
        tipoServicio: body.tipoServicio,
        origen: body.origen.trim(),
        referencia: body.referencia ? body.referencia.trim() : null,
        destinos: destinosString,
        esIdaYVuelta: body.esIdaYVuelta || false,
        diagnostico: body.diagnostico ? body.diagnostico.trim() : null,
        enfermedadFondo: body.enfermedadFondo ? body.enfermedadFondo.trim() : null,
        sintomas: body.sintomas ? body.sintomas.trim() : null,
        tratamientoActual: body.tratamientoActual ? body.tratamientoActual.trim() : null,
        requiereOxigeno: body.requiereOxigeno || "No",
        litrosOxigeno: body.litrosOxigeno ? Number(body.litrosOxigeno) : null,
        prioridad: body.prioridad || "Alta",
        ambulancia: body.ambulancia || null,
        observaciones: body.observaciones ? body.observaciones.trim() : null,
        contacto: body.contacto ? body.contacto.trim() : null,
        telefono: body.telefono ? body.telefono.trim() : null,
        email: body.email ? body.email.trim() : null,
        costo,
        metodoPago: body.metodoPago || "Yape",
        estado: body.estado || "Cotización",
        fechaHora: body.fechaHora ? new Date(body.fechaHora) : null,
        direccionEvento: body.direccionEvento ? body.direccionEvento.trim() : null,
        descuento: body.descuento ? Number(body.descuento) : 0,
        notas: body.notas ? body.notas.trim() : null,
      },
    });

    // Cambiar estado de la ambulancia asignada a "En Servicio" si el estado del servicio es "En Curso"
    if (body.ambulancia && body.estado === "En Curso") {
      try {
        const amb = await prisma.ambulancia.findUnique({
          where: { placa: body.ambulancia },
        });
        if (amb) {
          await prisma.ambulancia.update({
            where: { id: amb.id },
            data: { estado: "En Servicio" },
          });
          console.log(`Estado de ambulancia ${body.ambulancia} cambiado a En Servicio.`);
        }
      } catch (e) {
        console.error("Error al actualizar estado de ambulancia asignada:", e);
      }
    }

    return NextResponse.json(nuevoServicio, { status: 201 });
  } catch (error) {
    console.error("Error guardando servicio:", error);
    return NextResponse.json(
      { error: "Error interno al guardar el servicio médico." },
      { status: 500 }
    );
  }
}
