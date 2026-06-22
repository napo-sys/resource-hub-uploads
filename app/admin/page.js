'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPending = async () => {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setDocs(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPending() }, [])

  const updateStatus = async (id, status) => {
    await supabase.from('documents').update({ status }).eq('id', id)
    fetchPending()
  }

  if (loading) return <main className="max-w-4xl mx-auto p-8">Loading...</main>

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Moderation Queue</h1>
      <p className="text-gray-500 mb-8">{docs.length} document(s) pending review</p>
      {docs.length === 0 && <p className="text-gray-400">No documents pending review.</p>}
      <div className="space-y-4">
        {docs.map(doc => (
          <div key={doc.id} className="border rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-semibold">{doc.title}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {doc.subject} · Grade {doc.grade} · {doc.year} · {doc.document_type}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Uploaded: {new Date(doc.created_at).toLocaleString()}
                </p>
              </div>
              <a href={doc.file_url} target="_blank"
                className="text-blue-600 underline text-sm">View file</a>
            </div>
            <div className="flex gap-3">
              <button onClick={() => updateStatus(doc.id, 'approved')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Approve
              </button>
              <button onClick={() => updateStatus(doc.id, 'rejected')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

