'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import { calculatePoints, fetchIpAddress } from './adPoint';

export const saveRoundData = async (userId: string | null, roundPoints: number[]) => {
  const totalPoints = roundPoints.reduce((acc, val) => acc + val, 0);
  const rounds = roundPoints.length;
  const ipAddress = await fetchIpAddress();

  const newRoundData = {
    userId: userId ?? 'anonymous',
    ipAddress,
    timestamp: new Date().toISOString(),
    round: rounds,
    pointsArray: roundPoints,
    totalPoints,
  };

  // console.log('New round data:', newRoundData);

  // 라운드가 끝날 때마다 서버로 데이터 전송
  await batchLogRounds([newRoundData]);
};

export async function batchLogRounds(roundsData: any[]) {
  try {
    console.log('Starting to log rounds to Supabase');
    console.log('Rounds data:', roundsData);

    const saveRoundsData = roundsData[0];
    console.log('saveRoundsData:', saveRoundsData);

    // Ensure points_array is in a format Supabase can handle
    const pointsArray = `{${saveRoundsData.pointsArray.join(',')}}`;

    const formRoundsData = {
      user_id: saveRoundsData.userId,
      ip_address: saveRoundsData.ipAddress,
      timestamp: saveRoundsData.timestamp,
      round: saveRoundsData.round,
      points_array: pointsArray,
      total_points: saveRoundsData.totalPoints,
    };

    const supabase = await createSupabaseServerClient();

    console.log('formRoundsData:', formRoundsData);

    const { data, error } = await supabase.from('round_points').insert([formRoundsData]);

    if (data) {
      console.log('Round points logged successfully', data);
    }

    if (error) {
      console.error('Error logging round points:', error);
    }
  } catch (err) {
    console.error('Unexpected error during logging rounds:', err);
  }
}

export async function getUserRoundData(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('user_rounds')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.log('No existing round data found, initializing new round.');
      return {
        user_id: userId,
        current_round_index: 0,
        round_points: calculatePoints(),
        last_updated: new Date().toISOString(),
      };
    }
    console.error('Error fetching user round data:', error);
    return null;
  }

  return data;
}

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

// 읽은 사람 포인트 추가
export async function addUserPoints(userId: string, points: number) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_points').select('*').eq('user_id', userId);

  if (error) {
    console.error('Error fetching user points:', error);
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

// 작성한 사람 포인트 추가
export async function addWritingPoints(userId: string, points: number) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_points').select('*').eq('user_id', userId);

  if (error) {
    console.error('Error fetching user points:', error);
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

export async function useUserPoints(userId: string, points: number, type: 'use' | 'donate') {
  const column = type === 'use' ? 'total_used_points' : 'total_donated_points';

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_points').select('*').eq('user_id', userId);

  if (error) {
    console.error('Error fetching user points:', error);
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
