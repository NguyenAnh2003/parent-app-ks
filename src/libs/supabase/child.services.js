import { appTables } from './supabase';
import { supabase } from './supabase';
const childrenTable = supabase.from(appTables.CHILDREN); // init childrenTable

export const createChild = async (
  parentId,
  name,
  age,
  phone,
  phoneType,
  avatarUrl
) => {
  /**
   * @param parentId ...
   * @param name: str
   * @param age: int
   * @param phone - phone number: int
   * @param phoneType: str
   * @param avatarUrl: str
   */
  try {
    /** waiting for response */
    const { data, status } = await childrenTable.insert({
      parentId: parentId,
      kidName: name,
      age: age,
      phone: phone,
      phoneType: phoneType,
      avatarUrl: avatarUrl,
    });

    if (status === 201) return status;
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllChildren = async (parentId) => {
  try {
    const { data, status, error } = await childrenTable
      .select('*')
      .eq('parentId', parentId);
    if (status === 200) return data;
    else return error;
  } catch (error) {
    console.log(error);
  }
};

export const getChildInfo = async (childId) => {
  /** @param childId */
  try {
    /** select all information with childId */
    const { data, status } = await childrenTable.select('*').eq('id', childId);
    if (status === 200) return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateChild = async (
  childId,
  kidName,
  age,
  phone,
  phonetype,
  avatarUrl
) => {
  /**
   * @param childId -> used for update (putHTTP)
   * @param name: str
   * @param age: int
   * @param phone - phone number: int
   * @param avatarUrl: str
   */
  try {
    const { data, status, statusText, error } = await childrenTable
      .update({
        kidName: kidName,
        age: age,
        phone: phone,
        avatarUrl: avatarUrl,
        phoneType: phonetype,
      })
      .eq('id', childId);
    console.log({status, statusText, error});
    if (status === 204) return status;
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteChild = async (childId) => {
  /** @param childId  */
  try {
    const { error, status, statusText } = await childrenTable
      .delete()
      .eq('id', childId);
    const responseData = { status, statusText };
    if (status === 204) return responseData;
  } catch (error) {
    console.log(error.message);
  }
};
