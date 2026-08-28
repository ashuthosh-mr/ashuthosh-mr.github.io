# photos/

Each folder here becomes an album at `/foto/<folder-name>`.

## Adding an album

1. Make a folder. The name becomes the URL and, by default, the title:
   `photos/coorg-monsoon/` -> `/foto/coorg-monsoon`, titled "Coorg Monsoon".
2. Drop JPEGs in. Filename order is display order (`01.jpg`, `02.jpg`, ...).
3. Commit. The build resizes everything and creates the album on its own.

That is the whole flow - it works from GitHub's web or mobile UI, no config
file and no code change needed.

## Adding a single photo, with no album

Drop it straight into `photos/`, in no folder at all:

    photos/cat-in-the-sun.jpg

It appears on `/foto` among the individual photographs at the top and never
becomes an album of one. Loose frames sort by filename and come before the
curated picks, so a `2026-08-` style prefix keeps them in the order you want.

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

## The featured strip

`/foto` opens with a row of individual frames, above the albums. Curate it by
listing frames in `photos/featured.json`, in the order you want them shown:

```json
["nesara/03", "bhootha-kola/05", "banneraghatta-zoo/02"]
```

Each entry is `<album-folder>/<filename-without-extension>`. Clicking a featured
frame opens it full screen with a link through to its album, so a single photo
never loses its series.

Delete the file (or empty the list) and the strip falls back to the newest
album's first few frames - so it is never empty, and never needs maintaining if
you would rather it just showed your latest work.

## Notes

- Source files stay untouched; the build writes derivatives to `public/foto/`
  (git-ignored) and a manifest to `src/data/photos.generated.json`.
- Any size in is fine - orientation is read from EXIF and baked in, so no more
  sideways photos. Around 2560px on the long edge keeps the repo lean.
- Derivatives are cached, so a rebuild only touches photos you actually changed.
