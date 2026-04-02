import ServiceGrid from '@/components/ServiceGrid'

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-4">API Gateway Consumer Services</h1>
        <p className="text-gray-700">
          Choose from the available services below to get started with your application.
        </p>
      </div>
      <ServiceGrid />
    </main>
  )
}
