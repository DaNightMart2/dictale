#!/usr/bin/env python3
"""
Wiktionary Downloader
Downloads and processes Spanish Wiktionary data from kaikki.org
"""

import json
import gzip
import requests
from pathlib import Path

WIKTIONARY_URL = "https://kaikki.org/eswiktionary/raw-wiktextract-data.jsonl.gz"
LOCAL_FILE = "eswiktionary.jsonl.gz"
LANG_CODE = "es"


class WiktionaryDownloader:
    def __init__(self):
        self._file_handle = None

    def download(self) -> bool:
        response = requests.get(WIKTIONARY_URL, stream=True)
        response.raise_for_status()

        total_size = int(response.headers.get("content-length", 0))
        if total_size <= 0:
            raise KeyError("couldn't determine content length for wiktionary download")

        downloaded = 0
        with open(LOCAL_FILE, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if not chunk:
                    continue
                f.write(chunk)
                downloaded += len(chunk)
                percent = (downloaded / total_size) * 100
                print(f"\rDownloaded: {percent:.1f}%", end="", flush=True)

        print(f"\nDownload complete! Saved to {LOCAL_FILE}")
        return True

    def _parse_entry(self, entry: dict) -> tuple[str, list[str]] | None:
        if entry.get("lang_code", "").lower().strip() != LANG_CODE:
            return None

        word = entry.get("word", "").lower().strip()
        senses = entry.get("senses", [])
        word_defs = set()

        for sense in senses:
            for gloss in sense.get("glosses", []) + sense.get("raw_glosses", []):
                word_defs.add(gloss.strip())

        if not word_defs:
            return None

        return word, list(word_defs)

    def __iter__(self) -> "WiktionaryDownloader":
        if not Path(LOCAL_FILE).exists():
            self.download()
        if self._file_handle is not None:
            self._file_handle.close()
        self._file_handle = gzip.open(LOCAL_FILE, "rt", encoding="utf-8")
        return self

    def __next__(self) -> tuple[str, list[str]]:
        for line in self._file_handle:
            try:
                result = self._parse_entry(json.loads(line.strip()))
            except json.JSONDecodeError:
                continue
            if result is not None:
                return result
        self._file_handle.close()
        self._file_handle = None
        raise StopIteration

    def __del__(self):
        if self._file_handle is not None:
            self._file_handle.close()
