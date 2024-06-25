// app/post/_action/likes.ts
'use server';

import createSupabaseServerClient from '@/lib/supabse/server';

// 좋아요 싫어요 불러오기
export const fetchLikesDislikes = async (post_id: string) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('post_likes')
    .select('liked, user_id')
    .eq('post_id', post_id);

  if (error) {
    console.error('Error fetching likes/dislikes:', error);
    throw error;
  }

  const likes = data.filter((item) => item.liked).length;
  const dislikes = data.filter((item) => !item.liked).length;
  const likeUsers = data; // 좋아요를 누른 사용자 리스트 반환

  //console.log('likesUsers:', likeUsers); // 로그 추가

  return { likes, dislikes, likeUsers };
};

// 좋아요 싫어요 토글하기
export const toggleLike = async (post_id: string, user_id: string, liked: boolean) => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('post_likes')
    .select('*')
    .eq('post_id', post_id)
    .eq('user_id', user_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching like/dislike:', error);
    throw error; // Ignore "Row not found" error
  }

  if (data) {
    // Toggle existing like/dislike
    const { error: updateError } = await supabase
      .from('post_likes')
      .update({ liked })
      .eq('id', data.id);

    if (updateError) {
      console.error('Error updating like/dislike:', updateError);
      throw updateError;
    }
  } else {
    // Insert new like/dislike
    const { error: insertError } = await supabase
      .from('post_likes')
      .insert({ post_id, user_id, liked });

    if (insertError) {
      console.error('Error inserting like/dislike:', insertError);
      throw insertError;
    }
  }
};
