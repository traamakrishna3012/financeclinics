import { Helmet } from 'react-helmet-async'

export default function Privacy() {
  return (
    <div className="max-w-5xl mx-auto py-20 px-4">
      <Helmet>
        <title>Privacy Policy - FinanceClinics</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        This Privacy Policy describes how FinanceClinics collects, uses, and protects personal information. We collect only the information necessary to provide services, respond to inquiries, and improve our website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>Contact information (name, email, phone) when you submit forms.</li>
        <li>Usage data collected via cookies and analytics.</li>
        <li>Any other information you provide when contacting us.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Information</h2>
      <p className="text-gray-700 mb-4">We use information to respond to inquiries, provide services, send transactional emails, and improve our products. We do not sell personal data to third parties.</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
      <p className="text-gray-700 mb-4">You can request access, correction, or deletion of your personal data by contacting us at the email address provided in the footer.</p>

      <p className="text-sm text-gray-500 mt-8">Last updated: December 15, 2025</p>
    </div>
  )
}
