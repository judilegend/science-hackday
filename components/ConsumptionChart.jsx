import React from "react";
import { View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const ConsumptionChart = ({ data, type }) => {
  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        data: data.map((item) => item.value),
        color: (opacity = 1) =>
          type === "electricity"
            ? `rgba(255, 0, 0, ${opacity})`
            : `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 20}
        height={220}
        chartConfig={chartConfig}
        bezier
      />
    </View>
  );
};

export default ConsumptionChart;
