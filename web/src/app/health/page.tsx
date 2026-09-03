export default async function HealthPage() {
  // Fetching dummy check data to verify dynamic SSR data-fetching
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">System Health Check</h1>
      <div className="p-4 border border-emerald-900/50 bg-emerald-950/20 rounded-lg max-w-md">
        <p className="text-sm font-medium text-emerald-400">Status: Operational (200 OK)</p>
        <p className="text-xs text-slate-400 mt-2">Fetched Data Payload:</p>
        <pre className="text-xs bg-slate-900 p-2 rounded mt-1 overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
