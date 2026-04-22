// hooks/useNotifications.ts
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getNotifications } from '@/service/service'
import type { NotificationTyping } from '@/typing/type';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<NotificationTyping[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0) // ✅ عداد الجديد

  const fetchNotifications = useCallback(async (pageNum: number) => {
    if (!userId) return
    setLoading(true)

    try {
      const data = await getNotifications(userId, pageNum)
      
      if (pageNum === 0) {
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.is_read).length) // ✅ احسب الغير مقروءة
      } else {
        setNotifications(prev => [...prev, ...data])
      }

      setHasMore(data.length === 20)
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // ✅ Real-time — استنى أي notification جديدة
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as NotificationTyping
          setNotifications(prev => [newNotif, ...prev]) // ✅ أضفه فوق الليست
          setUnreadCount(prev => prev + 1)              // ✅ زود العداد
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel) // ✅ cleanup عند الخروج
    }
  }, [userId])

  useEffect(() => {
    fetchNotifications(0)
  }, [fetchNotifications])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchNotifications(nextPage)
  }

  // ✅ Mark all as read
  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('receiver_id', userId)
      .eq('is_read', false)

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  return { notifications, unreadCount, loading, hasMore, loadMore, markAllAsRead }
}