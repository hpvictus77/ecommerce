"use client"

import { useState } from 'react'

export default function OfferRidePage() {
  const [form, setForm] = useState({
    fromLocation: '',
    toLocation: '',
    departureTime: '',
    vehicleType: 'Car',
    totalSeats: 1,
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setMessage('Ride created!')
      setForm({ fromLocation: '', toLocation: '', departureTime: '', vehicleType: 'Car', totalSeats: 1 })
    } catch (err: any) {
      setMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Offer a ride</h1>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <input className="rounded border p-2" placeholder="From" value={form.fromLocation} onChange={e=>setForm(s=>({...s, fromLocation: e.target.value}))} required />
        <input className="rounded border p-2" placeholder="To" value={form.toLocation} onChange={e=>setForm(s=>({...s, toLocation: e.target.value}))} required />
        <input className="rounded border p-2" type="datetime-local" value={form.departureTime} onChange={e=>setForm(s=>({...s, departureTime: e.target.value}))} required />
        <select className="rounded border p-2" value={form.vehicleType} onChange={e=>setForm(s=>({...s, vehicleType: e.target.value}))}>
          <option>Car</option>
          <option>Bike</option>
          <option>Cab</option>
        </select>
        <input className="rounded border p-2" type="number" min={1} max={6} value={form.totalSeats} onChange={e=>setForm(s=>({...s, totalSeats: Number(e.target.value)}))} />
        <button disabled={submitting} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">{submitting ? 'Creating...' : 'Create ride'}</button>
      </form>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </main>
  )
}