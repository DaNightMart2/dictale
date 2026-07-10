import String
import Json

data GameState = GameState
    { game_word :: FinalWord
    , game_defs :: [Definition]
    }

map_game_defs :: (Definition -> Definition) -> GameState -> GameState
map_game_defs f game = game { game_defs = map f (game_defs game) }

guess_str :: String -> GameState -> GameState
guess_str = map_game_defs . map_def_words . guess_if_match

reveal_char :: Char -> GameState -> GameState
reveal_char = map_game_defs . map_def_words . map_word_lets . reveal_if_eq

data FinalWord = FinalWord [Char]

data Definition = Definition
    { def_id :: Int
    , def_words :: [DefinitionWord]
    }

map_def_words :: (DefinitionWord -> DefinitionWord) -> Definition -> Definition
map_def_words f def = def { def_words = map f (def_words def) }

data DefinitionWord = DefinitionWord
    { word_id :: Int
    , word_letters :: [Letter]
    }

map_word_lets :: (Letter -> Letter) -> DefinitionWord -> DefinitionWord
map_word_lets f w = w { word_letters = map f (word_letters w) }

word_norm :: DefinitionWord -> String
word_norm = map letter_char . word_letters

word_match :: DefinitionWord -> String -> Bool
word_match w s = word_norm w == s

guess_if_match :: String -> DefinitionWord -> DefinitionWord
guess_if_match s w | word_match w s = map_word_lets (change_state Guessed) w
                   | otherwise      = w

data Letter = Letter
    { letter_char :: Char
    , letter_state :: LetterState
    }
data LetterState = Unknown | Guessed | Revealed deriving Eq

change_state :: LetterState -> Letter -> Letter
change_state s l = l { letter_state = s }

letter_norm :: Letter -> Char
letter_norm = letter_char

letter_match :: Letter -> Char -> Bool
letter_match l c = letter_norm l == c

reveal_if_eq :: Char -> Letter -> Letter
reveal_if_eq c l | letter_match l c   = l { letter_state = Revealed }
                 | otherwise          = l

display_letter :: Letter -> Char
display_letter l | letter_state l == Unknown = '_'
                 | otherwise                 = letter_char l

serialize_letter :: Letter -> String
serialize_letter l = serialize [ (KeyValue "char" [display_letter l]) ]

word = (DefinitionWord 0 [(Letter 'a' Unknown)])
game = GameState (FinalWord "hola") [ (Definition 0 [ word ]) ]

main :: IO ()
main = putStrLn "Hello!"
