import React, { useEffect, useState } from 'react';
import { voteSong, getSongVotes, getUserVote } from '../services/votingService';

interface VoteButtonProps {
    songId: string;
}

export const VoteButton: React.FC<VoteButtonProps> = ({ songId }) => {
    const [stats, setStats] = useState({ likes: 0, dislikes: 0, approval: 0 });
    const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);

    useEffect(() => {
        loadStats();
        checkUserVote();
    }, [songId]);

    const loadStats = async () => {
        const data = await getSongVotes(songId);
        setStats(data);
    };

    const checkUserVote = async () => {
        const vote = await getUserVote(songId);
        setUserVote(vote);
    };

    const handleVote = async (type: 'like' | 'dislike') => {
        // Optimistic Update
        if (userVote === type) return; // Prevent double vote of same type

        setUserVote(type);
        await voteSong(songId, type);
        await loadStats(); // Refresh stats
    };

    return (
        <>
            <button
                onClick={() => handleVote('like')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${userVote === 'like' ? 'text-neon-cyan bg-white/10' : 'text-slate-400 hover:text-white'}`}
            >
                <span className={`material-symbols-outlined ${userVote === 'like' ? 'filled' : ''}`}>thumb_up</span>
                <span className="font-bold">{stats.likes}</span>
            </button>
            <div className={`w-px h-8 bg-white/10`}></div>
            <button
                onClick={() => handleVote('dislike')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${userVote === 'dislike' ? 'text-red-500 bg-white/10' : 'text-slate-400 hover:text-white'}`}
            >
                <span className={`material-symbols-outlined ${userVote === 'dislike' ? 'filled' : ''}`}>thumb_down</span>
            </button>
            <div className="px-3 text-xs font-bold text-neon-cyan border-l border-white/10 ml-2">
                {stats.approval}% <span className="text-[10px] text-slate-500 block">APROVAÇÃO</span>
            </div>
        </>
    );
};
