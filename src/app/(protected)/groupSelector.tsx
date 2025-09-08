import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { useSetAtom } from "jotai";

import { selectedGroupAtom } from "../../atoms";
import groups from "../../../assets/data/groups.json";
import { Group } from "../../types";


export default function GroupSelector() {
  const [searchValue, setSearchValue] = useState<string>("");

  const filteredGroup = groups.filter((group) => group.name.toLowerCase().includes(searchValue.toLowerCase()));

  const setGroup = useSetAtom(selectedGroupAtom);

  const onGroupSelected = (group: Group) => {
	setGroup(group);
	router.back();
  }

  return (
    <SafeAreaView style={{ marginHorizontal: 10, flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <AntDesign
          name="close"
          size={30}
          color="balck"
          onPress={() => router.back()}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            textAlign: "center",
            flex: 1,
            paddingRight: 20,
          }}
        >
          Post To
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "lightgrey",
          borderRadius: 5,
          gap: 5,
          alignItems: "center",
          paddingHorizontal: 10,
		  marginTop: 5
        }}
      >
        <AntDesign name="search1" size={16} color="gray" />
        <TextInput
          placeholder="Search for a community"
          placeholderTextColor={"grey"}
          style={{ paddingVertical: 10, flex: 1 }}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
        />
      </View>

      <FlatList
        data={filteredGroup}
        renderItem={({ item }) => (
          <Pressable
		  onPress={() => onGroupSelected(item)}
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: 40, aspectRatio: 1, borderRadius: 20 }}
            />
            <Text style={{ fontWeight: "600" }}>{item.name}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
