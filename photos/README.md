# photos/

Each folder here becomes an album at `/foto/<folder-name>`.

## Adding an album

1. Make a folder. The name becomes the URL and, by default, the title:
   `photos/coorg-monsoon/` -> `/foto/coorg-monsoon`, titled "Coorg Monsoon".
2. Drop JPEGs in. Filename order is display order (`01.jpg`, `02.jpg`, ...).
3. Commit. The build resizes everything and creates the album on its own.

That is the whole flow - it works from GitHub's web or mobile UI, no config
file and no code change needed.

## Optional polish

Add an `album.json` beside the photos to override anything derived:

```json
{
  "title": "Coorg, in the rain",
  "location": "Coorg",
  "date": "2024-07",
  "summary": "One sentence shown under the title.",
  "cover": "03",
  "order": 1
}
```

Every field is optional. `cover` is a filename without its extension; `order`
pins the album's position on `/foto` (lower first) - otherwise albums sort
newest `date` first.

## Notes

- Source files stay untouched; the build writes derivatives to `public/foto/`
  (git-ignored) and a manifest to `src/data/photos.generated.json`.
- Any size in is fine - orientation is read from EXIF and baked in, so no more
  sideways photos. Around 2560px on the long edge keeps the repo lean.
- Derivatives are cached, so a rebuild only touches photos you actually changed.
