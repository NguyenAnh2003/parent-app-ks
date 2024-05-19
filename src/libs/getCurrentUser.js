import { getCurrentUser } from './supabase/parent.services';

const getCurrentuserInfo = async (userSession) => {
  /** return currentUser data with current session
   * @param: userSession
   */
  try {
    const userData = JSON.parse(userSession.session);
    if (userData) {
      const { id } = userData.user;
      const data = await getCurrentUser(id);
      return data;
    }
    return;
  } catch (error) {
    console.log(error.message);
  }
};

export default getCurrentuserInfo;
