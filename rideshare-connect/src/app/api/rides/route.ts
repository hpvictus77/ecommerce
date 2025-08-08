import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { startOfDay, endOfDay } from 'date-fns'

const CreateRideSchema = z.object({
  fromLocation: z.string().min(2),
  toLocation: z.string().min(2),
  departureTime: z.string().transform((s) => new Date(s)),
  vehicleType: z.string().min(2),
  totalSeats: z.number().int().min(1).max(8),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const to = searchParams.get('to') || undefined
  const date = searchParams.get('date') || undefined

  const where: any = { isActive: true }
  if (to) where.toLocation = { contains: to, mode: 'insensitive' }
  if (date) {
    const d = new Date(date)
    if (!isNaN(d.getTime())) {
      where.departureTime = { gte: startOfDay(d), lte: endOfDay(d) }
    }
  }

  const rides = await prisma.ride.findMany({
    where,
    orderBy: { departureTime: 'asc' },
    select: {
      id: true,
      fromLocation: true,
      toLocation: true,
      departureTime: true,
      vehicleType: true,
      availableSeats: true,
    },
  })

  return NextResponse.json({ rides })
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parsed = CreateRideSchema.parse(json)

    const ride = await prisma.ride.create({
      data: {
        fromLocation: parsed.fromLocation,
        toLocation: parsed.toLocation,
        departureTime: parsed.departureTime,
        vehicleType: parsed.vehicleType,
        totalSeats: parsed.totalSeats,
        availableSeats: parsed.totalSeats,
        // For now, create a placeholder driver; auth wiring can replace this
        driver: {
          create: {},
        },
      },
      select: { id: true },
    })

    return NextResponse.json({ id: ride.id })
  } catch (err: any) {
    const msg = err?.message || 'Invalid request'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}