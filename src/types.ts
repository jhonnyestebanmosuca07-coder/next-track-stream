export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  category: 'rock' | 'espanol' | 'urbano';
  cover: string;
  duration: string;
  durationSec: number;
  youtubeId: string;
  alternativeYoutubeId?: string;
  isFavorite: boolean;
  historyNum?: number;
  wireframe4?: boolean;
  versionType?: 'remix' | 'envivo' | 'estudio' | 'acustico';
  versionLabel?: string;
  isFixedOrRemix?: boolean;
  fixedNote?: string;
  audioPreviewUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  bio: string;
  topTracks: string[];
  featuredYoutubeId: string;
}

export interface ArtistPlaylist {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  cover: string;
  description: string;
  songIds: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  bandRequest: string;
  message: string;
  date: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  commentsCount: number;
  date: string;
  isLiked?: boolean;
}

export interface InstagramDM {
  id: string;
  sender: 'user' | 'leyendas';
  text: string;
  time: string;
}

export type NavTab = 
  | 'inicio' 
  | 'explorar' 
  | 'artistas' 
  | 'playlists' 
  | 'listas' 
  | 'favoritos' 
  | 'perfil' 
  | 'contacto'
  | 'instagram';

