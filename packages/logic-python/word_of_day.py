import json
from datetime import datetime
from pathlib import Path

_word_list_cache = None


def get_day_number(reference: datetime = datetime(2025, 1, 1)) -> int:
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    ref = reference.replace(hour=0, minute=0, second=0, microsecond=0)
    return (today - ref).days


def load_word_list() -> list[dict]:
    global _word_list_cache
    if _word_list_cache is not None:
        return _word_list_cache
    data_path = Path(__file__).parent.parent.parent / "data" / "word_list.json"
    with open(data_path, encoding="utf-8") as f:
        _word_list_cache = json.load(f)
    return _word_list_cache


def get_word_of_the_day() -> dict:
    word_list = load_word_list()
    day_number = get_day_number()
    index = day_number % len(word_list)
    return word_list[index]
