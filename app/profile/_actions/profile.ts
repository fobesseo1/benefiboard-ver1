// server.ts

'use server';

import createSupabaseServerClient from '@/lib/supabse/server';
import { redirect } from 'next/navigation';
import { deleteAvatarFromSupabase, uploadAvatarToSupabase } from '@/app/post/_action/image';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getcurrentUserFromCookies } from '@/lib/cookies';

export interface ProfileType {
  avatar_url?: string;
  email: string;
  id: string;
  username?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'Let me see';
  location?: string;
  current_points?: number;
}

export const fetchProfileById = async (id: string): Promise<ProfileType> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('userdata')
    .select('id, email, username, avatar_url, birthday, gender, location, current_points')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateProfile = async (formData: FormData) => {
  const currentUser = await getcurrentUserFromCookies();
  const currentUserId = currentUser?.id || '';

  const supabase = await createSupabaseServerClient();
  const userId = formData.get('userId') as string;
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const birthday = formData.get('birthday') as string;
  const gender = formData.get('gender') as string;
  const location = formData.get('location') as string;
  const avatarFile = formData.get('avatar') as File | null;

  const existingProfile = await fetchProfileById(userId);
  const oldAvatarUrl = existingProfile.avatar_url || '';

  let newAvatarUrl = oldAvatarUrl;

  if (!currentUserId || currentUserId !== userId) {
    throw new Error('Not authorized');
  }

  if (avatarFile) {
    newAvatarUrl = await updateProfileAvatar(avatarFile, userId, oldAvatarUrl);
  }

  const updatedFields: any = {};
  if (username && username !== existingProfile.username) updatedFields.username = username;
  if (email && email !== existingProfile.email) updatedFields.email = email;
  if (newAvatarUrl !== existingProfile.avatar_url) updatedFields.avatar_url = newAvatarUrl;
  if (birthday && birthday !== existingProfile.birthday) updatedFields.birthday = birthday;
  if (gender && gender !== existingProfile.gender) updatedFields.gender = gender;
  if (location && location !== existingProfile.location) updatedFields.location = location;

  console.log('Updating userdata with:', updatedFields);

  const { data, error } = await supabase
    .from('userdata')
    .update(updatedFields)
    .eq('id', userId)
    .select();

  if (error) {
    console.error('Error updating userdata:', error);
    throw new Error(error.message);
  } else {
    console.log('Update successful:', data);
  }

  const { error: postError } = await supabase
    .from('post')
    .update({ author_name: username, author_avatar_url: newAvatarUrl })
    .eq('author_id', userId);

  if (postError) {
    throw new Error(postError.message);
  }

  const updatedUserData = {
    id: userId,
    username,
    email,
    avatar_url: newAvatarUrl,
    birthday,
    gender,
    location,
  };

  cookies().set('currentUser', JSON.stringify(updatedUserData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  });

  /* revalidatePath('/');
  redirect('/'); */

  return updatedUserData;
};

export const updateProfileAvatar = async (file: File, userId: string, oldAvatarUrl: string) => {
  const supabase = await createSupabaseServerClient();

  if (oldAvatarUrl) {
    await deleteAvatarFromSupabase(oldAvatarUrl);
  }

  const fileName = `avatars/${userId}/${Date.now()}_${file.name}`;
  const { error } = await supabase.storage.from('avatars').upload(fileName, file);

  if (error) {
    console.error('Error uploading avatars:', error);
    throw new Error(error.message);
  }

  const newAvatarUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;

  const { error: updateError } = await supabase
    .from('userdata')
    .update({ avatar_url: newAvatarUrl })
    .eq('id', userId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return newAvatarUrl;
};
