import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">RideShare Connect</h1>
      <p className="mt-2 text-gray-600">Match with people going to the same destination on the same date.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/offer" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Offer a ride</Link>
        <Link href="/find" className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100">Find a ride</Link>
      </div>
    </main>
  )
}