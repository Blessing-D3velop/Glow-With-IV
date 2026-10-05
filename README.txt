Drop your real assets into this folder using these exact names and the site
will pick them up automatically — nothing else needs to change.

  logo.jpg          -> the Glow With IV logo (used in header, footer, and as favicon)
  hero.jpg           -> full-width background photo for the Home/Hero section
  image-1.jpeg ... image-15.jpeg -> the 15 gallery photos

Three of these filenames are also reused elsewhere on the page (so a few
gallery photos effectively appear twice — once in the gallery grid, once as
a feature image):
  image-1.jpeg  -> About section photo
  image-2.jpeg  -> Microneedling & Facial Services card
  image-3.jpeg  -> Slimming Injections card
  image-4.jpeg  -> Skincare Range card

Note on logo.jpg: JPEG can't have a transparent background. The header/
footer already put the logo on a small white circular plate so it stays
legible over the hero photo and the dark footer — but if you're able to
send a transparent PNG instead, it'll blend in even more cleanly. Just
name it logo.png and let Claude know so the file reference can be updated.

Recommended sizes:
  logo.jpg     : square, at least 400x400px
  hero.jpg     : at least 1920x1080px, landscape (a dark overlay is applied
                 automatically for text legibility)
  gallery images: at least 800x800px, square-ish crops look cleanest
