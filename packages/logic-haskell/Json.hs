module Json (KeyValue(..), serialize) where
import String

data KeyValue = KeyValue {
    key :: String,
    value :: String
}

build :: String -> String -> KeyValue
build k v = KeyValue { key = k, value = v }

wrap_quotes :: String -> String
wrap_quotes = wrap "\""

wrap_brackets :: String -> String
wrap_brackets s = "{\n" ++ s ++ "\n}"

kv_str :: KeyValue -> String
kv_str kv = (wrap_quotes (key kv)) ++ ": " ++ (wrap_quotes (value kv))

serialize :: [KeyValue] -> String
serialize = wrap_brackets . (join ",\n") . (map kv_str)
