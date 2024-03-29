import { writable } from 'svelte/store';
import { supabase } from '../supabase.js';

export const user = writable(supabase.auth.user() || false);
