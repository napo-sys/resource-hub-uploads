import { supabase } from '../../../lib/supabase'
import DocumentClient from './DocumentClient'

export async function generateMetadata({ params }) {
  const { data: doc } = await supabase
    .from('documents')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!doc) return { title: 'Document not found' }

  return {
    title: `${doc.title} | Resource Hub`,
    description: `${doc.document_type} for ${doc.subject}, Grade ${doc.grade}, ${doc.year}`,
    openGraph: {
      title: doc.title,
      description: `${doc.document_type} for ${doc.subject}, Grade ${doc.grade}, ${doc.year}`,
    },
  }
}

export default function DocumentPage() {
  return <DocumentClient />
}