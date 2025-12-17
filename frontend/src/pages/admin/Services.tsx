import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { servicesApi, Service, CreateServiceData } from '../../api'

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateServiceData>()

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const data = await servicesApi.getAll()
      setServices(data)
    } catch {
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CreateServiceData) => {
    try {
      // Convert features string to array
      const formattedData = {
        ...data,
        features: data.features ? (data.features as unknown as string).split('\n').filter(Boolean) : [],
      }

      if (editingService) {
        await servicesApi.update(editingService.id, formattedData)
        toast.success('Service updated')
      } else {
        await servicesApi.create(formattedData)
        toast.success('Service created')
      }
      loadServices()
      closeForm()
    } catch {
      toast.error('Failed to save service')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setIsCreating(true)
    setValue('title', service.title)
    setValue('short_description', service.short_description || '')
    setValue('description', service.description || '')
    // features is edited as a newline-separated string in the textarea
    setValue('features', service.features?.join('\n') || '')
    setValue('icon', service.icon || '')
    setValue('is_featured', service.is_featured)
    setValue('display_order', service.display_order)
    setValue('meta_title', service.meta_title || '')
    setValue('meta_description', service.meta_description || '')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    try {
      await servicesApi.delete(id)
      setServices((prev) => prev.filter((s) => s.id !== id))
      toast.success('Service deleted')
    } catch {
      toast.error('Failed to delete service')
    }
  }

  const closeForm = () => {
    setIsCreating(false)
    setEditingService(null)
    reset()
  }

  return (
    <>
      <Helmet>
        <title>Services - Admin | FinanceClinics</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="btn btn-primary text-sm"
            >
              Add Service
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingService ? 'Edit Service' : 'Create Service'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    {...register('display_order', { valueAsNumber: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    defaultValue={0}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  {...register('short_description')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Brief description for cards"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description (HTML)</label>
                <textarea
                  {...register('description')}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                  placeholder="<p>Full service description with HTML formatting...</p>"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                <textarea
                  {...register('features')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  {...register('is_featured')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
                  Featured on homepage
                </label>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">SEO Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Meta Title</label>
                    <input
                      type="text"
                      {...register('meta_title')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Meta Description</label>
                    <input
                      type="text"
                      {...register('meta_description')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={closeForm} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Update' : 'Create'} Service
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="spinner w-6 h-6 text-primary-600 mx-auto"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No services yet. Create your first service.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{service.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{service.short_description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {service.display_order}
                    </td>
                    <td className="px-6 py-4">
                      {service.is_featured ? (
                        <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-primary-600 hover:text-primary-700 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
