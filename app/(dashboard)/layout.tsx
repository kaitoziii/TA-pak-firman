import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { School, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoutButton } from './logout-button'; // Client component for logout logic

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = (await cookies()).get('session')?.value;
    if (!session) {
        redirect('/');
    }

    const user = JSON.parse(session);

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
                <Link href="#" className="flex items-center gap-2 font-semibold">
                    <div className="p-1 bg-primary/10 rounded-full">
                        <School className="h-6 w-6 text-primary" />
                    </div>
                    <span className="hidden md:block">Sistem Rapor</span>
                </Link>
                <div className="flex-1"></div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                        Halo, {user.name} ({user.role})
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/avatars/01.png" alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.username}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <LogoutButton />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="p-6 md:p-10 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
