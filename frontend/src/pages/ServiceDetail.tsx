import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { servicesApi } from '../api'
import { 
  ArrowTrendingUpIcon, 
  ScissorsIcon, 
  CircleStackIcon, 
  Cog6ToothIcon, 
  ChartBarIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  PhoneIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

// Full service data with detailed descriptions
const serviceData: Record<string, any> = {
  'fundraising': {
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
    ],
    description: `
      <h2>Transform Your Healthcare Vision Into Reality</h2>
      <p>Securing funding for healthcare ventures requires specialized expertise and deep industry connections. Our Fundraising & Capital Advisory service provides comprehensive support throughout your capital-raising journey.</p>
      
      <h3>Our Approach</h3>
      <p>We understand that healthcare organizations have unique funding needs. Whether you're a hospital seeking expansion capital, a healthcare startup looking for seed funding, or an established practice planning an acquisition, we tailor our approach to your specific situation.</p>
      
      <h3>What We Deliver</h3>
      <ul>
        <li><strong>Investor Strategy:</strong> We identify and connect you with the right investors who understand healthcare - from venture capital firms specializing in health tech to private equity groups focused on healthcare services.</li>
        <li><strong>Compelling Materials:</strong> Our team creates investor-ready pitch decks, financial models, and supporting documentation that clearly communicate your value proposition.</li>
        <li><strong>Valuation Expertise:</strong> We provide accurate valuations using healthcare-specific methodologies and comparable transaction analysis.</li>
        <li><strong>Negotiation Support:</strong> From initial conversations to term sheet negotiations, we advocate for terms that protect your interests while appealing to investors.</li>
      </ul>
      
      <h3>Track Record</h3>
      <p>We've helped healthcare organizations raise over $50 million in funding across various stages and structures, including equity rounds, debt financing, and hybrid instruments.</p>
    `,
    benefits: [
      'Access to healthcare-focused investor network',
      'Professional-grade pitch materials',
      'Faster time to funding',
      'Better terms through expert negotiation',
      'Ongoing advisory support'
    ]
  },
  'cost-optimization': {
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
    ],
    description: `
      <h2>Maximize Value While Maintaining Quality Care</h2>
      <p>Healthcare organizations face constant pressure to reduce costs while maintaining or improving quality of care. Our Cost Optimization service helps you identify savings opportunities without compromising patient outcomes.</p>
      
      <h3>Comprehensive Analysis</h3>
      <p>We conduct a thorough review of your organization's cost structure, examining every department and process to identify inefficiencies and savings opportunities.</p>
      
      <h3>Key Focus Areas</h3>
      <ul>
        <li><strong>Supply Chain:</strong> Optimize procurement, reduce inventory costs, and negotiate better vendor contracts for medical supplies and equipment.</li>
        <li><strong>Labor Efficiency:</strong> Analyze staffing patterns, reduce overtime costs, and improve scheduling efficiency while maintaining care quality.</li>
        <li><strong>Technology Spend:</strong> Evaluate IT systems, consolidate redundant tools, and negotiate better software licensing agreements.</li>
        <li><strong>Facility Costs:</strong> Reduce energy consumption, optimize space utilization, and lower maintenance expenses.</li>
      </ul>
      
      <h3>Results You Can Expect</h3>
      <p>Our clients typically achieve 15-35% reduction in targeted cost categories, with average overall savings of 20-25% in the first year.</p>
    `,
    benefits: [
      'Average 25% cost reduction',
      'No impact on care quality',
      'Quick wins within 90 days',
      'Sustainable long-term savings',
      'Staff efficiency improvements'
    ]
  },
  'mis-data-analysis': {
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
    ],
    description: `
      <h2>Data-Driven Decision Making for Healthcare</h2>
      <p>In today's complex healthcare environment, having the right information at the right time is crucial. Our MIS & Data Analysis service transforms your data into actionable insights.</p>
      
      <h3>Building Your Data Foundation</h3>
      <p>We help you establish robust Management Information Systems that collect, organize, and present data in meaningful ways for different stakeholders across your organization.</p>
      
      <h3>Our Services Include</h3>
      <ul>
        <li><strong>Custom Dashboards:</strong> Interactive dashboards tailored to different roles - from clinical staff to executives - showing relevant KPIs in real-time.</li>
        <li><strong>Financial Analytics:</strong> Deep analysis of revenue cycles, cost centers, profitability by service line, and financial forecasting.</li>
        <li><strong>Operational Metrics:</strong> Track patient flow, resource utilization, quality indicators, and operational efficiency metrics.</li>
        <li><strong>Predictive Models:</strong> Use historical data to forecast demand, identify trends, and anticipate challenges before they occur.</li>
      </ul>
      
      <h3>Integration Excellence</h3>
      <p>We work with your existing systems - EHR, billing, scheduling, and more - to create a unified view of your organization's performance.</p>
    `,
    benefits: [
      'Real-time visibility into performance',
      'Faster, better decisions',
      'Reduced reporting time by 70%',
      'Identify trends early',
      'Improved forecasting accuracy'
    ]
  },
  'process-optimization': {
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
    ],
    description: `
      <h2>Streamline Your Financial Operations</h2>
      <p>Manual, inefficient financial processes drain resources and increase error rates. Our Financial Process Optimization service modernizes your operations for maximum efficiency.</p>
      
      <h3>Process Assessment</h3>
      <p>We start by mapping your current financial workflows, identifying bottlenecks, redundancies, and areas where automation can make the biggest impact.</p>
      
      <h3>Optimization Areas</h3>
      <ul>
        <li><strong>Revenue Cycle:</strong> Streamline billing, reduce claim denials, accelerate collections, and improve patient payment processes.</li>
        <li><strong>Accounts Payable:</strong> Automate invoice processing, implement approval workflows, and optimize payment timing.</li>
        <li><strong>Financial Close:</strong> Reduce month-end close time, automate reconciliations, and improve accuracy.</li>
        <li><strong>Budgeting & Planning:</strong> Implement rolling forecasts, automate variance analysis, and streamline budget processes.</li>
      </ul>
      
      <h3>Technology & Automation</h3>
      <p>We leverage modern tools and technologies to automate repetitive tasks, reduce manual data entry, and create seamless workflows between systems.</p>
    `,
    benefits: [
      '50% reduction in manual tasks',
      'Faster financial close',
      'Fewer errors and rework',
      'Better compliance',
      'Staff time freed for analysis'
    ]
  },
  'strategic-planning': {
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
    ],
    description: `
      <h2>Chart Your Path to Sustainable Growth</h2>
      <p>Strategic financial planning is essential for healthcare organizations navigating an ever-changing landscape. We help you develop comprehensive financial strategies aligned with your long-term vision.</p>
      
      <h3>Strategic Planning Process</h3>
      <p>Our approach combines deep healthcare industry knowledge with financial expertise to create actionable, realistic plans that drive results.</p>
      
      <h3>Planning Components</h3>
      <ul>
        <li><strong>Vision & Goals:</strong> Translate organizational vision into specific, measurable financial objectives with clear timelines.</li>
        <li><strong>Market Analysis:</strong> Understand your competitive position, market trends, and opportunities for growth or diversification.</li>
        <li><strong>Financial Modeling:</strong> Develop detailed projections with multiple scenarios - base case, optimistic, and conservative.</li>
        <li><strong>Capital Planning:</strong> Align capital expenditure plans with strategic priorities and funding availability.</li>
        <li><strong>Risk Management:</strong> Identify potential risks and develop mitigation strategies to protect your organization.</li>
      </ul>
      
      <h3>Ongoing Support</h3>
      <p>Strategic planning isn't a one-time exercise. We provide ongoing support to monitor progress, adjust plans as circumstances change, and ensure you stay on track to achieve your goals.</p>
    `,
    benefits: [
      'Clear 3-5 year roadmap',
      'Aligned stakeholder vision',
      'Better capital allocation',
      'Prepared for uncertainties',
      'Board & investor confidence'
    ]
  }
}

