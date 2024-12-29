import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useWeather, GeoData } from "@/services/useWeather";

interface SearchBarProps {
  onLocationUpdate: (lat: number, lon: number, city: string) => void;
  onSearchStatus: (searching: boolean) => void;
}

export function SearchBar({ onLocationUpdate, onSearchStatus }: SearchBarProps) {
  const [searchText, setSearchText] = useState("");
  const [locations, setLocations] = useState<GeoData[] | any>([]);
  const apiWeather = useWeather();

  async function GeoLocation() {
    if (searchText.trim() === "") {
      onSearchStatus(false);
      return;
    }
    try {
      const response = await apiWeather.geoResponse(searchText);
      onSearchStatus(true);
      setLocations(response);
    } catch (error) {
      console.error("Erro ao buscar localização:", error);
      setLocations([]);
    }
  }

  const handleItemPress = (lat: number, lon: number, city: string) => {
    onLocationUpdate(lat, lon, city);
    setSearchText("");
  };

  const renderItem = ({ item }: { item: GeoData }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item.lat, item.lon, item.name)}>
      <Text style={styles.itemText}>{`${item.name}, ${item.state}, ${item.country}`}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (searchText.trim() === "") {
      setLocations("");
    }
    const delayDebounceFn = setTimeout(() => {
      GeoLocation();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Buscar"
          placeholderTextColor="#fff"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.iconContainer}>
          <MaterialIcons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {locations.length > 0 && (
        <FlatList
          data={locations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "90%",
    alignSelf: "center",
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: "#fff",
  },
  iconContainer: {
    marginLeft: 10,
  },
  list: {
    marginTop: 20,
    color: '#fff',
    width: "90%",
    alignSelf: "center",
  },
  itemContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderStyle: "dashed",
  },
  itemText: {
    fontSize: 18,
    fontWeight: '500',
    color: "#FFF",
  },
});
