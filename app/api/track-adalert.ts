// /api/track-adalert.ts
import { NextApiRequest, NextApiResponse } from 'next';
import createSupabaseServerClient from '@/lib/supabse/server';
import { getCurrentUserInfo } from '@/lib/cookies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = await createSupabaseServerClient();
  const currentUser = getCurrentUserInfo();

  if (req.method === 'POST') {
    const { postId, pagePath } = req.body;

    const { data: existingRecord, error: fetchError } = await supabase
      .from('ad_alert_counts')
      .select('*')
      .eq('user_id', currentUser?.id)
      .eq('post_id', postId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      return res.status(500).json({ error: fetchError.message });
    }

    if (existingRecord) {
      const { data, error } = await supabase
        .from('ad_alert_counts')
        .update({
          alert_shown_count: existingRecord.alert_shown_count + 1,
          last_shown_at: new Date().toISOString(),
          page_path: pagePath,
        })
        .eq('user_id', currentUser?.id)
        .eq('post_id', postId);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });
    } else {
      const { data, error } = await supabase
        .from('ad_alert_counts')
        .insert([
          { user_id: currentUser?.id, post_id: postId, alert_shown_count: 1, page_path: pagePath },
        ]);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
