from abc import ABC, abstractmethod

class BinaryConverter(ABC):
    @abstractmethod
    def text_to_binary(self, text: str) -> str: pass
    @abstractmethod
    def binary_to_text(self, binary: str) -> str: pass
