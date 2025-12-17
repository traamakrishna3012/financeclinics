import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import { servicesApi, Service } from '../api'
import { 
  ArrowTrendingUpIcon, 
  CalculatorIcon, 
  CurrencyDollarIcon,
  Cog6ToothIcon,
  BuildingOffice2Icon,
  ArrowRightIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ScissorsIcon,
  CircleStackIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const partnerLogos = [
  { name: 'Metropolis Healthcare', className: 'text-blue-600' },
  { name: 'Dr Lal PathLabs', className: 'text-green-400' },
  { name: 'InfeXn Laboratories', className: 'text-purple-600' },
  { name: 'Nirmal Hospital', className: 'text-red-600' },
]

// Client logos for the scrolling strip
const clientLogos = [
  { 
    name: 'Metropolis Healthcare', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Metropolis_Healthcare_Logo.png'
  },
  { 
    name: 'Dr Lal PathLabs', 
    logo: 'https://companieslogo.com/img/orig/LALPATHLAB.NS_BIG-6629dfaa.png?t=1744819495'
  },
  { 
    name: 'InfeXn Laboratories', 
    logo: 'http://infexn.in/img/logo.png'
  },
  { 
    name: 'Nirmal Hospital', 
    logo: 'https://nirmalhospitals.in/wp-content/uploads/2019/12/cropped-Nirmal-Hospitals-3-300x101.png'
  },
  { 
    name: 'SIDS Hospital', 
    logo: 'https://www.sidshospital.com/wp-content/uploads/2023/02/cropped-sids-logo.png'
  },
  { 
    name: 'Apple Hospital', 
    logo: 'https://www.applehospital.co.in/wp-content/uploads/2025/08/logo__2_-removebg-preview.png'
  },
  { 
    name: 'Asutosh Hospital', 
    logo: 'https://www.asutoshindia.com/images/logo.png'
  },
  { 
    name: 'Shraddha Pathology Laboratory', 
    logo: 'https://shraddhalab.com/frontend/images/Shraddha-Pathology-Laboratory.png'
  },
]

const valueHighlights = [
  {
    icon: 'fundraising',
    title: 'Fundraising Support',
    description: 'Strategic capital raising solutions tailored for healthcare organizations. We help you secure funding through diverse channels.',
  },
  {
    icon: 'optimization',
    title: 'Cost Optimization',
    description: 'Identify inefficiencies and implement cost-saving measures without compromising patient care quality.',
  },
  {
    icon: 'value',
    title: 'Value Maximization',
    description: "Maximize your organization's value through strategic financial planning and operational excellence.",
  },
]

const stats = [
  { value: '100+', label: 'Healthcare Clients', color: 'text-blue-600' },
  { value: '$50M+', label: 'Funds Raised', color: 'text-green-600' },
  { value: '35%', label: 'Avg Cost Reduction', color: 'text-amber-500' },
  { value: '15+', label: 'Years Experience', color: 'text-purple-600' },
]

// Static services data as fallback
const staticServices = [
  {
    id: 1,
    title: 'Fundraising & Capital Advisory',
    slug: 'fundraising',
    short_description: 'End-to-end fundraising support including investor relations, pitch preparation, and capital structuring for healthcare ventures.',
    icon: 'chart-line',
  },
  {
    id: 2,
    title: 'Cost Optimization',
    slug: 'cost-optimization',
    short_description: 'Comprehensive cost analysis and optimization strategies to improve operational efficiency and reduce unnecessary expenses.',
    icon: 'scissors',
  },
  {
    id: 3,
    title: 'MIS & Data Analysis',
    slug: 'mis-data-analysis',
    short_description: 'Management Information Systems setup and advanced data analytics to drive informed decision-making.',
    icon: 'database',
  },
  {
    id: 4,
    title: 'Financial Process Optimization',
    slug: 'process-optimization',
    short_description: 'Streamline financial workflows, implement best practices, and automate processes for maximum efficiency.',
    icon: 'cogs',
  },
  {
    id: 5,
    title: 'Strategic Financial Planning',
    slug: 'strategic-planning',
    short_description: "Long-term financial roadmaps aligned with your healthcare organization's growth objectives and market dynamics.",
    icon: 'chart-bar',
  },
]

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'fundraising':
      return <ArrowTrendingUpIcon className="w-7 h-7" />
    case 'optimization':
      return <CalculatorIcon className="w-7 h-7" />
    case 'value':
      return <CurrencyDollarIcon className="w-7 h-7" />
    default:
      return <BuildingOffice2Icon className="w-7 h-7" />
  }
}

