'use client';

import { useState } from 'react';
import axios from 'axios';

import type { User } from '@/types/user';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

// const user = {
//   id: 'USR-000',
//   email: 'sofia@devias.io',
//   role: 'ADMIN',
//   verified: true,
// } satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);
    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string; token?: string }> {
    const { email, password } = params;

    try {
      const response = await axios.post('http://localhost:3216/api/auth/login', {
        email,
        password,
      });
      const token = response.data.token;
      if (!token) {
        return { error: 'Authentication failed, no token received' };
      }
      const decodedToken = atob(token.split('.')[1]);
      let parsedToken;
      try {
        parsedToken = JSON.parse(decodedToken);
      } catch (error) {
        console.error('Error parsing token:', error);
        return { error: 'Error parsing token' };
      }
      const userId = parsedToken.id;
      const userResponse = await axios.get(`http://localhost:3216/api/auth/user/${userId}`);
      const userRole = userResponse.data.role;

      if (!userRole) {
        return { error: 'Role not found for the user' };
      }

      if (userRole !== 'ADMIN') {
        console.log('[AuthClient]: User is not an ADMIN, redirecting');
        return { error: 'Access denied, you should be an administrator to access the dashboard' };
      }
      const user = { ...userResponse.data, role: userRole };
      localStorage.setItem('custom-auth-token', token);
      localStorage.setItem('token-created-at', Date.now().toString());
      localStorage.setItem('user-role', userRole);
      localStorage.setItem('user-data', JSON.stringify(user));

      return { token };
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return { error: error.response.data.message || 'Unknown error' };
      } else {
        return { error: 'Network error, please try again' };
      }
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    const tokenCreatedAt = parseInt(localStorage.getItem('token-created-at') || '0');
    if (Date.now() - tokenCreatedAt > 3600000) {
      localStorage.removeItem('custom-auth-token');
      localStorage.removeItem('user-data');
      localStorage.removeItem('token-created-at');
      localStorage.removeItem('user-role');
      return { data: null };
    }

    const userData = localStorage.getItem('user-data');
    if (userData) {
      return { data: JSON.parse(userData) as User };
    }

    return { data: null };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    localStorage.removeItem('token-created-at');
    localStorage.removeItem('user-role');
    localStorage.removeItem('user-data');
    return {};
  }
}

export const authClient = new AuthClient();
