import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { pagesApi, Page } from '../../api'

interface PageFormData {
  title: string
  slug: string
  content: string
  meta_title?: string
  meta_description?: string
  is_published: boolean
}

export default function PagesAdmin() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PageFormData>()

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      const data = await pagesApi.getAll()
      setPages(data)
    } catch {
      toast.error('Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: PageFormData) => {
    try {
      if (editingPage) {
        await pagesApi.update(editingPage.id, data)
        toast.success('Page updated')
      } else {
        await pagesApi.create(data)
        toast.success('Page created')
      }
      loadPages()
      closeForm()
    } catch {
      toast.error('Failed to save page')
    }
  }

  const handleEdit = (page: Page) => {
    setEditingPage(page)
    setIsCreating(true)
    setValue('title', page.title)
    setValue('slug', page.slug)
    setValue('content', page.content || '')
    setValue('meta_title', page.meta_title || '')
    setValue('meta_description', page.meta_description || '')
    setValue('is_published', page.is_published)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this page?')) return
    try {
      await pagesApi.delete(id)
      setPages((prev) => prev.filter((p) => p.id !== id))
      toast.success('Page deleted')
    } catch {
      toast.error('Failed to delete page')
    }
  }

  const closeForm = () => {
    setIsCreating(false)
    setEditingPage(null)
    reset()
  }

  return (
    <>
      <Helmet>
        <title>Pages - Admin | FinanceClinics</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="btn btn-primary text-sm"
            >
              Add Page
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPage ? 'Edit Page' : 'Create Page'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input
                    type="text"
                    {...register('slug', { required: 'Slug is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="about-us"
                  />
                  {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
                <textarea
                  {...register('content')}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                  placeholder="<h1>Page Title</h1><p>Content here...</p>"
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_published"
                  {...register('is_published')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_published" className="ml-2 text-sm text-gray-700">
                  Published
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
                  {editingPage ? 'Update' : 'Create'} Page
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pages List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="spinner w-6 h-6 text-primary-600 mx-auto"></div>
            </div>
          ) : pages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No pages yet. Create your first page.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{page.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      /{page.slug}
                    </td>
                    <td className="px-6 py-4">
                      {page.is_published ? (
                        <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEdit(page)}
                        className="text-primary-600 hover:text-primary-700 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
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
