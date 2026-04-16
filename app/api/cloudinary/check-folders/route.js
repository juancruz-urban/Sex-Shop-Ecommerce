// app/api/cloudinary/check-folders/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // Método 1: Obtener carpetas raíz
    const foldersResult = await cloudinary.api.root_folders();
    
    // Método 2: Obtener algunas imágenes para ver su estructura
    const imagesResult = await cloudinary.api.resources({
      type: 'upload',
      max_results: 10,
    });
    
    // Extraer las carpetas de los public_id
    const foldersFromImages = new Set();
    imagesResult.resources.forEach(img => {
      const parts = img.public_id.split('/');
      if (parts.length > 1) {
        foldersFromImages.add(parts[0]); // Primera parte es la carpeta
      }
    });
    
    return NextResponse.json({
      success: true,
      root_folders_api: foldersResult.folders.map(f => f.name),
      folders_detectadas_de_imagenes: Array.from(foldersFromImages),
      sample_images: imagesResult.resources.slice(0, 3).map(img => ({
        public_id: img.public_id,
        folder: img.public_id.includes('/') ? img.public_id.split('/')[0] : 'sin carpeta'
      }))
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}