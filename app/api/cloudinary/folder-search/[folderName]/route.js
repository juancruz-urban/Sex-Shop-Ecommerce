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
    const { folderName } = params;
    
    // Usar EXACTAMENTE la misma lógica que tu endpoint test
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderName, // Filtra por carpeta
      max_results: 100,
      resource_type: 'image',
    });

    // Mismo formato que tu test
    const images = result.resources.map(r => ({
      public_id: r.public_id,
      folder: r.public_id.includes('/') ? r.public_id.split('/')[0] : 'raíz',
      url: r.secure_url,
      id: r.public_id.slice(0, 2)
    }));

    return NextResponse.json({
      success: true,
      carpeta_solicitada: folderName,
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