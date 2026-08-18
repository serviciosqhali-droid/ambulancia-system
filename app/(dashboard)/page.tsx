import DashboardCards from "@/components/DashboardCards";

export default function HomePage() {
  return (
    <>
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Dashboard Ambulancia</h1>
        <p className="text-gray-500 mt-2">Centro de operaciones médicas</p>
      </div>
      <DashboardCards />
    </>
  );
}
