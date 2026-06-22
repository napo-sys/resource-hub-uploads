'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function DocumentClient() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [rating, setRating] = useState(0)
  const [reportReason, setReportReason] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchDoc = async () => {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single()
      setDoc(data)
    }
    fetchDoc()
  }, [id])

  const submitRating = async () => {
    if (!rating) return
    await supabase.from('ratings').insert([{ document_id: id, rating }])
    const newCount = (doc.total_ratings || 0) + 1
    const newAvg = ((doc.average_rating || 0) * (doc.total_ratings || 0) + rating) / newCount
    await supabase.from('documents').update({
      average_rating: newAvg.toFixed(2),
      total_ratings: newCount
    }).eq('id', id)
    setMessage('Rating submitted!')
  }

  const submitReport = async () => {
    if (!reportReason) return
    await supabase.from('reports').insert([{ document_id: id, reason: reportReason }])
    await supabase.from('documents').update({
      report_count: (doc.report_count || 0) + 1
    }).eq('id', id)
    setMessage('Report submitted. Thank you!')
    setReportReason('')
  }

  if (!doc) return <main className="max-w-2xl mx-auto p-8">Loading...</main>

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
      <p className="text-gray-500 mb-1">{doc.subject} · Grade {doc.grade} · {doc.year}</p>
      <p className="text-gray-400 text-sm mb-6">Type: {doc.document_type} · Status: {doc.status}</p>
      <a href={doc.file_url} target="_blank"
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 inline-block mb-8">
        View Document
      </a>

      {message && <p className="text-green-600 font-medium mb-4">{message}</p>}

      <div className="border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Rate this document</h2>
        <p className="text-gray-500 text-sm mb-3">Average: {doc.average_rating || 0} / 5 ({doc.total_ratings || 0} ratings)</p>
        <div className="flex gap-2 mb-4">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)}
              className={`w-10 h-10 rounded-full border-2 font-bold ${rating === n ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'}`}>
              {n}
            </button>
          ))}
        </div>
        <button onClick={submitRating}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
          Submit Rating
        </button>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">Report this document</h2>
        <select value={reportReason} onChange={e => setReportReason(e.target.value)}
          className="w-full border p-3 rounded-lg mb-3">
          <option value="">Select a reason</option>
          <option value="wrong_label">Wrong label / subject</option>
          <option value="poor_quality">Poor quality</option>
          <option value="duplicate">Duplicate</option>
          <option value="inappropriate">Inappropriate content</option>
        </select>
        <button onClick={submitReport}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Submit Report
        </button>
      </div>
    </main>
  )
}