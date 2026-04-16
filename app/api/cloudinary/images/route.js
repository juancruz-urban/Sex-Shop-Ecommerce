// app/api/cloudinary/images/route.js (versión mejorada)
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'products-lubricantes';
    const limit = parseInt(searchParams.get('limit') || '1000'); // Límite máximo de imágenes
    const includeSubfolders = searchParams.get('includeSubfolders') === 'true';
    
    console.log('📁 Buscando en carpeta:', folder);
    console.log('🔄 Incluir subcarpetas:', includeSubfolders);
    
    // Opciones de búsqueda
    const options = {
      type: 'upload',
      resource_type: 'image',
      max_results: 100,
    };
    
    // Si queremos incluir subcarpetas, usamos prefix
    if (includeSubfolders) {
      options.prefix = folder;
    } else {
      // Si no queremos subcarpetas, necesitamos filtrar después
      options.prefix = folder;
    }
    
    let allResources = [];
    let nextCursor = null;
    let hasMore = true;
    
    // Recorrer todas las páginas de resultados
    while (hasMore && allResources.length < limit) {
      if (nextCursor) {
        options.next_cursor = nextCursor;
      }
      
      const result = await cloudinary.api.resources(options);
      
      // Filtrar solo imágenes de la carpeta exacta (sin subcarpetas si no queremos)
      let resources = result.resources;
      if (!includeSubfolders) {
        resources = result.resources.filter(resource => {
          const publicId = resource.public_id;
          const pathParts = publicId.split('/');
          // Solo incluir si la carpeta principal coincide exactamente
          return pathParts.length === 2 && pathParts[0] === folder;
        });
      }
      
      allResources.push(...resources);
      
      nextCursor = result.next_cursor;
      hasMore = !!nextCursor;
      
      if (hasMore) {
        console.log(`📄 Procesando página... ${allResources.length} imágenes encontradas`);
      }
    }
    
    // Limitar si excede el límite
    if (allResources.length > limit) {
      allResources = allResources.slice(0, limit);
    }
    
    console.log(`✅ Total de imágenes encontradas: ${allResources.length}`);
    
    // Formatear imágenes
    const images = allResources.map((resource) => {
      const folderName = resource.public_id.includes('/') 
        ? resource.public_id.split('/')[0] 
        : 'raíz';
      
      return {
        id: resource.public_id,
        publicId: resource.public_id,
        folder: folderName,
        url: resource.secure_url,
        optimizedUrl: cloudinary.url(resource.public_id, {
          fetch_format: 'auto',
          quality: 'auto',
          secure: true,
        }),
        thumbnailUrl: cloudinary.url(resource.public_id, {
          width: 300,
          height: 300,
          crop: 'fill',
          gravity: 'auto',
          fetch_format: 'auto',
          quality: 'auto',
          secure: true,
        }),
        responsiveUrl: cloudinary.url(resource.public_id, {
          width: 800,
          crop: 'scale',
          fetch_format: 'auto',
          quality: 'auto',
          secure: true,
        }),
        width: resource.width,
        height: resource.height,
        format: resource.format,
        size: resource.bytes,
        sizeKB: (resource.bytes / 1024).toFixed(2),
        sizeMB: (resource.bytes / (1024 * 1024)).toFixed(2),
        createdAt: resource.created_at,
        updatedAt: resource.updated_at,
      };
    });
    
    return NextResponse.json({
      success: true,
      images,
      total: images.length,
      folder: folder,
      includeSubfolders: includeSubfolders,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    
    // Manejar errores específicos de Cloudinary
    if (error.error && error.error.message) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.error.message,
          code: error.error.code
        },
        { status: error.http_code || 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener las imágenes',
        details: error.message 
      },
      { status: 500 }
    );
  }
}