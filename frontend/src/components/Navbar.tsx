import { Link } from 'react-router-dom';
import {
  Activity,
  Component,
  HomeIcon,
  Mail,
  Package,
  ScrollText,
  SunMoon,
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { useTheme } from './theme-provider';

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  const dockItems = [
    {
      title: 'Home',
      icon: (
        <HomeIcon className='h-full w-full text-neutral-600 dark:text-neutral-300' />
      ),
      href: '/',
    },
    {
      title: 'Collection',
      icon: (
        <Component className='h-full w-full text-neutral-600 dark:text-neutral-300' />
      ),
      href: '/collection',
    },
    {
      title: 'Feed',
      icon: (
        <Activity className='h-full w-full text-neutral-600 dark:text-neutral-300' />
      ),
      href: '/feed',
    },
    {
      title: 'Privy',
      icon: (
        <ScrollText className='h-full w-full text-neutral-600 dark:text-neutral-300' />
      ),
      href: '/privy',
    },
    {
      title: 'Chat',
      icon: (
        <Mail className='h-full w-full text-neutral-600 dark:text-neutral-300' />
      ),
      href: '/chat',
    },
    {
      title: theme === 'light' ? 'Dark Mode' : 'Light Mode',
      icon: (
        <SunMoon className='h-full w-full text-neutral-600 dark:text-neutral-300' />
      ),
      onClick: () => setTheme(theme === 'light' ? 'dark' : 'light'),
    },
  ];

  return (
    <div className='fixed bottom-2 left-1/2 max-w-full -translate-x-1/2 z-50'>
      <Dock className='items-end pb-3'>
        {dockItems.map((item, idx) => (
          item.onClick ? (
            <div key={idx} onClick={item.onClick} className="cursor-pointer">
              <DockItem
                className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800'
              >
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>{item.icon}</DockIcon>
              </DockItem>
            </div>
          ) : (
            <Link key={idx} to={item.href}>
              <DockItem
                className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800'
              >
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>{item.icon}</DockIcon>
              </DockItem>
            </Link>
          )
        ))}
      </Dock>
    </div>
  );
}