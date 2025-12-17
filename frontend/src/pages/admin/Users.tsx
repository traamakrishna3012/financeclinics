import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { adminApi } from '../../api'

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getUsers()
      setUsers(data)
    } catch (e) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const approve = async (id: number) => {
    try {
      await adminApi.approveUser(id)
      toast.success('User approved')
      load()
    } catch (e) {
      toast.error('Approve failed')
    }
  }

  return (
    <>
      <Helmet>
        <title>Users - Admin | FinanceClinics</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users</h1>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-gray-500">No users</div>
          ) : (
            <div className="divide-y">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{u.name} <span className="text-sm text-gray-500">({u.email})</span></div>
                    <div className="text-sm text-gray-500">Role: {u.role} • Active: {u.is_active ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!u.is_active && (
                      <button onClick={() => approve(u.id)} className="btn btn-primary">Approve</button>
                    )}
                    <button onClick={() => navigator.clipboard.writeText(u.email)} className="btn btn-outline">Copy Email</button>
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
