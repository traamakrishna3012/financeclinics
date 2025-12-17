import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { servicesApi, Service } from '../api'
import { 
  ArrowTrendingUpIcon, 
  ScissorsIcon, 
  CircleStackIcon, 
  Cog6ToothIcon, 
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

// Static services data with full content
const staticServices = [
  {
    id: 1,
    title: 'Fundraising & Capital Advisory',
    slug: 'fundraising',
    short_description: 'End-to-end fundraising support including investor relations, pitch preparation, and capital structuring for healthcare ventures.',
    icon: 'chart-line',
    features: [
      'Investor identification & outreach',
      'Pitch deck preparation',
      'Financial modeling & valuation',
      'Due diligence support',
      'Term sheet negotiation',
      'Capital structure optimization'
    ]
  },
  {
    id: 2,
    title: 'Cost Optimization',
    slug: 'cost-optimization',
    short_description: 'Comprehensive cost analysis and optimization strategies to improve operational efficiency and reduce unnecessary expenses.',
    icon: 'scissors',
    features: [
      'Operational cost analysis',
      'Vendor contract negotiation',
      'Supply chain optimization',
      'Workforce efficiency review',
      'Technology cost reduction',
      'Energy & facility savings'
    ]
  },
  {
    id: 3,
    title: 'MIS & Data Analysis',
    slug: 'mis-data-analysis',
    short_description: 'Management Information Systems setup and advanced data analytics to drive informed decision-making.',
    icon: 'database',
    features: [
      'Dashboard development',
      'KPI tracking & reporting',
      'Financial data integration',
      'Predictive analytics',
      'Custom report generation',
      'Real-time monitoring'
    ]
  },
  {
    id: 4,
    title: 'Financial Process Optimization',
    slug: 'process-optimization',
    short_description: 'Streamline financial workflows, implement best practices, and automate processes for maximum efficiency.',
    icon: 'cogs',
    features: [
      'Workflow automation',
      'Process re-engineering',
      'ERP implementation support',
      'Internal controls setup',
      'Compliance framework',
      'Documentation & SOPs'
    ]
  },
  {
    id: 5,
    title: 'Strategic Financial Planning',
    slug: 'strategic-planning',
    short_description: "Long-term financial roadmaps aligned with your healthcare organization's growth objectives and market dynamics.",
    icon: 'chart-bar',
    features: [
      'Multi-year financial projections',
      'Scenario planning & analysis',
      'Growth strategy development',
      'Market expansion planning',
      'Risk assessment & mitigation',
      'Board-level reporting'
    ]
  },
]

const getServiceIcon = (icon: string) => {
  const iconClass = "w-7 h-7"
  switch (icon) {
    case 'chart-line':
      return <ArrowTrendingUpIcon className={iconClass} />
    case 'scissors':
      return <ScissorsIcon className={iconClass} />
    case 'database':
      return <CircleStackIcon className={iconClass} />
    case 'cogs':
      return <Cog6ToothIcon className={iconClass} />
    case 'chart-bar':
      return <ChartBarIcon className={iconClass} />
    default:
      return <ChartBarIcon className={iconClass} />
  }
}

export default function Services() {
  const [services, setServices] = useState<Service[]>(staticServices as unknown as Service[])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    servicesApi.getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setServices(data)
        }
      })
      .catch(() => {
        // Keep using static services if API fails - silent fallback
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet>
        <title>Our Services - FinanceClinics</title>
        <meta name="description" content="Explore our comprehensive financial advisory services for healthcare providers including fundraising, cost optimization, MIS & data analysis, and more." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our <span className="text-primary-600">Services</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Comprehensive financial solutions designed specifically for healthcare organizations. From fundraising to cost optimization, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center">
              <div className="spinner w-8 h-8 text-primary-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300"
                >
                  {/* Service Icon */}
                  <div className="w-12 h-12 mb-5 rounded-xl bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white">
                      {getServiceIcon(service.icon || 'default')}
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.short_description}</p>
                  
                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <span className="inline-flex items-center text-blue-600 text-sm font-medium mt-2">
                    Learn more
                    <ArrowRightIcon className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-white mb-6">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Schedule a free consultation and we'll help you identify the best solutions for your organization.
          </p>
          <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all">
            Schedule Free Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
