import { User2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useNavigation } from 'react-router';

import logo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { useLogout } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/auth';

import type { ReactNode } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@/components/ui/link';

const Logo = () => {
  return (
    <Link className="flex items-center text-white" to={paths.home.getHref()}>
      <img className="h-8 w-auto" src={logo} alt="Logo" />
      <span className="text-sm font-semibold text-white">Portfolio</span>
    </Link>
  );
};

const Progress = () => {
  const { state, location } = useNavigation();

  const [progress, setProgress] = useState(0);
  const [lastPath, setLastPath] = useState(location?.pathname);

  if (lastPath !== location?.pathname) {
    setLastPath(location?.pathname);
    setProgress(0);
  }

  useEffect(() => {
    if (state !== 'loading') return;

    const timer = setInterval(() => {
      setProgress((oldProgress) => Math.min(oldProgress + 10, 100));
    }, 300);

    return () => {
      clearInterval(timer);
    };
  }, [state]);

  if (state !== 'loading') {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-blue-500 transition-all duration-200 ease-in-out"
      style={{ width: `${progress}%` }}
    ></div>
  );
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const logout = useLogout({
    onSuccess: () => navigate(paths.home.getHref()),
  });
  const user = useUser();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 bg-transparent px-4 sm:static sm:h-auto sm:border-0 sm:px-6">
          <Logo />
          <Progress />
          {user.data ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <span className="sr-only">Open user menu</span>
                  <User2 className="size-6 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className={cn(
                    'block w-full px-4 py-2 text-sm text-foreground',
                  )}
                  onClick={() => logout.mutate()}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="size-6"></div>
          )}
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
