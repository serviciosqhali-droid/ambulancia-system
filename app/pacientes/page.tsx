import DashboardLayout from "@/components/Layout/DashboardLayout";
import PacientesClient from "@/components/PacientesClient";

export default function PacientesPage() {
  return (
    <DashboardLayout>
      <PacientesClient />
    </DashboardLayout>
  );
}
