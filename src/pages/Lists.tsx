import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut } from 'lucide-react';
import { GlassBackground, GlassCard } from '../components/ui';
import { ListModal } from '../components/features';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Heute, ${date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return 'Gestern';
  } else if (diffDays < 7) {
    return `Vor ${diffDays} Tagen`;
  } else {
    return date.toLocaleDateString('de-DE');
  }
}

export function Lists() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const lists = useStore((state) => state.lists);
  const isLoading = useStore((state) => state.isLoading);
  const addList = useStore((state) => state.addList);
  const getListStats = useStore((state) => state.getListStats);

  const handleLogout = async () => {
    await signOut();
  };

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
        <GlassCard className="p-[clamp(20px,4vw,28px)] mb-[clamp(16px,3vw,24px)]">
          <div className="flex items-center justify-between">
            <h1 className="text-[clamp(24px,5vw,36px)] font-bold text-glass-primary tracking-tight">
              📦 Meine Listen
            </h1>
          </div>
        </GlassCard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
        </div>
      </GlassBackground>
    );
  }

  return (
    <GlassBackground>
      {/* Header Card */}
      <GlassCard className="p-[clamp(20px,4vw,28px)] mb-[clamp(16px,3vw,24px)]">
        <div className="flex items-center justify-between">
          <h1 className="text-[clamp(24px,5vw,36px)] font-bold text-glass-primary tracking-tight">
            📦 Meine Listen
          </h1>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Abmelden"
          >
            <LogOut size={20} className="text-white/80" />
          </button>
        </div>
      </GlassCard>

      {/* Lists */}
      {lists.length > 0 ? (
        <div className="space-y-[clamp(12px,2vw,16px)]">
          {lists.map((list) => {
            const stats = getListStats(list.id);
            const progress = stats.total > 0 ? (stats.packed / stats.total) * 100 : 0;

            return (
              <GlassCard
                key={list.id}
                variant="light"
                className="p-[clamp(16px,3vw,20px)] cursor-pointer transition-all duration-200 hover:bg-white/[0.18] hover:-translate-y-0.5"
                onClick={() => handleListClick(list.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Emoji */}
                  <div className="text-[clamp(28px,6vw,36px)] shrink-0">{list.emoji}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[clamp(16px,3.5vw,20px)] font-semibold text-white mb-1 truncate text-glass-primary">
                      {list.name}
                    </h2>
                    <p className="text-[clamp(12px,2.2vw,13px)] text-glass-muted mb-3">
                      {formatDate(list.updated_at)}
                    </p>

                    {/* Mini Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-[width] duration-500"
                          style={{
                            width: `${progress}%`,
                            background: 'var(--progress-gradient)',
                          }}
                        />
                      </div>
                      <span className="text-[clamp(12px,2.2vw,13px)] text-glass-secondary font-medium shrink-0">
                        {stats.packed}/{stats.total}
                      </span>
                    </div>
                  </div>
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
        className="w-full mt-[clamp(16px,3vw,24px)] p-[clamp(14px,3vw,18px)] rounded-[clamp(14px,3vw,20px)] text-white text-[clamp(14px,2.8vw,15px)] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 min-h-[52px]"
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '2px dashed rgba(255, 255, 255, 0.35)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
        }}
        onMouseOver={(e) => {
          const target = e.currentTarget;
          target.style.background = 'rgba(255, 255, 255, 0.18)';
          target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          target.style.transform = 'translateY(-2px)';
          target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
        }}
        onMouseOut={(e) => {
          const target = e.currentTarget;
          target.style.background = 'rgba(255, 255, 255, 0.12)';
          target.style.borderColor = 'rgba(255, 255, 255, 0.35)';
          target.style.transform = 'translateY(0)';
          target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
        }}
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
