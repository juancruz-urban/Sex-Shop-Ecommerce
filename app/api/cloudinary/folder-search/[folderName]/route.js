// app/api/cloudinary/folder-images/[folderName]/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET(request, { params }) {
  try {
    const { folderName } = await params;
    
    // Limpiar el nombre de la carpeta
    const cleanFolder = folderName.replace(/^\/+|\/+$/g, '');
    
    // Usar Search API en lugar de resources
    const result = await cloudinary.search
      .expression(`folder="${cleanFolder}"`)  // 👈 Sintaxis correcta para carpetas
      .with_field('context')
      .with_field('tags')
      .max_results(100)
      .execute();

    // Mapear resultados (misma estructura que antes)
    const images = result.resources.map(r => ({
      public_id: r.public_id,
      folder: r.public_id.split('/')[0] || 'raíz',
      url: r.secure_url,
      id: r.public_id.slice(0, 2),
      context: r.context || null,
      tags: r.tags || []
    }));

    return NextResponse.json({
      success: true,
      carpeta_solicitada: cleanFolder,
      total_encontradas: images.length,
      imagenes: images
    });

  } catch (error) {
    console.error('Error en folder-images:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}