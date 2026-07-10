import json
import os
import uuid
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from game import Game
from word_of_day import get_word_of_the_day

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

games: dict[str, Game] = {}


def game_to_state_view(game: Game, game_ended: bool = False, game_won: bool = False) -> dict:
    def letter_to_view(l):
        return {"revealed": l.revealed, "green": l.green, "char": l.letter if l.revealed else "_"}

    def word_to_view(w):
        return {"letters": [letter_to_view(l) for l in w.letters]}

    letter_count = game.get_letter_count()
    revealed_count = game.get_revealed_letter_count()
    progress = int(100 * revealed_count / letter_count) if letter_count > 0 else 0

    state = {
        "wordToGuess": word_to_view(game.word_to_guess),
        "definitions": [{"words": [word_to_view(w) for w in d.words]} for d in game.definitions],
        "revealedLetters": list(game.revealed_letters),
        "revealedWords": [list(p) for p in game.revealed_words],
        "failedWords": list(game.failed_words),
        "gameEnded": game_ended,
        "gameWon": game_won,
        "progress": progress,
    }
    if game_ended:
        state["answer"] = game.word_to_guess.content
    return state


@app.post("/api/game")
def create_game():
    word_data = get_word_of_the_day()
    game = Game(word_data["word"], word_data["definitions"])
    game_id = str(uuid.uuid4())
    games[game_id] = game
    state = game_to_state_view(game)
    return {"gameId": game_id, "state": state}


@app.post("/api/game/{game_id}/guess-word")
def guess_word(game_id: str, body: dict):
    game = games.get(game_id)
    if not game:
        return {"error": "Game not found"}, 404
    result = game.guess_word(body.get("word", ""))
    state = game_to_state_view(game)
    return {"result": result, "state": state}


@app.post("/api/game/{game_id}/guess-letter")
def guess_letter(game_id: str, body: dict):
    game = games.get(game_id)
    if not game:
        return {"error": "Game not found"}, 404
    result = game.guess_letter(body.get("letter", ""))
    state = game_to_state_view(game)
    return {"result": result, "state": state}


@app.post("/api/game/{game_id}/reveal-word")
def reveal_word(game_id: str, body: dict):
    game = games.get(game_id)
    if not game:
        return {"error": "Game not found"}, 404
    result = game.reveal_word([body.get("defIndex", 0), body.get("wordIndex", 0)])
    state = game_to_state_view(game)
    return {"result": result, "state": state}


@app.post("/api/game/{game_id}/guess-final")
def guess_final(game_id: str, body: dict):
    game = games.get(game_id)
    if not game:
        return {"error": "Game not found"}, 404
    result = game.risk_word_to_guess(body.get("word", ""))
    state = game_to_state_view(game, game_ended=(result == "wrong"), game_won=(result == "correct"))
    return {"result": result, "state": state}


@app.post("/api/game/{game_id}/surrender")
def surrender(game_id: str):
    game = games.get(game_id)
    if not game:
        return {"error": "Game not found"}, 404
    state = game_to_state_view(game, game_ended=True, game_won=False)
    return {"state": state}
