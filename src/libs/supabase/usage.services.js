import { supabase, appTables } from './supabase';

const timelimTab = supabase.from(appTables.TIME);

export const getTimeLim = async (childId) => {
  try {
    const { data, status } = await timelimTab
      .select('*')
      .eq('childId', childId);
    if (status === 200) return data;
  } catch (error) {
    console.log(error.message);
  }
};

/** push */
export const createTimeLim = async (childId, hourUsage, minuteUsage) => {
  /**
   * @param childId
   * @param hourUsage
   * @param minuteUsage
   */
  try {
    console.log({ childId, hourUsage, minuteUsage });
    /** check exist */
    const checkExist = async () => {
      const { status, data } = await timelimTab
        .select('*')
        .eq('childId', childId);
      if (status === 200) return true;
      if (status === 400) return false;
    };

    const isExisted = await checkExist();
    console.log(isExisted);

    /** if else state */
    if (isExisted) {
      /** delete */
      const { status } = await timelimTab.delete().eq('childId', childId);
      if (status === 204) {
        const { status: statusCreated } = await timelimTab.insert({
          childId,
          hourUsage,
          minuteUsage,
        });
        if (statusCreated === 201) return statusCreated;
      }
    }
    if (!isExisted) {
      const { status } = await timelimTab.insert({
        childId,
        hourUsage,
        minuteUsage,
      });
      return status;
    }
  } catch (error) {
    console.log(error);
  }
};
