import type { RequestEvent } from '@builder.io/qwik-city';
import type { User } from '~/lib/types';

const SESSION_COOKIE_NAME = 'wedding-gift-session';

// Type that works with both RequestEvent and RequestEventAction
type RequestEventLike = {
  cookie: RequestEvent['cookie'];
  redirect: RequestEvent['redirect'];
};

/**
 * Get the current authenticated user from the session cookie
 */
export async function getCurrentUser(
  requestEvent: RequestEventLike
): Promise<User | null> {
  const cookie = requestEvent.cookie.get(SESSION_COOKIE_NAME);
  
  if (!cookie?.value) {
    return null;
  }

  try {
    const user = JSON.parse(cookie.value) as User;
    return user;
  } catch {
    return null;
  }
}

/**
 * Set the user session in a cookie
 */
export function setUserSession(requestEvent: RequestEventLike, user: User): void {
  requestEvent.cookie.set(SESSION_COOKIE_NAME, JSON.stringify(user), {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: [7, 'days'],
  });
}

/**
 * Clear the user session (logout)
 */
export function clearUserSession(requestEvent: RequestEventLike): void {
  requestEvent.cookie.delete(SESSION_COOKIE_NAME, { path: '/' });
}

