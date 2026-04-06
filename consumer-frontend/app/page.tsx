import Link from 'next/link'
import { CreditCard, Car, CreditCard as PassportIcon, Shield, Zap, Users } from 'lucide-react'

const quickServices = [
  {
    icon: CreditCard,
    name: 'PAN Application',
    description: 'Apply for Permanent Account Number',
    href: '/services',
  },
  {
    icon: PassportIcon,
    name: 'Passport Services',
    description: 'Apply for passport services',
    href: '/services',
  },
  {
    icon: Car,
    name: 'Driving License',
    description: 'Apply for driving license',
    href: '/services',
  },
]

const features = [
  {
    icon: Shield,
    title: 'Secure & Verified',
    description: 'All services are secured with end-to-end encryption and verified authentication.',
  },
  {
    icon: Zap,
    title: 'Fast Processing',
    description: 'Quick turnaround times with real-time status tracking for all applications.',
  },
  {
    icon: Users,
    title: 'Easy to Use',
    description: 'Simple, guided process to complete your government service applications.',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Government Services<br />Made Simple
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
          Access all government services through our unified digital platform. Fast,
          secure, and user-friendly interface for all your government needs.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/services"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
          >
            Explore Services →
          </Link>
          <Link
            href="#why"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 font-medium transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Quick Access</h2>
          <p className="text-gray-500 mt-1">Popular services at your fingertips</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickServices.map((svc) => {
            const Icon = svc.icon
            return (
              <div key={svc.name} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{svc.name}</h3>
                </div>
                <p className="text-gray-500 text-sm mb-4">{svc.description}</p>
                <Link
                  href={svc.href}
                  className="w-full block text-center border border-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* Why Choose */}
      <section id="why" className="py-12 border-t border-gray-100 mt-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Why Choose Our Platform?</h2>
          <p className="text-gray-500 mt-1">Built for simplicity, security, and speed</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.description}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
