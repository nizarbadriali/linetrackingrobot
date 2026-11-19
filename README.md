# ECE 5 Lab 4 – Line Tracking Robot

Project website for our ECE 5 (UC San Diego) Lab 4 line-following robot.

**Team 69 – KANT:** Kevin Nguyen · Alex Chrikjian · Nizar Ali · Tanzim Rahman

## Editing the site

- All content is in `index.html`.
- Put photos in `images/` using these filenames (or change the `src` in `index.html`):

| File | Section |
|---|---|
| `images/team-photo.jpg` | Competition day team photo |
| `images/build-potentiometers.jpg` | Build – 1A Potentiometers |
| `images/build-photoresistors.jpg` | Build – 1B Photoresistors |
| `images/build-motors.jpg` | Build – 1C Motor driver & ESP32 |
| `images/build-cad.png` | Build – 1D CAD screenshot |
| `images/assembly-1.jpg`, `images/assembly-2.jpg` | Assembly |
| `images/robot-final.jpg` | Annotated final robot photo |
| `images/robot-side.jpg`, `images/robot-bottom.jpg` | Extra robot views |
| `images/poster.png` (+ optional `images/poster.pdf`) | Week 10 poster |

- **Annotations on the final robot photo:** each label in `index.html` (search `ANNOTATED PHOTO`) has
  `data-x`/`data-y` (where the arrow points, % of the image) and `data-lx`/`data-ly` (where the label sits).
  Adjust them until the arrows land on the right parts.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Publishing (GitHub Pages)

1. Push to `main`.
2. On GitHub, go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**,
   then pick branch `main` and folder `/ (root)`.
3. The site will be live at `https://nizarbadriali.github.io/linetrackingrobot/`.
4. The repo must be **public** so anyone can open the link. Test it in a private/incognito window.
