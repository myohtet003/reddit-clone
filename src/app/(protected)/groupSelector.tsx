import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { useSetAtom } from "jotai";

import { selectedGroupAtom } from "../../atoms";
// import groups from "../../../assets/data/groups.json";
import { Group } from "../../types";
import { fetchGroups } from "../../services/groupService";
import { useQuery } from "@tanstack/react-query"; 

export default function GroupSelector() {
  const [searchValue, setSearchValue] = useState<string>("");
  const setGroup = useSetAtom(selectedGroupAtom);

  const { data, isLoading, error } = useQuery({
    queryKey: ["groups", { searchValue }],
    queryFn: async () => fetchGroups(searchValue),
    staleTime: 10000,
    placeholderData: (previousData) => previousData,
  });

  const onGroupSelected = (group: Group) => {
    setGroup(group);
    router.back();
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading groups</Text>
      </View>
    );
  }

  // const filteredGroup = data.filter((group) =>
  //   group.name.toLowerCase().includes(searchValue.toLowerCase())
  // );

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
          marginTop: 5,
        }}
      >
        <AntDesign name="search" size={16} color="gray" />
        <TextInput
          placeholder="Search for a community"
          placeholderTextColor={"grey"}
          style={{ paddingVertical: 10, flex: 1 }}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
        />
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onGroupSelected({ ...item, image: item.image ?? "" })}
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Image
              source={{ uri: item.image ?? "" }}
              style={{ width: 40, aspectRatio: 1, borderRadius: 20 }}
            />
            <Text style={{ fontWeight: "600" }}>{item.name}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}