import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassBackground } from './ui';
import { OnboardingModal } from './features';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, needsOnboarding, updateUserMetadata } = useAuth();

  const handleOnboardingComplete = async (firstName: string) => {
    await updateUserMetadata({
      first_name: firstName,
      onboarding_completed: true,
    });
  };

  if (loading) {
    return (
      <GlassBackground>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
        </div>
      </GlassBackground>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (needsOnboarding) {
    return (
      <GlassBackground>
        <OnboardingModal onComplete={handleOnboardingComplete} />
      </GlassBackground>
    );
  }

  return <>{children}</>;
}
