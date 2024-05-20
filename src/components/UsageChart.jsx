import React, {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import PieChart from 'react-native-pie-chart';
import SmallUsageCard from './cards/SmallUsageCard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
});

const UsageChart = React.memo(({ activities }) => {
  const widthAndHeight = 200;
  // const series = [10, 1, 4];
  const [series, setSeries] = useState([10]);
  const [usages, setUsages] = useState([]);

  const generateSliceColors = useCallback(
    (seriesLength) => {
      const sliceColor = [];
      const hueStep = 240 / seriesLength; // Adjust hue range for shades of blue (blue hues typically range from 180 to 240 in HSL)

      for (let i = 0; i < seriesLength; i++) {
        const hue = 180 + hueStep * i; // Start hue from 180 (green-blue) and gradually increase
        const saturation = 100; // Maximum saturation for vibrant colors
        const lightness = 50 + i * 10; // Adjust lightness for variation in shades
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        sliceColor.push(color);
      }

      return sliceColor;
    },
    [activities, series]
  );

  /** set slice color */
  const sliceColor = useMemo(() => {
    return generateSliceColors(series.length);
  }, [series]);

  /** process activities */
  useEffect(() => {
    const processedActivities = collapseArray(activities);
    /** set usage */
    console.log('cac 2', processedActivities);
    setUsages(processedActivities);
    const arr = []; // define statis array
    processedActivities.forEach(({ number }) => {
      /** pushing each number to array */
      arr.push(number);
      return arr;
    });
    if (arr.length !== 0) {
      setSeries(arr);
    } else return;
  }, [activities]);

  const processedUsage = useMemo(() => {
    if (sliceColor.length === 0) return;
    usages.forEach((item, index) => {
      item.color = sliceColor[index];
    });
    // console.log(usages);
    return usages;
  }, [usages, sliceColor]);

  const collapseArray = useCallback(
    (arr) => {
      const collapsedArray = {};

      // Iterate through the array
      arr.forEach((obj) => {
        const name = obj.name; // Get the name
        const number = parseInt(obj.timeUsed); // Get the number

        // If name already exists in collapsedArray, add the number to it
        if (collapsedArray.hasOwnProperty(name)) {
          // check
          collapsedArray[name] += number;
        } else {
          // Otherwise, initialize it with the number
          collapsedArray[name] = number;
        }
      });

      // Convert the collapsedArray back to an array of objects
      const resultArray = Object.keys(collapsedArray).map((name) => ({
        name: name,
        number: collapsedArray[name],
      }));

      return resultArray;
    },
    [activities]
  );

  return (
    <View style={styles.container}>
      <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        sliceColor={sliceColor}
        coverRadius={0.45}
        coverFill={'#FFF'}
      />
      {processedUsage &&
        processedUsage.map((i, index) => (
          <SmallUsageCard
            key={index}
            color={i.color}
            name={i.name}
            timeUsed={i.number}
          />
        ))}
    </View>
  );
});

export default UsageChart;
