import { appTables } from './supabase';
import { supabase } from './supabase';

const activitiesTable = supabase.from(appTables.ACTIVITIES);

export const createActivity = async (
  childId,
  appName,
  packageName,
  timeUsed,
  dateUsed
) => {
  /**
   * @param childId
   * @param appName
   * @param packageName
   * @param timeUsed
   * @param dateUsed
   */
  try {
    const { data, status } = await activitiesTable.insert({
      childId,
      appName,
      packageName,
      timeUsed,
      dateUsed,
    });

    if (status === 200) return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllActivities = async (childId) => {
  /** get all acts with childId
   * @param childId
   */
  try {
    const { data, status } = await activitiesTable
      .select()
      .eq('childId', childId);

    if (status === 200) return data;
  } catch (error) {
    console.log(error.message);
  }
};
