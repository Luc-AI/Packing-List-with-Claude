import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, ChevronRight } from 'lucide-react';
import { GlassBackground, GlassCard, LoadingSpinner } from '../components/ui';
import { ListModal, UserMenu } from '../components/features';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';

// Format relative time for display
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMinutes < 1) return 'gerade eben';
  if (diffMinutes < 60) return `vor ${diffMinutes} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  if (diffDays === 1) return 'gestern';
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  if (diffWeeks === 1) return 'letzte Woche';
  if (diffWeeks < 5) return `vor ${diffWeeks} Wochen`;
  if (diffMonths < 12) return `vor ${diffMonths} Monaten`;

  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? 'vor 1 Jahr' : `vor ${diffYears} Jahren`;
}

export function Lists() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const lists = useStore((state) => state.lists);
  const isLoading = useStore((state) => state.isLoading);
  const addList = useStore((state) => state.addList);
  const getListStats = useStore((state) => state.getListStats);

  // Extract display name for greeting
  const firstName = user?.user_metadata?.first_name as string | undefined;
  const displayName = firstName || 'there';

  const handleCreateList = () => {
    setIsListModalOpen(true);
  };

  const handleSaveList = async (name: string, emoji: string) => {
    if (!user) return;
    const newListId = await addList(user.id, name, emoji);
    if (newListId) {
      navigate(`/lists/${newListId}`);
    }
  };

  const handleListClick = (listId: string) => {
    navigate(`/lists/${listId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <GlassBackground>
        <header className="flex items-start justify-between mb-[clamp(24px,4vw,32px)]">
          <div className="flex-1 min-w-0 pr-4">
            <h1 className="text-[clamp(22px,5vw,32px)] font-bold text-glass-primary leading-tight">
              Hey {displayName},
            </h1>
            <p className="text-[clamp(18px,4vw,24px)] text-glass-secondary font-medium mt-1">
              wohin geht die Reise?
            </p>
          </div>
        </header>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </GlassBackground>
    );
  }

  return (
    <GlassBackground>
      {/* Header */}
      <header className="flex items-start justify-between mb-[clamp(24px,4vw,32px)]">
        <div className="flex-1 min-w-0 pr-4">
          <h1 className="text-[clamp(22px,5vw,32px)] font-bold text-glass-primary leading-tight">
            Hey {displayName},
          </h1>
          <p className="text-[clamp(18px,4vw,24px)] text-glass-secondary font-medium mt-1">
            wohin geht die Reise?
          </p>
        </div>
        <UserMenu />
      </header>

      {/* Lists */}
      {lists.length > 0 ? (
        <div className="space-y-[clamp(12px,2vw,16px)]">
          {lists.map((list) => {
            const stats = getListStats(list.id);

            return (
              <GlassCard
                key={list.id}
                variant="light"
                className="p-[clamp(14px,2.5vw,18px)] cursor-pointer group"
                onClick={() => handleListClick(list.id)}
              >
                <div className="flex gap-[clamp(12px,2.5vw,16px)]">
                  {/* Emoji */}
                  <div className="text-[clamp(28px,5.5vw,34px)] shrink-0">{list.emoji}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h2 className="text-[clamp(18px,4vw,22px)] font-bold text-glass-primary truncate mb-[clamp(6px,1.5vw,10px)]">
                      {list.name}
                    </h2>

                    {/* Badge and Timestamp row */}
                    <div className="flex items-center gap-[clamp(10px,2vw,14px)]">
                      {/* Item Count Badge */}
                      <span className="px-[clamp(10px,2vw,14px)] py-[clamp(4px,0.8vw,6px)] rounded-full bg-white/20 text-[clamp(12px,2.2vw,14px)] text-white font-medium">
                        {stats.total} items
                      </span>

                      {/* Timestamp with clock icon */}
                      <div className="flex items-center gap-[clamp(4px,0.8vw,6px)] text-glass-muted text-[clamp(12px,2.2vw,14px)]">
                        <Clock size={14} className="shrink-0" />
                        <span>{formatRelativeTime(list.updated_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronRight
                    size={20}
                    className="text-white/40 shrink-0 self-center transition-colors duration-300 group-hover:text-white/70"
                  />
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <GlassCard variant="light" className="p-8 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-semibold text-white mb-2 text-glass-primary">
            Keine Listen
          </h2>
          <p className="text-glass-secondary mb-6">
            Erstelle deine erste Packliste
          </p>
        </GlassCard>
      )}

      {/* Create List Button */}
      <button
        onClick={handleCreateList}
        className="w-full mt-[clamp(16px,3vw,24px)] p-[clamp(14px,3vw,18px)] rounded-[clamp(14px,3vw,20px)] text-white text-[clamp(14px,2.8vw,15px)] font-semibold cursor-pointer flex items-center justify-center gap-2 min-h-[52px] glass-button-dashed"
      >
        <Plus size={20} />
        Neue Liste erstellen
      </button>

      {/* List Modal */}
      <ListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onSave={handleSaveList}
        mode="add"
      />
    </GlassBackground>
  );
}
