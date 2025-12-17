import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { settingsApi, Setting } from '../../api'

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await settingsApi.getAll()
      setSettings(data)
      const initialData: Record<string, string> = {}
      data.forEach((s) => {
        initialData[s.key] = s.value
      })
      setFormData(initialData)
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Update each changed setting
      const updates = settings.map((s) => {
        if (formData[s.key] !== s.value) {
          return settingsApi.update(s.key, formData[s.key])
        }
        return Promise.resolve()
      })
      await Promise.all(updates)
      toast.success('Settings saved')
      loadSettings()
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  // Group settings by category
  const groupedSettings = settings.reduce((acc, setting) => {
    const category = setting.category || setting.key.split('_')[0] || 'general'
    if (!acc[category]) acc[category] = []
    acc[category].push(setting)
    return acc
  }, {} as Record<string, Setting[]>)

  const categoryLabels: Record<string, string> = {
    general: 'General Settings',
    site: 'Site Information',
    contact: 'Contact Details',
    social: 'Social Media',
    email: 'Email Settings',
    analytics: 'Analytics',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8 text-primary-600"></div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Settings - Admin | FinanceClinics</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary text-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
              {categoryLabels[category] || category}
            </h2>
            <div className="space-y-4">
              {categorySettings.map((setting) => (
                <div key={setting.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {setting.key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  {setting.value.length > 100 ? (
                    <textarea
                      value={formData[setting.key] || ''}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[setting.key] || ''}
                      onChange={(e) => handleChange(setting.key, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
