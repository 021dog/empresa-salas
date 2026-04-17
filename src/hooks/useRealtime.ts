import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtime(table: string, callback: (payload: any) => void) {
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          console.log(`Realtime update on ${table}:`, payload);
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback]);
}
