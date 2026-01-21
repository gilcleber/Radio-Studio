
import { Request } from '../types';

// This is a mockup. In a real scenario, you would initialize Supabase here.
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export const saveSongRequest = async (songTitle: string, userName: string, message: string): Promise<Request> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newRequest: Request = {
    id: Math.random().toString(36).substr(2, 9),
    songTitle,
    userName,
    message,
    timestamp: new Date().toISOString()
  };

  // Here you would do: await supabase.from('requests').insert([newRequest]);
  console.log("Supabase Mock: Request saved", newRequest);
  return newRequest;
};

export const getLeaderboard = async () => {
  // Mock fetching leaderboard from Supabase
  return [
    { rank: "01", title: "Neon Nights", artist: "Synthwave Experience", rating: "98%" },
    { rank: "02", title: "Midnight City", artist: "Electronic Dreams", rating: "92%" },
    { rank: "03", title: "After Hours", artist: "Vibe Collective", rating: "89%" }
  ];
};
