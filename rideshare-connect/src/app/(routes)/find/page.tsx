"use client"

import { useEffect, useState } from 'react'

type Ride = {
  id: string
  fromLocation: string
  toLocation: string
  departureTime: string
  vehicleType: string
  availableSeats: number
}

export default function FindRidePage() {
  const [query, setQuery] = useState({ toLocation: '', date: '' })
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(false)

  async function search() {
    setLoading(true)
    const params = new URLSearchParams()
    if (query.toLocation) params.set('to', query.toLocation)
    if (query.date) params.set('date', query.date)
    const res = await fetch(`/api/rides?${params.toString()}`)
    const data = await res.json()
    setRides(data.rides || [])
    setLoading(false)
  }

  useEffect(() => {
    search()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Find a ride</h1>
      <div className="mt-4 flex gap-2">
        <input className="flex-1 rounded border p-2" placeholder="Destination" value={query.toLocation} onChange={e=>setQuery(s=>({...s, toLocation: e.target.value}))} />
        <input className="rounded border p-2" type="date" value={query.date} onChange={e=>setQuery(s=>({...s, date: e.target.value}))} />
        <button onClick={search} className="rounded bg-blue-600 px-4 py-2 text-white">Search</button>
      </div>
      <ul className="mt-6 grid gap-3">
        {loading && <p>Loading...</p>}
        {!loading && rides.map(r => (
          <li key={r.id} className="rounded border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{r.fromLocation} → {r.toLocation}</p>
                <p className="text-sm text-gray-600">{new Date(r.departureTime).toLocaleString()} · {r.vehicleType}</p>
              </div>
              <div className="text-sm">Seats: {r.availableSeats}</div>
            </div>
          </li>
        ))}
        {!loading && rides.length === 0 && <p className="text-gray-600">No rides found.</p>}
      </ul>
    </main>
  )
}