import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex bg-gray-100">

      <Sidebar />

      <section className="flex-1 p-10">
        {children}
      </section>

    </main>
  );
}