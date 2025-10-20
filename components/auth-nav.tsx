'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Tractor } from 'lucide-react';

export function AuthNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/farmer/login">
            <Tractor className="mr-2 h-4 w-4" />
            農家ログイン
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/login">ログイン</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
        {user.role === 'FARMER' ? (
          <Tractor className="h-4 w-4 text-green-600" />
        ) : (
          <User className="h-4 w-4 text-green-600" />
        )}
        <span className="text-sm font-medium text-gray-700">{user.name}</span>
        {user.role === 'FARMER' && (
          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
            農家
          </span>
        )}
      </div>
      {user.role === 'FARMER' && (
        <Button asChild variant="outline" size="sm">
          <Link href="/farmer/dashboard">ダッシュボード</Link>
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
