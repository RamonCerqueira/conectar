import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Auto copy clinic assets on next.config.ts load/reload
try {
  const src1 = "C:\\Users\\Ramon DevTec\\.gemini\\antigravity-ide\\brain\\b1a52cc7-b1f6-4f4f-ab0c-36f173906c2a\\hero_clinic_photo_1782589799634.png";
  const src2 = "C:\\Users\\Ramon DevTec\\.gemini\\antigravity-ide\\brain\\b1a52cc7-b1f6-4f4f-ab0c-36f173906c2a\\reception_clinic_photo_1782589845045.png";
  const srcLogo = "C:\\Users\\Ramon DevTec\\.gemini\\antigravity-ide\\brain\\b1a52cc7-b1f6-4f4f-ab0c-36f173906c2a\\media__1782561486091.png";
  const srcParallax = "C:\\Users\\Ramon DevTec\\.gemini\\antigravity-ide\\brain\\b1a52cc7-b1f6-4f4f-ab0c-36f173906c2a\\parallax_clinic_room_1782598318110.png";
  
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // 1. Sync generated assets
  if (fs.existsSync(src1)) fs.copyFileSync(src1, path.join(publicDir, "hero_clinic_photo.png"));
  if (fs.existsSync(src2)) fs.copyFileSync(src2, path.join(publicDir, "reception_clinic_photo.png"));
  if (fs.existsSync(srcLogo)) fs.copyFileSync(srcLogo, path.join(publicDir, "logo.png"));
  if (fs.existsSync(srcParallax)) fs.copyFileSync(srcParallax, path.join(publicDir, "parallax_clinic_room.png"));
  
  // 2. Clean up deprecated static files that intercept Next.js routing at '/'
  const filesToDelete = ["index.html", "style.css", "app.js"];
  filesToDelete.forEach(file => {
    const filePath = path.join(publicDir, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Successfully cleaned up deprecated static file: ${file}`);
    }
  });

  console.log("Clinic assets synced successfully in public/ directory!");
} catch (e: any) {
  console.error("Config assets sync/cleanup error:", e.message);
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
