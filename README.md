# ChordAir

**ChordAir** is a Progressive Web App (PWA) for learning to recognize piano chords from the shapes of their keys through short, interactive flashcard practice.

## Features

- **Interactive 2-Octave Piano Keyboard (`C4`–`B5`):**
  - Multi-cue chord highlighting (color + high-contrast borders + `★` lowest/bass note badge + `●` chord tone markers + note name pills).
  - Built-in Web Audio API polyphonic synthesizer (click any key or press `Space` / **Hear chord** to listen).
- **Beginner-Friendly Chord Settings:**
  - **Beginner (Default):** Major and minor triads (`C major` · `C`, `C minor` · `Cm`).
  - **More triads:** Major, minor, diminished, and augmented triads.
  - **Seventh chords:** Major 7th, Dominant 7th, Minor 7th, Half-diminished 7th, and Diminished 7th.
  - **Custom:** Toggle individual chord qualities with plain-language descriptions.
  - **Root Position & Inversions:** Start in root position or enable 1st, 2nd, and 3rd inversions with plain-language explanations.
- **Accessible & Keyboard-First:**
  - Answer with keys `1`–`4`, press `Enter` or `→` for the next card, and `Space` to play the chord sound.
  - Screen-reader live regions (`aria-live="polite"`) announce highlighted notes and answer feedback.

## Scripts

```bash
# Start local development server
npm run dev

# Run unit tests
npm run test:run

# Build production bundle to dist/
npm run build

# Run tests, build, and deploy dist/ to the `prod` branch for GitHub Pages
npm run deploy
```
