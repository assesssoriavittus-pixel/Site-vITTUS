from PIL import Image
import math
import sys

def extract(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    bg_r, bg_g, bg_b, _ = pixels[0, 0]
    
    # We will compute the max distance found to normalize alpha
    max_d = 0
    d_map = []
    
    for y in range(height):
        row = []
        for x in range(width):
            r, g, b, a = pixels[x, y]
            d = math.sqrt((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)
            max_d = max(max_d, d)
            row.append(d)
        d_map.append(row)
        
    for y in range(height):
        for x in range(width):
            d = d_map[y][x]
            
            # If color is close to background, make it transparent
            if d < 15:
                pixels[x, y] = (255, 255, 255, 0)
            else:
                # Map distance to alpha for smooth anti-aliasing
                # Using a curve to make the logo solid white while edges fade out
                normalized = min(1.0, (d - 15) / 50.0) 
                # Anything with distance > 65 from bg becomes fully opaque white
                alpha = int(255 * normalized)
                pixels[x, y] = (255, 255, 255, alpha)

    img.save(output_path, "PNG")
    print("Done")

if __name__ == "__main__":
    extract(r"C:\Users\User.DESKTOP-G7MUU21\Downloads\site rochaa\logo vetorizada.png", 
            r"C:\Users\User.DESKTOP-G7MUU21\OneDrive\Anexos\SITE VITTUS\logo-rocha-v3.png")
