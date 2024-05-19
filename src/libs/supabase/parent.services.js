import { supabase } from './supabase';

const profileTable = supabase.auth;

const userTable = supabase.from('profiles');

export const getCurrentUser = async (userId) => {
  try {
    const { data, status } = await userTable.select('*').eq('id', userId);
    if (status === 200) return data;
  } catch (error) {
    console.log('error', error.message);
  }
};

export const updateUserData = async (
  userId,
  name,
  avatarUrl,
  gmail,
  country,
  phone
) => {
  try {
    /**
     * @param name
     * @param avatarUrl
     * @param gmail
     * @param country
     * @param phone
     */
    const { status, statusText, data } = await userTable
      .update({
        username: name,
        avatarUrl: avatarUrl,
        gmail: gmail,
        country: country,
        phone: phone,
      })
      .eq('id', userId);
    if (status === 204) return status;
    return;
  } catch (error) {
    console.log(error.message);
  }
};
