import { NextRequest, NextResponse } from 'next/server'
import { getGame, setGame } from '@/lib/game/store'
import { gameToStateView } from '@/lib/game/serialize'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params
  const game = getGame(gameId)
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 })
  }
  const { word } = await req.json()
  const result = game.guessWord(word || '')
  setGame(gameId, game)
  const state = gameToStateView(game)
  return NextResponse.json({ result, state })
}
