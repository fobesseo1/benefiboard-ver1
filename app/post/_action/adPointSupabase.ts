//app>post>_action>adPointSupabase.ts
'use server';

import createSupabaseServerClient from '@/lib/supabse/server';

export async function saveUserRoundData(
  userId: string,
  currentRoundIndex: number,
  roundPoints: number[]
) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_rounds').upsert({
    user_id: userId,
    current_round_index: currentRoundIndex,
    round_points: roundPoints,
  });

  if (error) {
    console.error('Error saving user round data:', error);
  }
  return data;
}

// 광고 애니 메이션과 연계된 읽은 사람 포인트 추가
export async function addUserPoints(userId: string, points: number) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_points').select('*').eq('user_id', userId);

  if (error) {
    console.error('Error fetching user points - addUserPoints:', error);
    return null;
  }

  if (data && data.length > 0) {
    // Update existing record
    const { data: updateData, error: updateError } = await supabase
      .from('user_points')
      .update({
        total_points: data[0].total_points + points,
        current_points: data[0].current_points + points,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating user points:', updateError);
    } else {
      console.log('User points updated successfully Server', updateData);
      console.log('User points Server', points);
    }

    return updateData;
  } else {
    // Insert new record
    const { data: insertData, error: insertError } = await supabase.from('user_points').insert({
      user_id: userId,
      total_points: points,
      current_points: points,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('Error adding user points:', insertError);
    }

    return insertData;
  }
}

// 광고 애니 메이션과 연계된 작성한 사람 포인트 추가
export async function addWritingPoints(userId: string, points: number) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_points').select('*').eq('user_id', userId);

  if (error) {
    console.error('Error fetching user points - assWritingPoints:', error);
    return null;
  }

  if (data && data.length > 0) {
    // Update existing record
    const { data: updateData, error: updateError } = await supabase
      .from('user_points')
      .update({
        total_points: data[0].total_points + points,
        current_points: data[0].current_points + points,
        writing_points: (data[0].writing_points || 0) + points, // writing_points 컬럼 업데이트
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating user points:', updateError);
    } else {
      console.log('User writing points updated successfully', updateData);
    }

    return updateData;
  } else {
    // Insert new record
    const { data: insertData, error: insertError } = await supabase.from('user_points').insert({
      user_id: userId,
      total_points: points,
      current_points: points,
      writing_points: points, // writing_points 컬럼 추가
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('Error adding user points:', insertError);
    }

    return insertData;
  }
}

// 광고 클릭과 연계된 읽은 사람 포인트 추가
export async function addUserClickPoints(userId: string, readerClickPoints: number) {
  //const readerPoints = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
  await addUserPoints(userId, readerClickPoints);
  console.log(`Added ${readerClickPoints} points to reader (${userId})`);
}
// 광고 클릭과 연계된 작성한 사람 포인트 추가
export async function addWritingClickPoints(author_id: string) {
  const writerPoints = 500; // 작성자에게 500 포인트 추가
  await addWritingPoints(author_id, writerPoints);
  console.log(`Added ${writerPoints} points to writer (${author_id})`);
}
export async function useUserPoints(userId: string, points: number, type: 'use' | 'donate') {
  const column = type === 'use' ? 'total_used_points' : 'total_donated_points';

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_points').select('*').eq('user_id', userId);

  if (error) {
    console.error('Error fetching user points - useUserPoints:', error);
    return null;
  }

  if (data && data.length > 0) {
    // Define the type for updateValues with an index signature
    const updateValues: {
      current_points: number;
      updated_at: string;
      [key: string]: any;
    } = {
      current_points: data[0].current_points - points,
      updated_at: new Date().toISOString(),
    };

    updateValues[column] = data[0][column] + points;

    const { data: updateData, error: updateError } = await supabase
      .from('user_points')
      .update(updateValues)
      .eq('user_id', userId);

    if (updateError) {
      console.error(`Error ${type === 'use' ? 'using' : 'donating'} user points:`, updateError);
    }

    return updateData;
  } else {
    console.error(`No user points record found for user_id: ${userId}`);
    return null;
  }
}
