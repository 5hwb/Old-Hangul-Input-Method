# Old Hangul Input Method

This is a Javascript-based IME for typing archaic Korean Hangul letters (e.g. ㅸ, ㅿ, ㅵ) easily in a Unicode-compliant manner. Works in all standards-compliant Web browsers!

## How to run

1. Download this repository to your device.
2. Open `main.html` and start typing

## Keyboard layout

![Old Hangul IME keyboard layout](KB_OldHangul.png)

## Note

* (ㅇ) represents the bottom circular half of the letters ᄛ, ᄝ, ᄫ, ᄬ, ᅗ.
* The [F] key indicates that any consonants typed after it are for the next syllable block. For instance: ᄋ+ᅡ+ᄉ+ᄃ+ᅡ = 앗다, while ᄋ+ᅡ+[F]+ᄉ+ᄃ+ᅡ = 아ᄯᅡ.
* For best results, install the 'Noto Sans CJK KR' sans-serif font - most Korean Hangul fonts do not support archaic Hangul.
  * To try other fonts, open `main.html` in a text editor. In the line containing `font-family: "Noto Sans CJK KR", normal;`, replace 'Noto Sans CJK KR' with the name of the preferred font.
  * Some other fonts which support archaic Hangul include 'NanumBarunGothic YetHangul' and 'NanumMyeongjo YetHangul' (both are decent looking but are slightly buggy).

## Diagrams

### Hangul jamo hierarchy

This is a diagram of all the Old Hangul characters that can be typed using the Old Hangul Input Method.

![Hangul jamo hierarchy diagram](HangulJamoHierarchyDiagram.png)

### Finite state machine

This diagram shows all the internal states and transitions of the Old Hangul Input Method.

![OldHangulIME_FSM](OldHangulIME_FSM.png)

## TODOs

* Update the jamo hierarchy diagram