const getServiceIcon = (icon: string) => {
  switch (icon) {
    case 'chart-line':
      return <ArrowTrendingUpIcon className="w-6 h-6" />
    case 'scissors':
      return <ScissorsIcon className="w-6 h-6" />
    case 'database':
      return <CircleStackIcon className="w-6 h-6" />
    case 'cogs':
      return <Cog6ToothIcon className="w-6 h-6" />
    case 'chart-bar':
      return <ChartBarIcon className="w-6 h-6" />
    default:
      return <BuildingOffice2Icon className="w-6 h-6" />
  }
}

export default function Home() {
  const [services, setServices] = useState<Service[]>(staticServices as unknown as Service[])

  useEffect(() => {
    servicesApi.getFeatured()
      .then((data) => {
        if (data && data.length > 0) {
          setServices(data)
        }
      })
      .catch(() => {
        // Keep using static services if API fails - silent fallback
      })
  }, [])

  return (
    <>
      <Helmet>
        <title>FinanceClinics - Financial Advisory for Healthcare Providers</title>
        <meta name="description" content="Expert financial advisory services specializing in fundraising, cost optimization, MIS/Data Analysis, and financial planning for healthcare organizations." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-cyan-50/50"></div>
        
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-cyan-100/40 via-sky-50/30 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left">
              {/* Trust Badge */}
              <span className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-full mb-6">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Trusted by 100+ Healthcare Providers
              </span>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Financial Advisory for{' '}

                <span className="text-blue-500">Healthcare Providers</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
                Expert financial advisory services specializing in{' '}

                <strong className="text-gray-800">fundraising</strong>,{' '}

                <strong className="text-gray-800">cost optimization</strong>,{' '}

                <strong className="text-gray-800">MIS/Data Analysis</strong>, and{' '}

                <strong className="text-gray-800">financial process optimization</strong> for healthcare organizations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Book a Consultation
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
                <Link 
                  to="/services" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                >
                  Explore Services
                </Link>
              </div>

              {/* Partner Logos */}
              <div>
                <p className="text-sm text-gray-500 mb-4">Trusted by leading healthcare organizations</p>
                <div className="flex flex-nowrap justify-center lg:justify-start items-center gap-6 overflow-x-auto">
                  {partnerLogos.map((partner) => (
                    <span key={partner.name} className={`font-bold text-sm ${partner.className} opacity-70 hover:opacity-100 transition-opacity whitespace-nowrap truncate max-w-[180px]`}> 
                      {partner.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Dashboard Card */}
            <div className="relative hidden lg:block">
              <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Main Chart Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                  {/* Chart Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Financial Growth</h3>
                      <p className="text-sm text-gray-500">Last 12 months</p>
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div className="flex items-end justify-between gap-3 h-40 mb-4">
                    <div className="flex-1 bg-blue-200 rounded-t-lg h-[45%] transition-all duration-300 hover:h-[50%] hover:bg-blue-300"></div>
                    <div className="flex-1 bg-blue-300 rounded-t-lg h-[55%] transition-all duration-300 hover:h-[60%] hover:bg-blue-400"></div>
                    <div className="flex-1 bg-blue-400 rounded-t-lg h-[50%] transition-all duration-300 hover:h-[55%] hover:bg-blue-500"></div>
                    <div className="flex-1 bg-blue-500 rounded-t-lg h-[70%] transition-all duration-300 hover:h-[75%] hover:bg-blue-600"></div>
                    <div className="flex-1 bg-blue-600 rounded-t-lg h-[85%] transition-all duration-300 hover:h-[90%] hover:bg-blue-700"></div>
                    <div className="flex-1 bg-green-500 rounded-t-lg h-full transition-all duration-300 hover:h-[105%] hover:bg-green-600 relative">
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-green-500 font-bold text-lg">+47%</span>
                    </div>
                  </div>
                </div>

                {/* Floating Card - Cost Reduced */}
                <div className="absolute -top-4 -left-8 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-float">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Cost Reduced</p>
                    <p className="text-xl font-bold text-green-500">$2.4M</p>
                  </div>
                </div>

                {/* Floating Card - Funds Raised */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-float-delayed">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <CurrencyDollarIcon className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Funds Raised</p>
                    <p className="text-xl font-bold text-amber-500">$15M+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center text-gray-400 animate-bounce mt-12">
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDownIcon className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Value Highlights */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-4">
              Why Choose Us
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Driving Financial Excellence in Healthcare
            </h2>
            <p className="text-lg text-gray-600">
              We bring specialized expertise to help healthcare organizations achieve financial sustainability and growth.
            </p>
          </div>

          {/* Value Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {valueHighlights.map((item, index) => (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-14 h-14 mb-6 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                  item.icon === 'fundraising' ? 'bg-blue-50 text-blue-500' :
                  item.icon === 'optimization' ? 'bg-green-50 text-green-500' :
                  'bg-amber-50 text-amber-500'
                }`}>
                  {getIcon(item.icon)}
                </div>
                
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                
                {/* Hover Arrow */}
                <div className="mt-6 flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Clients Section - Running Strip */}
      <section className="py-16 bg-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
              Trusted Partners
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-blue-600">
              Our Clients
            </h2>
          </div>
        </div>
        
        {/* Infinite Scrolling Logo Strip */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-100 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-100 to-transparent z-10"></div>
          
          {/* Scrolling Container */}
          <div className="flex animate-scroll">
            {/* First set of logos */}
            {clientLogos.map((client, index) => (
              <div 
                key={`first-${index}`} 
                className="flex-shrink-0 mx-8 flex items-center justify-center"
              >
                <div className="bg-white rounded-xl shadow-md p-6 w-48 h-32 flex items-center justify-center hover:shadow-lg transition-shadow">
                  <img 
                    src={client.logo} 
                    alt={client.name}
                    className="max-h-20 max-w-full object-contain transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<span class="font-semibold text-center text-sm truncate">${client.name}</span>`;
                    }}
                  />
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {clientLogos.map((client, index) => (
              <div 
                key={`second-${index}`} 
                className="flex-shrink-0 mx-8 flex items-center justify-center"
              >
                <div className="bg-white rounded-xl shadow-md p-6 w-48 h-32 flex items-center justify-center hover:shadow-lg transition-shadow">
                  <img 
                    src={client.logo} 
                    alt={client.name}
                    className="max-h-20 max-w-full object-contain transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `<span class="text-gray-700 font-semibold text-center text-sm truncate">${client.name}</span>`;
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
              Our Services
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Financial Solutions
            </h2>
            <p className="text-lg text-gray-600">
              Tailored financial advisory services designed specifically for the unique challenges of healthcare organizations.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300"
              >
                {/* Service Icon */}
                <div className="w-11 h-11 mb-5 rounded-xl bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white">
                    {getServiceIcon(service.icon || 'default')}
                  </span>
                </div>
                
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{service.short_description}</p>
                
                <span className="inline-flex items-center text-blue-600 text-sm font-medium">
                  Learn more
                  <ArrowRightIcon className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

          {/* View All Services Link */}
          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              View All Services
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Schedule a first free consultation with our healthcare finance experts and discover how we can help your organization thrive.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <CalendarDaysIcon className="w-5 h-5 mr-2" />
              Book a Consultation
            </Link>
            <a 
              href="tel:+919768899000" 
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl border-2 border-white/20 hover:bg-blue-500 transition-all duration-200"
            >
              <PhoneIcon className="w-5 h-5 mr-2" />
              Call Us Now
            </a>
          </div>
          
          {/* Trust Badge */}
          <div className="mt-12 flex items-center justify-center space-x-2 text-blue-200">
            <ShieldCheckIcon className="w-5 h-5" />
            <span className="text-sm font-medium">100% Confidential • No Obligation</span>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <BackToTopButton />
    </>
  )
}

// Back to Top Button Component
function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center z-50 ${
        isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      aria-label="Back to top"
    >
      <ChevronUpIcon className="w-6 h-6" />
    </button>
  )
}
