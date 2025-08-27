import { useEffect } from 'react'
import supabase from '../supabaseClient'

export default function Notifications({ userId }) {
    useEffect(() => {
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'userprofile_notification'
                    //   filter: `recipient_id=eq.${userId}`
                },
                (payload) => {
                    console.log('🔔 New notification INSERT detected:');
                    console.log('Full payload:', payload);
                    console.log('New row data:', payload.new);
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status)
            })

        console.log('Subscribed to notifications channel for user:', userId)
        return () => {
            console.log('Unsubscribing from notifications channel');
            supabase.removeChannel(channel)
        }
    }, [userId])

    return <div> Notifications listening...</div>
}


