from PIL import Image
import os

path = r"C:\Users\User.DESKTOP-G7MUU21\OneDrive\Anexos\SITE VITTUS\logo-rocha-new.png"
out = r"C:\Users\User.DESKTOP-G7MUU21\OneDrive\Anexos\SITE VITTUS\logo-rocha-white.png"

img = Image.open(path).convert("RGBA")
pixels = img.load()
width, height = img.size

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        if a > 10:
            pixels[x, y] = (255, 255, 255, a)

img.save(out, "PNG", optimize=True)
print(f"Done: {os.path.getsize(out)} bytes")
