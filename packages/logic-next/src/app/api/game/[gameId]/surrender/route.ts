import { NextResponse } from 'next/server'
import { getGame } from '@/lib/game/store'
import { gameToStateView } from '@/lib/game/serialize'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params
  const game = getGame(gameId)
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 })
  }
  const state = gameToStateView(game, { gameEnded: true, gameWon: false })
  return NextResponse.json({ state })
}
