import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found - FinanceClinics</title>
      </Helmet>

      <section className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="text-center px-4">
          <h1 className="font-heading text-9xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
