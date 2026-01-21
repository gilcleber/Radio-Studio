
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number;
  rating: number;
  lyrics?: string[];
}

export interface Request {
  id: string;
  songTitle: string;
  userName: string;
  message: string;
  timestamp: string;
}

export interface User {
  name: string;
  tier: 'Free' | 'Pro' | 'Premium';
  likesGiven: number;
  hoursListened: number;
  avatarUrl: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
}

export interface Podcast {
  id: string;
  title: string;
  host: string;
  episodes: number;
  imageUrl: string;
  category: string;
}

export interface ScheduleItem {
  time: string;
  program: string;
  host: string;
}
