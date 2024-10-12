import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AuthContext } from "../context/AuthContext";
import { getConsumptionData } from "../services/database";

const screenWidth = Dimensions.get("window").width;

const ConsumptionScreen = () => {
  const [waterData, setWaterData] = useState([]);
  const [electricityData, setElectricityData] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.id) {
      loadConsumptionData();
    }
  }, [user]);

  const loadConsumptionData = async () => {
    try {
      const data = await getConsumptionData(user.id);
      setWaterData(data.water);
      setElectricityData(data.electricity);
    } catch (error) {
      console.error("Failed to load consumption data", error);
    }
  };

  const renderChart = (data, title, color) => {
    if (data.length === 0) {
      return <Text>No {title.toLowerCase()} consumption data available.</Text>;
    }

    const chartData = {
      labels: data.map((item) => item.date),
      datasets: [{ data: data.map((item) => item.value) }],
    };

    return (
      <View>
        <Text style={styles.title}>{title} Consumption</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: color,
            backgroundGradientFrom: color,
            backgroundGradientTo: color,
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view consumption data.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderChart(waterData, "Water", "#4e79a7")}
      {renderChart(electricityData, "Electricity", "#e26a00")}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default ConsumptionScreen;
