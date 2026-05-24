interface StatCardProps {
  title: string;
  value: string;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">

      <p className="text-gray-500">
        {title}
      </p>

      <h3 className="text-4xl font-bold mt-4">
        {value}
      </h3>

    </div>
  );
}