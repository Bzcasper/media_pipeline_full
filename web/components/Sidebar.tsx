import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Upload, History, Settings, Video } from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Upload Music', href: '/upload', icon: Upload },
  { name: 'YouTube Creator', href: '/youtube', icon: Video },
  { name: 'History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-spotify-black border-r border-spotify-gray">
      <div className="p-6">
        <Link href="/">
          <a>
            <Image
              src="/logo.svg"
              alt="Media Pipeline Logo"
              width={140}
              height={40}
            />
          </a>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href as any}
              className={cn(
                isActive
                  ? 'bg-spotify-gray text-white'
                  : 'text-spotify-lightgray hover:text-white hover:bg-spotify-gray/50',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200'
              )}
            >
              <item.icon
                className={cn(
                  isActive ? 'text-spotify-green' : 'text-spotify-lightgray group-hover:text-white',
                  'mr-3 h-5 w-5 flex-shrink-0'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-spotify-gray">
        <div className="text-xs text-spotify-lightgray">
          <p>Powered by AI SDK v6</p>
          <p className="mt-1">Built with Claude Code</p>
        </div>
      </div>
    </div>
  );
}
