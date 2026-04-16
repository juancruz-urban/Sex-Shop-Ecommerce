// app/api/cloudinary/test/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // Obtener solo las primeras 20 imágenes sin filtrar por carpeta
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 58,
      resource_type: 'image',
    });

    // Extraer información útil
    const images = result.resources.map(r => ({
      public_id: r.public_id,
      folder: r.public_id.includes('/') ? r.public_id.split('/')[0] : 'raíz',
      url: r.secure_url,
      id: r.public_id.slice(0,2)
    }));

    // Obtener todas las carpetas
    const folders = await cloudinary.api.root_folders();

    return NextResponse.json({
      total_imagenes: result.total_count,
      primeras_20_imagenes: images,
      carpetas_en_raiz: folders.folders.map(f => f.name)
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}