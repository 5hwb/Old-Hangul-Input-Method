# Old Hangul Input Method

This is a Javascript-based IME for typing archaic Korean Hangul letters (e.g. ㅸ, ㅿ, ㅵ) easily in a Unicode-compliant manner. Works in all standards-compliant Web browsers!

## How to run

1. Download this repository to your device.
2. Open `main.html` and start typing

## Keyboard layout

![Old Hangul IME keyboard layout](KB_OldHangul.png)

## Note

* (ㅇ) represents the bottom half of the letters ᄛ, ᄝ, ᄫ, ᄬ, ᅗ.
* The [F] key indicates that any consonants typed after it are for the next syllable block.
* For best results, install the 'NanumBarunGothic YetHangul' sans-serif font - most Korean Hangul fonts do not support archaic Hangul and this was the best one I could find.
  * To try other fonts, open `main.html` in a text editor. In the line containing `font-family: "NanumBarunGothic YetHangul", normal;`, replace 'NanumBarunGothic YetHangul' with the name of the preferred font.
