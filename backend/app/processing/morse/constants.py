"""
International Morse Code Dictionary Mapping Constants.
"""

# International Morse Code mapping dictionary
CHAR_TO_MORSE = {
    # Alphabetic (Uppercase)
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "V": "...-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--..",
    # Numeric
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    # Punctuation & Symbols
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "!": "-.-.--",
    ":": "---...",
    ";": "-.-.-.",
    "'": ".----.",
    '"': ".-..-.",
    "@": ".--.-.",
    "&": ".-...",
    "(": "-.--.",
    ")": "-.--.-",
    "+": ".-.-.",
    "-": "-....-",
    "/": "-..-.",
    "=": "-...-",
    "_": "..--.-",
    "$": "...-..-",
}

# Reverse mapping for O(1) decoding lookup
MORSE_TO_CHAR = {v: k for k, v in CHAR_TO_MORSE.items()}

# Morse Code Delimiters
DOT = "."
DASH = "-"
CHAR_SEPARATOR = "/"
WORD_SEPARATOR = " "
