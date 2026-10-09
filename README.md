# Leyendas del Rock & Next Track

## Ejecutar localmente

**Requisito:** Node.js LTS (incluye npm).

1. Abre una terminal en la carpeta del proyecto.
2. Instala las dependencias (solo la primera vez): `npm install`
3. Inicia el servidor de desarrollo: `npm run dev`
4. Abre `http://localhost:3001`.

No abras `index.html` con Live Server ni como archivo local. El proyecto usa React, TypeScript y Vite, que deben transformar la aplicación antes de que el navegador pueda ejecutarla.

Las canciones se reproducen desde el reproductor oficial integrado de YouTube. La disponibilidad depende del video, la región y las condiciones de reproducción de YouTube. Si un video no se puede insertar, usa los enlaces para probarlo en YouTube, buscar otra versión oficial o buscar la canción en SoundCloud. La aplicación no evita restricciones de acceso ni garantiza que cada plataforma tenga todas las canciones disponibles gratuitamente.

## Búsqueda de videos insertables

Para habilitar la búsqueda automática de una versión que permita inserción:

1. Crea una API key de YouTube Data API v3 en Google Cloud.
2. Restringe la key a YouTube Data API v3 y a los dominios HTTP de tu sitio.
3. Crea `.env.local` desde `.env.example` y define `VITE_YOUTUBE_API_KEY` con esa key.
4. Reinicia Vite.

La búsqueda solicita `type=video`, `videoEmbeddable=true` y `videoSyndicated=true`. Las variables `VITE_*` quedan visibles en el navegador, por lo que la key debe estar restringida. YouTube puede seguir limitando videos por región, cuenta o cambios de disponibilidad; en ese caso se muestra un enlace al video original en lugar de intentar saltarse la restricción.

## Publicar en GitHub Pages

El workflow de GitHub Actions en `.github/workflows/deploy-pages.yml` compila y publica el sitio al subir cambios a `main`. En la configuración del repositorio, selecciona **Settings > Pages > Build and deployment > Source: GitHub Actions**.

Para habilitar la búsqueda de canciones publicada, agrega `VITE_YOUTUBE_API_KEY` como un *Actions secret* en **Settings > Secrets and variables > Actions**. La key termina incluida en el JavaScript del navegador; restríngela en Google Cloud a YouTube Data API v3 y al dominio `https://<usuario>.github.io/*`. Sin el secret, el sitio se publica igualmente, pero la búsqueda de reemplazos de YouTube no estará disponible.

El sitio estará en `https://<usuario>.github.io/<nombre-del-repositorio>/` cuando termine correctamente la primera ejecución del workflow.
