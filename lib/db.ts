import { supabase } from './supabase'

export interface DmUser {
  id: string
  email: string
  name: string
  age: number | null
  bio: string | null
  photo_url: string | null
  interests: string[]
}

export interface DmEvent {
  id: string
  name: string
  date: string
  active: boolean
}

// Get or create user by email, then checkin to active event
export async function joinEvent(email: string): Promise<{ user: DmUser; eventId: string } | null> {
  // Upsert user
  const { data: user, error: userErr } = await supabase
    .from('dm_users')
    .upsert({ email, name: email.split('@')[0] }, { onConflict: 'email' })
    .select()
    .single()

  if (userErr || !user) { console.error(userErr); return null }

  // Get active event
  const { data: event, error: eventErr } = await supabase
    .from('dm_events')
    .select()
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (eventErr || !event) { console.error(eventErr); return null }

  // Checkin (ignore duplicate)
  await supabase
    .from('dm_checkins')
    .upsert({ user_id: user.id, event_id: event.id }, { onConflict: 'user_id,event_id' })

  return { user, eventId: event.id }
}

// Get all profiles at the event except myself and already-swiped
export async function getEventFeed(userId: string, eventId: string): Promise<DmUser[]> {
  // Who I already swiped
  const { data: swiped } = await supabase
    .from('dm_swipes')
    .select('to_user')
    .eq('from_user', userId)
    .eq('event_id', eventId)

  const swipedIds = (swiped ?? []).map((s: { to_user: string }) => s.to_user)
  const excluded = [userId, ...swipedIds]

  // Users checked into this event
  const { data, error } = await supabase
    .from('dm_checkins')
    .select('dm_users(*)')
    .eq('event_id', eventId)
    .not('user_id', 'in', `(${excluded.join(',')})`)

  if (error) { console.error(error); return [] }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => row.dm_users as DmUser).filter(Boolean)
}

// Record a swipe and return true if it's a match
export async function recordSwipe(
  fromUser: string,
  toUser: string,
  eventId: string,
  direction: 'like' | 'pass'
): Promise<boolean> {
  await supabase.from('dm_swipes').upsert(
    { from_user: fromUser, to_user: toUser, event_id: eventId, direction },
    { onConflict: 'from_user,to_user,event_id' }
  )

  if (direction !== 'like') return false

  // Check if the other person already liked me
  const { data } = await supabase
    .from('dm_swipes')
    .select('id')
    .eq('from_user', toUser)
    .eq('to_user', fromUser)
    .eq('event_id', eventId)
    .eq('direction', 'like')
    .single()

  if (data) {
    // Save match (ignore if already exists)
    await supabase.from('dm_matches').upsert(
      { user_a: fromUser, user_b: toUser, event_id: eventId },
      { onConflict: 'user_a,user_b,event_id' }
    )
    return true
  }

  return false
}
