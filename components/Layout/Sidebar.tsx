"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Ambulance,
  Users,
  Siren,
  Truck,
  BriefcaseMedical,
  Database,
  UserRoundCog,
  UserPlus,
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: Siren, exact: true },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/servicios", label: "Servicios", icon: BriefcaseMedical },
  { href: "/base-datos", label: "Base de datos", icon: Database },
  { href: "/ambulancias", label: "Ambulancias", icon: Truck },
  { href: "/tripulaciones", label: "Tripulación diaria", icon: UserRoundCog },
  { href: "/personal", label: "Personal Qhali Kay", icon: UserPlus },
] as const;

function isActivePath(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-red-700 text-white p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-10">
        <Ambulance size={40} />

        <div>
          <h1 className="text-2xl font-bold">Qhali Kay</h1>
          <p className="text-sm text-red-100">Sistema Médico</p>
        </div>
      </div>

      <nav className="space-y-3">
        {links.map(({ href, label, icon: Icon, ...rest }) => {
          const exact = "exact" in rest && rest.exact;
          const active = isActivePath(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              prefetch
              aria-current={active ? "page" : undefined}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition outline-none ${
                active
                  ? "bg-red-500 font-semibold shadow-sm"
                  : "hover:bg-red-600/70 focus-visible:ring-2 focus-visible:ring-white/70"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
