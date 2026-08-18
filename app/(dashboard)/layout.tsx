import DashboardLayout from "@/components/Layout/DashboardLayout";

export default function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
