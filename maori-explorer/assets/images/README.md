# Images / Illustrations

This directory is reserved for future illustration and icon assets.

## Placeholder

Currently the app uses emoji for all visual representations. To replace with custom illustrations:

1. Add your image files here (PNG, SVG, or WebP recommended).
2. Update the `emoji` field in `data.js` or modify the rendering functions in `script.js` to use `<img>` tags.

### Suggested file structure

```
assets/images/
  modules/
    greetings.png
    numbers.png
    colors.png
    family.png
    animals.png
    body-parts.png
    feelings.png
  vocab/
    kia-ora.png
    morena.png
    tahi.png
    ...
  mascot/
    mascot-happy.png
    mascot-wave.png
```

## Image Guidelines

- Recommended size: 256×256 px for vocabulary cards, 512×512 for module headers
- Use WebP for best performance
- Keep file sizes under 50KB per image
- Use child-safe, culturally respectful illustrations
