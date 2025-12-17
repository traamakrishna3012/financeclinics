import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const team = [
  {
    name: 'Dinesh Mittal',
    role: 'CA, MBF, FAFD',
    bio: 'Over 5+ years of experience in healthcare financial management and advisory services.',
    photo: '/assets/team/dinesh.jpg',
  },
  {
    name: 'Amol Modani',
    role: 'CA, CS',
    bio: 'Specialist in healthcare regulatory compliance and corporate governance.',
    photo: '/assets/team/amol.png',
  },
  {
    name: 'Sandeep Banerjee',
    role: 'Business Leadership',
    bio: 'Expert in strategic planning and business development for healthcare organizations.',
    photo: '/assets/team/sandeep.png',
  },
]

const values = [
  { icon: '🎯', title: 'Integrity', description: 'We uphold the highest ethical standards in all our dealings.' },
  { icon: '⭐', title: 'Excellence', description: 'We deliver exceptional results that exceed expectations.' },
  { icon: '🤝', title: 'Partnership', description: 'We work alongside our clients as trusted advisors.' },
  { icon: '💡', title: 'Innovation', description: 'We leverage cutting-edge financial strategies and technologies.' },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us - FinanceClinics</title>
        <meta name="description" content="Learn about FinanceClinics, our mission, values, and commitment to providing exceptional financial advisory services to healthcare providers." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-primary-600">FinanceClinics</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We are a premier financial advisory firm dedicated to serving healthcare providers. Our team of experienced professionals understands the unique financial challenges faced by hospitals, clinics, and healthcare organizations.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To empower healthcare providers with strategic financial solutions that enable them to focus on what matters most — patient care.
              </p>
              <p className="text-gray-600 mb-6">
                We believe that every healthcare organization deserves access to expert financial guidance. Whether you're a small clinic or a large hospital network, we provide the same level of dedication and expertise to help you achieve your financial goals.
              </p>
              <Link to="/contact" className="btn btn-primary">
                Work With Us
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600">15+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600">100+</div>
                  <div className="text-gray-600">Healthcare Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600">$50M+</div>
                  <div className="text-gray-600">Funds Raised</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600">25%</div>
                  <div className="text-gray-600">Avg Cost Savings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the experts behind FinanceClinics.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                {member.photo ? (
                  <div className="w-28 h-28 rounded-full mx-auto mb-4 overflow-hidden">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement!
                        parent.innerHTML = `<div class=\"w-28 h-28 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center\"><span class=\"text-3xl text-white font-bold\">${member.name.charAt(0)}</span></div>`
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl text-white font-bold">{member.name.charAt(0)}</span>
                  </div>
                )}
                <h3 className="font-heading text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-6">
            Ready to Partner with FinanceClinics?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Let's discuss how we can help your healthcare organization thrive financially.
          </p>
          <Link to="/contact" className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all">
            Get Started Today
          </Link>
        </div>
      </section>
    </>
  )
}
