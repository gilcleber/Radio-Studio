
import { Song, User, TeamMember, Podcast, ScheduleItem } from './types';

export const MOCK_USER: User = {
  name: "Alex Rivera",
  tier: "Premium",
  likesGiven: 1240,
  hoursListened: 450,
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200"
};

export const MOCK_SONGS: Song[] = [
  {
    id: "1",
    title: "Gratitude",
    artist: "Brandon Lake",
    album: "House of Miracles",
    coverUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800",
    duration: 312,
    rating: 98,
    lyrics: [
      "All my words are few",
      "Things are new",
      "So I throw up my hands",
      "And praise You again and again",
      "'Cause all that I have is a hallelujah",
      "Hallelujah",
      "I know it's not much",
      "But I've nothing else fit for a King"
    ]
  },
  {
    id: "2",
    title: "Firm Foundation",
    artist: "Cody Carnes",
    album: "The Night of Worship",
    coverUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800",
    duration: 285,
    rating: 95
  }
];

export const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Sarah Jenkins', role: 'Morning Host', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', bio: 'Trazendo esperança para suas manhãs.' },
  { id: '2', name: 'David Cloud', role: 'Worship Director', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', bio: 'Especialista em curadoria Worship Internacional.' },
  { id: '3', name: 'Grace Lee', role: 'Devotional Lead', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', bio: 'Sua voz para meditação e oração.' }
];

export const MOCK_PODCASTS: Podcast[] = [
  { id: '1', title: 'Deep Worship', host: 'David Cloud', episodes: 45, imageUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=400', category: 'Música' },
  { id: '2', title: 'Daily Grace', host: 'Grace Lee', episodes: 120, imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', category: 'Devocional' },
  { id: '3', title: 'The Heart of a Leader', host: 'Sarah Jenkins', episodes: 12, imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400', category: 'Liderança' }
];

export const WEEKLY_SCHEDULE: ScheduleItem[] = [
  { time: '06:00 - 09:00', program: 'Amanhecer com Fé', host: 'Sarah Jenkins' },
  { time: '09:00 - 12:00', program: 'Worship Flow', host: 'David Cloud' },
  { time: '12:00 - 14:00', program: 'Conexão Meio-Dia', host: 'Grace Lee' },
  { time: '14:00 - 18:00', program: 'Top 40 Internacional', host: 'DJ Rádio AI' }
];
