# Public Assets

This folder contains static assets that are served directly.

## Crown Image

**File:** `crown-placeholder.png` or `crown-placeholder.gif`

### How to Replace:

1. **Prepare your image:**
   - Recommended size: 40x40 pixels (or larger, it will be scaled)
   - Supported formats: PNG (with transparency) or GIF (animated)
   - Transparent background recommended for best appearance

2. **Add the image:**
   - Place your crown image in this folder (`public/`)
   - Name it `crown-placeholder.png` or `crown-placeholder.gif`

3. **Alternative names:**
   If you want to use a different filename, update the `src` in `src/app/page.tsx`:
   ```tsx
   <img
     src="/your-image-name.png"  // Change this
     alt="Crown"
   />
   ```

### Fallback:

If the image is not found, a crown emoji (👑) will be displayed automatically.

### Recommended Image Sources:

- **Flaticon:** https://www.flaticon.com/search?word=crown
- **Icons8:** https://icons8.com/icons/set/crown
- **Freepik:** https://www.freepik.com/search?format=search&query=crown%20icon

### Current Usage:

The crown image appears:
- On the main page header next to "您的主治醫師達特喂"
- Size: 40x40 pixels (scaled automatically)
