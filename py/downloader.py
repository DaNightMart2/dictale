#!/usr/bin/env python3
"""
Dictionary Downloader for Spanish Word Game
"""

import argparse
import json
from pathlib import Path
import random
from typing import List, Optional

from downloaders.wiktionary import WiktionaryDownloader


def parse_args():
    parser = argparse.ArgumentParser(
        description="Download Spanish dictionary definitions"
    )
    parser.add_argument(
        "--source",
        choices=["wiktionary", "rae"],
        required=True,
        help="Dictionary source to use",
    )
    parser.add_argument(
        "--word-list",
        dest="word_list",
        type=str,
        default=None,
        help="Only use words from this list",
    )
    parser.add_argument(
        "--word-limit",
        dest="word_limit",
        type=int,
        default=None,
        help="Maximum number of words to process",
    )
    parser.add_argument(
        "--output-file",
        dest="output_file",
        type=str,
        default="definitions.json",
        help="Output file name",
    )
    return parser.parse_args()


def main():
    args = parse_args()

    # 1) Load word_list if set
    word_list = None
    if args.word_list:
        word_list = load_word_list(args.word_list)

    # 2) Select source downloader
    if args.source == "wiktionary":
        print("\n=== Using Wiktionary ===")
        downloader = WiktionaryDownloader()

    elif args.source == "rae":
        raise NotImplementedError("rae downloading not supported yet")

    # 3) Read words
    processed = 0
    output = []
    for word, defs in downloader:
        processed += 1
        if len(output) >= args.word_limit:
            break
        if word_list and word not in word_list:
            continue
        if len(word) not in range(4, 10):
            continue
        if len(" ".join(defs)) not in range(100, 200):
            continue
        if word in " ".join(defs):
            continue
        print(f"Found the {len(output)}th word (processed = {processed})")
        output.append({"word": word, "definitions": defs})

    random.shuffle(output)

    # 4) Save to .json file
    with open(args.output_file, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=4)

    print(f"Saved {len(output)} words to {args.output_file}")


def load_word_list(word_list_path: Path) -> List[str]:
    with open(word_list_path, "r", encoding="utf-8") as word_list_file:
        words = [line.split("\t")[0].strip().lower() for line in word_list_file]
    return words


if __name__ == "__main__":
    main()
