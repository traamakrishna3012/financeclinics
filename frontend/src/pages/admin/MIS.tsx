import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { misApi } from '../../api'

export default function MISAdmin() {
  const [templates, setTemplates] = useState<any[]>([])
  const [name, setName] = useState('')
  const [columnsText, setColumnsText] = useState('')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const data = await misApi.listTemplates()
      setTemplates(data)
    } catch (e) {
      toast.error('Failed to load templates')
    }
  }

  const create = async () => {
    try {
      // columnsText: comma-separated keys (key:Label optional)
      const cols = columnsText.split('\n').map((l) => {
        const [key, label] = l.split(':').map(s => s?.trim())
        return { key: key || '', label: label || (key || '') }
      }).filter(c => c.key)
      await misApi.createTemplate({ name, columns: cols })
      toast.success('Template created')
      setName('')
      setColumnsText('')
      load()
    } catch (e) {
      toast.error('Failed to create')
    }
  }

  const handleImport = async (tplId: number, files: FileList | null) => {
    if (!files || files.length === 0) return
    try {
      const res = await misApi.importFile(tplId, files[0])
      toast.success(`Imported ${res.imported || 0} rows`)
    } catch (e) {
      toast.error('Import failed')
    }
  }

  

  const exportAny = async (tplId: number, format: string, filename?: string) => {
    try {
      const res = await misApi.exportFile(tplId, format)
      const url = window.URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `template-${tplId}.${format}`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (e) {
      toast.error('Export failed')
    }
  }

  return (
    <>
      <Helmet>
        <title>MIS Templates - Admin | FinanceClinics</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">MIS Templates</h1>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h2 className="font-semibold mb-3">Create Template</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template name" className="px-3 py-2 border rounded" />
            <textarea value={columnsText} onChange={(e) => setColumnsText(e.target.value)} placeholder="One column per line: key:Label (or key)" className="px-3 py-2 border rounded" />
            <div className="flex items-start">
              <button onClick={create} className="btn btn-primary">Create</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <h2 className="font-semibold mb-4">Existing Templates</h2>
          {templates.length === 0 ? (
            <div className="text-gray-500">No templates yet</div>
          ) : (
            <div className="space-y-3">
              {templates.map(t => (
                <div key={t.id} className="flex items-center justify-between border p-3 rounded">
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-sm text-gray-500">{(t.columns || []).map((c:any)=>c.key).join(', ')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="file" onChange={(e) => handleImport(t.id, e.target.files)} />
                    <div className="flex items-center gap-2">
                      <button onClick={() => exportAny(t.id, 'csv')} className="btn btn-outline">CSV</button>
                      <button onClick={() => exportAny(t.id, 'xlsx')} className="btn btn-outline">XLSX</button>
                      <button onClick={() => exportAny(t.id, 'docx')} className="btn btn-outline">DOCX</button>
                      <button onClick={() => exportAny(t.id, 'pdf')} className="btn btn-outline">PDF</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
