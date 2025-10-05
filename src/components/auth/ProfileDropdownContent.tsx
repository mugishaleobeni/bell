import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react'; 
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LoginRegisterDropdown } from '@/components/auth/LoginRegisterDropdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Assuming you have Avatar component

// Helper Icons (replace with actual imports if needed)
const SettingsIcon = (props: any) => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.525.322 1.018.356 1.516.142Z"/></svg>);
const LogoutIcon = (props: any) => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>);
const CameraIcon = (props: any) => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3"/></svg>);


// 🌟 NEW INTERFACE FOR USER DATA
interface UserProfile {
    name: string;
    role: 'buyer' | 'seller';
    profileImageUrl?: string; // Optional URL for profile picture
}

interface ProfileDropdownContentProps {
    isLoggedIn: boolean;
    user: UserProfile | null; // Pass the user object
    onLogout: () => void;
}

export const ProfileDropdownContent: React.FC<ProfileDropdownContentProps> = ({ isLoggedIn, user, onLogout }) => {
    if (isLoggedIn && user) {
        
        // Function to get initials for the fallback avatar
        const getInitials = (name: string) => {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        };
        
        return (
            <div className="p-1 min-w-[220px]">
                
                {/* 🌟 USER HEADER SECTION */}
                <div className="flex items-center space-x-3 p-3 mb-1 border-b border-glass-border">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImageUrl} alt={`${user.name}'s profile`} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">{user.name}</span>
                        <span className={`text-xs font-medium ${user.role === 'seller' ? 'text-lime-500' : 'text-blue-400'}`}>
                            Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                    </div>
                </div>
                
                {/* 🌟 ACTION LINKS */}
                <DropdownMenuItem className="py-2 px-3 focus:bg-hover-orange/10 focus:text-hover-orange cursor-pointer" asChild>
                    <Link to="/profile">
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                    </Link>
                </DropdownMenuItem>

                {/* 🌟 PROFILE IMAGE UPLOAD LINK */}
                <DropdownMenuItem className="py-2 px-3 focus:bg-hover-orange/10 focus:text-hover-orange cursor-pointer" asChild>
                    {/* In a real app, this link should open a modal or navigate to an upload page */}
                    <Link to="/profile/image-upload">
                        <CameraIcon />
                        Add Profile Image
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="py-2 px-3 focus:bg-hover-orange/10 focus:text-hover-orange cursor-pointer" asChild>
                    <Link to="/settings">
                        <SettingsIcon />
                        Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-glass-border" />
                <DropdownMenuItem 
                    onClick={onLogout} 
                    className="py-2 px-3 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                >
                    <LogoutIcon />
                    Logout
                </DropdownMenuItem>
            </div>
        );
    }
    
    // Renders the Login/Register component for unauthenticated users
    return (
      <div className="p-2">
        <LoginRegisterDropdown />
      </div>
    );
};