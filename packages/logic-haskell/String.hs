module String (join, wrap) where

join2 :: String -> String -> String -> String
join2 del l r = l ++ del ++ r

join :: String -> [String] -> String
join del (x:xs) = foldl (join2 del) x xs

wrap :: String -> String -> String
wrap del s = del ++ s ++ del
