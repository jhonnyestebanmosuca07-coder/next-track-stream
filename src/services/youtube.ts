export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

interface YouTubeSearchResponse {
  items?: Array<{
    id?: { videoId?: string };
    snippet?: {
      title?: string;
      channelTitle?: string;
      thumbnails?: { medium?: { url?: string }; default?: { url?: string } };
    };
  }>;
  error?: { message?: string };
}

export const searchEmbeddableYouTubeVideos = async (
  title: string,
  artist: string,
  maxResults = 5
): Promise<YouTubeSearchResult[]> => {
  // Set this in .env.local; never hard-code or commit a real API key here.
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('Falta configurar VITE_YOUTUBE_API_KEY para buscar videos insertables.');
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', `${artist} ${title} official music`);
  url.searchParams.set('type', 'video');
  url.searchParams.set('videoEmbeddable', 'true');
  url.searchParams.set('videoSyndicated', 'true');
  url.searchParams.set('maxResults', String(Math.min(Math.max(maxResults, 1), 10)));
  url.searchParams.set('key', apiKey);

  const response = await fetch(url);
  const payload: YouTubeSearchResponse = await response.json();
  if (!response.ok) {
    throw new Error(payload.error?.message || `La búsqueda de YouTube falló (${response.status}).`);
  }

  return (payload.items || []).flatMap((item) => {
    const videoId = item.id?.videoId;
    const snippet = item.snippet;
    if (!videoId || !snippet?.title || !snippet.channelTitle) return [];
    return [{
      videoId,
      title: snippet.title,
      channelTitle: snippet.channelTitle,
      thumbnailUrl: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
    }];
  });
};
