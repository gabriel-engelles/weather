import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface IndexCardProps {
  text?: any;
  subText?: any;
  description?: any;
  color?: any;
  title?: any;
  image?: ImageKey;
  slider?: boolean;
}

const images = {
  "brightness-alt-high-fill": require("@/assets/images/icon/brightness-alt-high-fill.png"),
  "brightness-high-fill": require("@/assets/images/icon/brightness-high-fill.png"),
  "calendar2-week": require("@/assets/images/icon/calendar2-week.png"),
  "droplet-fill": require("@/assets/images/icon/droplet-fill.png"),
  "thermometer-half": require("@/assets/images/icon/thermometer-half.png"),
  "windy-fill": require("@/assets/images/icon/windy-fill.png"),
  windy: require("@/assets/images/icon/windy.png"),
};
type ImageKey = keyof typeof images;

export function IndexCard({ text, description, color, title, image, slider, subText }: IndexCardProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.titleContainer}>
        {image && images[image] && <Image source={images[image]} style={{ width: 20, height: 20 }} />}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.valuesContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.text}>{text}</Text>
          <Text style={styles.subText}>{subText}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
        {slider && (
          <View style={styles.sliderContainer}>
            <View style={[styles.sliderFill, { backgroundColor: color, width: `${(text / 11) * 100}%` }]} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "rgba(246, 246, 246, 0.2)",
    borderRadius: 10,
    padding: 5,
    width: 180,
    height: 155,
    marginBottom: 20,
  },
  valuesContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    gap: 5,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 5,
    gap: 10,
    paddingBottom: 5,
  },
  title: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "bold",
  },
  text: {
    fontSize: 48,
    fontWeight: "700",
    color: "#fff",
  },
  subText: {
    fontSize: 32,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.5)",
  },
  description: {
    fontSize: 14,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  sliderContainer: {
    height: 10,
    width: "100%",
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#B2DFDB",
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    borderRadius: 5,
  },
});
