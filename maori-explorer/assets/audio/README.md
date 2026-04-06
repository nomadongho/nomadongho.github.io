# Audio Files

This directory is reserved for recorded Māori audio files.

## How to Add Audio

For each vocabulary item, place a `.mp3` or `.ogg` file here and update the `audio` field in `data.js`.

### File naming convention

Use the item's `id` field as the filename, e.g.:
- `kia-ora.mp3`
- `morena.mp3`
- `tahi.mp3`
- `whero.mp3`

### Updating data.js

In `data.js`, update the `audio` field for each item:

```js
{
  id: "kia-ora",
  maori: "Kia ora",
  // ...
  audio: "assets/audio/kia-ora.mp3"   // ← add path here
}
```

When `audio` is `null`, the app falls back to browser SpeechSynthesis using the Māori locale (`mi-NZ`).

## Audio Recording Tips

- Record by a fluent Te Reo Māori speaker
- Keep clips short (1–2 seconds per word/phrase)
- Export as MP3 at 128kbps, mono channel
- Normalize audio to avoid clipping
