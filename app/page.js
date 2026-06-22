export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Resource Hub</h1>
      <p className="text-gray-500 mb-8">Upload study materials for the community</p>
      <a href="/upload" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
        Upload a Document
      </a>
    </main>
  )
}

