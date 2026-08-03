from abc import ABC, abstractmethod

class MorseProcessor(ABC):
    @abstractmethod
    def text_to_morse(self, text: str) -> str: pass
    @abstractmethod
    def morse_to_text(self, morse: str) -> str: pass
