import React from 'react';
import { User, LogOut, LogIn, ShieldCheck } from 'lucide-react';
import { updateAuthState, mergeGuestSession } from '../../services/storageService';

/**
 * Authentication Switcher Footer Component
 */
export function AuthSwitcher({ isExpanded, onToggleExpand, authState, onAuthChange }) {
  const isLoggedIn = authState?.isLoggedIn;
  const user = authState?.user;

  const handleLogin = async (e) => {
    e?.stopPropagation();
    await mergeGuestSession();
    const newAuth = {
      isLoggedIn: true,
      user: {
        name: 'Narain Mayank',
        initials: 'NM',
        email: 'narainmayank@gmail.com'
      }
    };
    await updateAuthState(newAuth);
    onAuthChange(newAuth);
  };

  const handleLogout = async (e) => {
    e?.stopPropagation();
    const newAuth = { isLoggedIn: false, user: null };
    await updateAuthState(newAuth);
    onAuthChange(newAuth);
  };

  const handleSignUp = (e) => {
    e?.stopPropagation();
    // Phase 1 prototype: Sign Up does nothing
  };

  return (
    <div className="mt-auto shrink-0 px-2.5 py-2 border-t border-neutral-200 bg-neutral-100/90 overflow-hidden">
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={(e) => {
              if (!isExpanded) {
                e.stopPropagation();
                if (onToggleExpand) onToggleExpand(true);
              }
            }}
            className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-[11px] shrink-0 transition-all cursor-pointer ${
              isLoggedIn
                ? 'bg-neutral-900 text-white shadow-2xs hover:ring-2 hover:ring-neutral-400'
                : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300/80'
            }`}
            title={isExpanded ? (user?.name || 'User Profile') : 'Expand Sidebar'}
          >
            {isLoggedIn ? (user?.initials || 'NM') : <User className="w-3.5 h-3.5" />}
          </button>

          {isLoggedIn && (
            <div
              className={`min-w-0 transition-all duration-200 overflow-hidden whitespace-nowrap ${
                isExpanded ? 'opacity-100 max-w-[110px]' : 'opacity-0 max-w-0 pointer-events-none'
              }`}
            >
              <div className="text-xs font-semibold text-neutral-900 truncate flex items-center gap-1">
                <span>{user?.name}</span>
                <ShieldCheck className="w-3 h-3 text-neutral-700 shrink-0" />
              </div>
              <div className="text-[10px] text-neutral-500 truncate">
                {user?.email}
              </div>
            </div>
          )}
        </div>

        <div
          className={`transition-all duration-200 overflow-hidden whitespace-nowrap shrink-0 ${
            isExpanded ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0 pointer-events-none'
          }`}
        >
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 bg-neutral-200/80 text-neutral-700 hover:bg-neutral-300/80 hover:text-neutral-900 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleSignUp}
                className="px-2 py-1 rounded text-[11px] font-medium transition-colors bg-white border border-neutral-200/90 text-neutral-800 hover:bg-neutral-200/50 shadow-2xs cursor-pointer"
                title="Sign Up"
              >
                Sign Up
              </button>
              <button
                onClick={handleLogin}
                className="px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 bg-neutral-200/80 text-neutral-700 hover:bg-neutral-300/80 hover:text-neutral-900 cursor-pointer"
                title="Login"
              >
                <LogIn className="w-3 h-3" />
                <span>Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
