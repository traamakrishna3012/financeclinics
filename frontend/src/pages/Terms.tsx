import { Helmet } from 'react-helmet-async'

export default function Terms() {
  return (
    <div className="max-w-5xl mx-auto py-20 px-4">
      <Helmet>
        <title>Terms of Service - FinanceClinics</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-700 mb-4">
        These Terms of Service govern your use of the FinanceClinics website and services. By using our site you agree to these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Use of Services</h2>
      <p className="text-gray-700 mb-4">Services provided through this website are for informational purposes and do not constitute professional advice. Engagements for paid services will be governed by separate agreements.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
      <p className="text-gray-700 mb-4">FinanceClinics is not liable for any indirect or consequential damages arising from use of the site. Our liability for direct damages is limited to fees paid for services, where applicable.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Governing Law</h2>
      <p className="text-gray-700 mb-4">These terms are governed by the laws of the jurisdiction where FinanceClinics operates.</p>

      <p className="text-sm text-gray-500 mt-8">Last updated: December 15, 2025</p>
    </div>
  )
}
