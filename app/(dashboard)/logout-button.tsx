'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // Delete cookie via API or just let server handle it? 
        // Easier to just clear locally (document.cookie) but httpOnly blocks that.
        // Need an api route to logout.
        fetch('/api/auth/logout', { method: 'POST' }).then(() => {
            router.push('/');
            router.refresh();
        });
    };

    return (
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
        </DropdownMenuItem>
    );
}
