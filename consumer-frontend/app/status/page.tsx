import StatusChecker from '@/components/StatusChecker';

export default function StatusPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Transaction Status</h1>
        <p className="text-gray-600 mb-8">
          Check the status of your form submission by entering the transaction ID.
        </p>
        <StatusChecker />
      </div>
    </main>
  );
}