const getServiceIcon = (icon: string) => {
  const iconClass = "w-8 h-8"
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

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    
    // First try to get from static data
    const staticService = serviceData[slug]
    if (staticService) {
      setService(staticService)
      setLoading(false)
      return
    }
    
    // Fall back to API
    servicesApi.getBySlug(slug)
      .then(setService)
      .catch(() => setError('Service not found'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="spinner w-8 h-8 text-primary-600"></div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <Link to="/services" className="btn btn-primary">View All Services</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{service.meta_title || service.title} - FinanceClinics</title>
        <meta name="description" content={service.meta_description || service.short_description || ''} />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link to="/services" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Services
            </Link>
            
            {/* Icon */}
            <div className="w-16 h-16 mb-6 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white">
                {getServiceIcon(service.icon || 'default')}
              </span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {service.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {service.short_description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {service.description && (
                <div
                  className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-800"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {service.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {service.benefits && service.benefits.length > 0 && (
                <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-4">Key Benefits</h3>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
                <h3 className="font-heading text-lg font-bold mb-2">Ready to Get Started?</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Contact us today for a free consultation and learn how we can help your organization.
                </p>
                <div className="space-y-3">
                  <Link to="/contact" className="flex items-center justify-center w-full px-4 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                    <CalendarDaysIcon className="w-5 h-5 mr-2" />
                    Schedule Consultation
                  </Link>
                  <a href="tel:+15551234567" className="flex items-center justify-center w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition-colors">
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    Call Us Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            Interested in {service.title}?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Let's discuss how we can help your healthcare organization achieve its financial goals.
          </p>
          <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all">
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            Schedule a Free Consultation
          </Link>
        </div>
      </section>
    </>
  )
}
