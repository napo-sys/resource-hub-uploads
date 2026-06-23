import { supabase } from '../lib/supabase'

export default async function sitemap() {
  const { data: docs } = await supabase
    .from('documents')
    .select('id, updated_at')
    .eq('status', 'approved')

  const docUrls = (docs || []).map(doc => ({
    url: `https://resource-hub-uploads.vercel.app/documents/${doc.id}`,
    lastModified: new Date(doc.updated_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: 'https://resource-hub-uploads.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...docUrls,
  ]
}