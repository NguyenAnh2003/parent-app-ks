import { supabase } from './supabase';

export const loginEmail = async (email, password) => {
  /** login with gmail
   * @param gmail
   * @param password
   */
  try {
    const { data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(data);
    /** return session (access token, refresh token) */
    return data ? data : null;
  } catch (error) {
    console.log(error);
  }
};

export const registerEmail = async (
  email,
  password,
  username,
  country,
  phone
) => {
  /** register
   * @param email
   * @param password
   */
  try {
    const { data } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          gmail: email,
          username,
          country,
          phone,
        },
      },
    });

    console.log(data);

    /** return session && user */
    return data ? data : null;
  } catch (error) {
    console.log(error.message);
  }
};
