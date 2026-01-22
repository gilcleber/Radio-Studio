import React, { useState } from 'react';
import { voteSong } from '../services/votingService';

interface VoteButtonProps {
    songId?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const VoteButton: React.FC<VoteButtonProps> = ({ songId, size = 'md' }) => {
    const [status, setStatus] = useState<'none' | 'liked' | 'disliked'>('none');
    const [isVoted, setIsVoted] = useState(false);

    const handleVote = async (type: 'like' | 'dislike') => {
        if (!songId || isVoted) return;

        // Optimistic UI
        setStatus(type);
        setIsVoted(true);

        try {
            await voteSong(songId, type);
        } catch (error) {
            console.error('Erro ao votar:', error);
            // Revert on error
            setStatus('none');
            setIsVoted(false);
        }
    };

    const sizeClasses = {
        sm: 'size-8 text-sm',
        md: 'size-10 text-base',
        lg: 'size-12 text-lg',
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleVote('like')}
                disabled={isVoted}
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${status === 'liked'
                        ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                title="Gostei"
            >
                <span className={`material-symbols-outlined ${status === 'liked' ? 'filled' : ''}`}>thumb_up</span>
            </button>
            <button
                onClick={() => handleVote('dislike')}
                disabled={isVoted}
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${status === 'disliked'
                        ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                title="Não Gostei"
            >
                <span className={`material-symbols-outlined ${status === 'disliked' ? 'filled' : ''}`}>thumb_down</span>
            </button>
        </div>
    );
};
