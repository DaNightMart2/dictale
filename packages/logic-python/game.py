"""Game logic - port of defs.ts"""

import re

ALPHABET = 'a-z'
N_TILDE = 'ñ'
ACCENTS = 'áéíóúü'
SPANISH_TO_PLAIN = {'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u'}


def is_spanish_letter(letter: str) -> bool:
    pattern = r'^[a-záéíñóúü]+$'
    return bool(re.match(pattern, letter.lower()))


def to_plain_letters(s: str) -> str:
    s = s.lower()
    for acc, plain in SPANISH_TO_PLAIN.items():
        s = s.replace(acc, plain)
    return re.sub(f'[^{ALPHABET}{N_TILDE}]', '', s)


class Letter:
    def __init__(self, content: str):
        self.letter = content
        self.revealed = not is_spanish_letter(content)
        self.green = False

    def guess(self, plain_prompt: str):
        if self.revealed:
            return
        if plain_prompt != to_plain_letters(self.letter):
            return
        self.reveal(True)

    def reveal(self, green: bool):
        self.revealed = True
        self.green = self.green or green


class Word:
    def __init__(self, content: str):
        self.content = content
        self.letters = [Letter(c) for c in content]

    def get_letter_count(self):
        return sum(1 for l in self.letters if is_spanish_letter(l.letter))

    def get_revealed_letter_count(self):
        return sum(1 for l in self.letters if is_spanish_letter(l.letter) and l.revealed)

    def is_fully_revealed(self):
        return self.get_revealed_letter_count() == self.get_letter_count()

    def guess(self, plain_prompt: str):
        if to_plain_letters(self.content) != plain_prompt:
            return
        for letter in self.letters:
            letter.reveal(False)

    def guess_letter(self, plain_prompt: str):
        for letter in self.letters:
            letter.guess(plain_prompt)

    def reveal(self, green: bool):
        for letter in self.letters:
            letter.reveal(green)


class Definition:
    def __init__(self, content: str):
        self.words = [Word(w) for w in content.split()]

    def get_letter_count(self):
        return sum(w.get_letter_count() for w in self.words)

    def get_revealed_letter_count(self):
        return sum(w.get_revealed_letter_count() for w in self.words)

    def guess_word(self, prompt: str):
        for word in self.words:
            word.guess(prompt)

    def guess_letter(self, prompt: str):
        for word in self.words:
            word.guess_letter(prompt)

    def reveal(self, green: bool):
        for word in self.words:
            word.reveal(green)


class Game:
    def __init__(self, word: str, definitions: list[str]):
        self.word_to_guess = Word(word)
        self.definitions = [Definition(d) for d in definitions]
        self.guessed_words = []
        self.revealed_letters = []
        self.revealed_words = []
        self.failed_words = []

    def is_in_definitions(self, plain_prompt: str) -> bool:
        for defn in self.definitions:
            for word in defn.words:
                if to_plain_letters(word.content) == plain_prompt:
                    return True
        return False

    def get_letter_count(self):
        return sum(d.get_letter_count() for d in self.definitions)

    def get_revealed_letter_count(self):
        return sum(d.get_revealed_letter_count() for d in self.definitions)

    def risk_word_to_guess(self, prompt: str) -> str:
        prompt = prompt.lower()
        if not is_spanish_letter(prompt):
            return 'invalid-letter'
        plain = to_plain_letters(prompt)
        if len(plain) < self.word_to_guess.get_letter_count():
            return 'not-full'
        if plain == to_plain_letters(self.word_to_guess.content):
            return 'correct'
        return 'wrong'

    def guess_word(self, prompt: str) -> str:
        if not prompt:
            return 'empty'
        prompt = prompt.lower()
        if not is_spanish_letter(prompt):
            return 'invalid-letter'
        plain = to_plain_letters(prompt)
        if plain in self.guessed_words:
            return 'already-guessed'
        self.guessed_words.append(plain)
        if not self.is_in_definitions(plain):
            self.failed_words.append(plain)
            return 'not-found'
        for defn in self.definitions:
            defn.guess_word(plain)
        return 'ok'

    def guess_letter(self, prompt: str) -> str:
        if not prompt:
            return 'empty'
        prompt = prompt.lower()
        if not is_spanish_letter(prompt):
            return 'invalid-letter'
        plain = to_plain_letters(prompt)
        if plain in self.revealed_letters:
            return 'already-revealed'
        if len(self.revealed_letters) >= 3:
            return 'no-letters-left'
        for defn in self.definitions:
            defn.guess_letter(plain)
        self.word_to_guess.guess_letter(plain)
        self.revealed_letters.append(plain)
        return 'ok'

    def reveal_word(self, position: list[int]) -> str:
        if len(position) != 2:
            return 'invalid-position'
        def_idx, word_idx = position
        if def_idx < 0 or def_idx >= len(self.definitions):
            return 'invalid-position'
        defn = self.definitions[def_idx]
        if word_idx < 0 or word_idx >= len(defn.words):
            return 'invalid-position'
        word = defn.words[word_idx]
        if word.is_fully_revealed():
            return 'already-revealed'
        if len(self.revealed_words) >= 3:
            return 'no-reveals-left'
        word.reveal(True)
        self.revealed_words.append(position)
        return 'ok'
