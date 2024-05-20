import { NativeModules } from 'react-native';


/** convert time */
export const convertTimestamp = (timestamp) => {
  const dateObject = new Date(timestamp);

  // Check for invalid date
  if (isNaN(dateObject)) {
    return 'Invalid Date';
  }

  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1; // Months are zero-indexed, so we add 1
  const day = dateObject.getDate();
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const seconds = dateObject.getSeconds();

  // Format components to ensure two digits
  const formattedMonth = month.toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  // Format date and time
  const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
  const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

  // Combine formatted date and time
  return `${formattedDate} ${formattedTime}`;
};


export const humanReadableMillis = (milliSeconds) => {
  const seconds = Math.floor(milliSeconds / 1000);
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
};


export const processAppIcon = async (activities) => {
  const { AppPackaging } = NativeModules;
  const processedPackage = await AppPackaging.preprocessAppPackageInfo(
    activities
  );

  if (processedPackage) {
    return processedPackage;
  }
};