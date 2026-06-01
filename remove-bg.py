from PIL import Image
import os

# Path to the logo
logo_path = "Black White Geometric Digital Startup Logo.jpg"
output_path = "logo-vittus.png"

# Open image
img = Image.open(logo_path).convert("RGBA")
pixels = img.load()

width, height = img.size

# Remove dark background - make dark pixels transparent
# The logo is white/silver on dark/black background
threshold = 45  # pixels darker than this become transparent

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # Calculate brightness
        brightness = (r + g + b) / 3
        
        if brightness < threshold:
            # Make fully transparent
            pixels[x, y] = (0, 0, 0, 0)
        elif brightness < threshold + 30:
            # Semi-transparent transition for smooth edges
            alpha = int(((brightness - threshold) / 30) * 255)
            pixels[x, y] = (r, g, b, alpha)
        # else: keep pixel as-is (fully opaque)

img.save(output_path, "PNG", optimize=True)
print(f"Logo saved: {output_path}")
print(f"   Size: {os.path.getsize(output_path)} bytes")
print(f"   Dimensions: {width}x{height}")
