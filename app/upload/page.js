'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function UploadPage() {
  const [form, setForm] = useState({
    title: '', subject: '', grade: '', year: '', document_type: '', language: 'English'
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { setError('Please select a file'); return }
    setLoading(true)
    setError('')

    const filePath = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) { setError(uploadError.message); setLoading(false); return }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)

    const { error: dbError } = await supabase
      .from('documents')
      .insert([{ ...form, file_url: publicUrl, file_path: filePath, status: 'pending' }])

    if (dbError) { setError(dbError.message); setLoading(false); return }

    setSuccess(true)
    setLoading(false)
  }

  if (success) return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-green-600 mb-4">Upload successful!</h1>
      <p className="text-gray-600 mb-4">Your document is pending review.</p>
      <a href="/" className="text-blue-600 underline">Go back home</a>
    </main>
  )

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Upload a Document</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Title" value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
          className="w-full border p-3 rounded-lg" />
        <input placeholder="Subject (e.g. Mathematics)" value={form.subject}
          onChange={e => setForm({...form, subject: e.target.value})}
          className="w-full border p-3 rounded-lg" />
        <input placeholder="Grade (e.g. 12)" value={form.grade}
          onChange={e => setForm({...form, grade: e.target.value})}
          className="w-full border p-3 rounded-lg" />
        <input placeholder="Year (e.g. 2023)" value={form.year}
          onChange={e => setForm({...form, year: e.target.value})}
          className="w-full border p-3 rounded-lg" />
        <select value={form.document_type}
          onChange={e => setForm({...form, document_type: e.target.value})}
          className="w-full border p-3 rounded-lg">
          <option value="">Select document type</option>
          <option value="past_paper">Past Paper</option>
          <option value="memo">Memo</option>
          <option value="notes">Notes</option>
          <option value="test">Test</option>
        </select>
        <input type="file" accept=".pdf,.doc,.docx"
          onChange={e => setFile(e.target.files[0])}
          className="w-full border p-3 rounded-lg" />
        <button type="submit" disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 disabled:opacity-50">
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </main>
  )
}