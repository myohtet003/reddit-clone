import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";

import { selectedGroupAtom } from "../../../atoms";
import { supabase } from "../../../lib/superbase";

export default function CreateScreen() {
  const [title, setTitle] = useState<string>("");
  const [bodyText, setBodyText] = useState<string>("");
  const [group, setGroup] = useAtom(selectedGroupAtom);

  const { mutate, data, error } = useMutation({
    mutationFn: async () => {
      // API call to insert a new post
      const { data, error } = await supabase
        .from("posts")
        .insert({
          title,
          description: bodyText,
          group_id: "group_id",
          user_id: "user_id",
        })
        .select();

      if (error) {
        throw error;
      } else {
        return data;
      }
    },
  });

  const goBack = () => {
    setTitle("");
    setBodyText("");
    setGroup(null);
    router.back();
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: "white", flex: 1, paddingHorizontal: 10 }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <AntDesign
          name="close"
          size={30}
          color="black"
          onPress={() => goBack()}
        />
        <Pressable
          onPress={() => console.error("Pressed")}
          style={{ marginLeft: "auto" }}
        >
          <Text style={styles.postText}>Post</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={10}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: 14 }}
        >
          {/* Community Selector */}
          <Link href={"groupSelector"} asChild>
            <Pressable style={styles.communityContainer}>
              {group ? (
                <>
                  <Image
                    source={{ uri: group.image ?? "" }}
                    style={{ width: 20, height: 20, borderRadius: 10 }}
                  />
                  <Text style={{ fontWeight: "600" }}>{group.name}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.rStyles}>r/</Text>
                  <Text style={{ fontWeight: "600" }}>Select a Community</Text>
                </>
              )}
            </Pressable>
          </Link>

          {/* Inputs */}
          <TextInput
            placeholder="Title"
            style={{ fontSize: 20, fontWeight: "bold", paddingVertical: 20 }}
            value={title}
            onChangeText={setTitle}
            multiline
            scrollEnabled={false}
          />

          <TextInput
            placeholder="Body text (optional)"
            value={bodyText}
            onChangeText={setBodyText}
            multiline
            scrollEnabled={false}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  postText: {
    color: "white",
    backgroundColor: "#115BCA",
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 10,
  },
  communityContainer: {
    backgroundColor: "#EDEDED",
    flexDirection: "row",
    padding: 10,
    borderRadius: 20,
    gap: 3,
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  rStyles: {
    backgroundColor: "black",
    color: "white",
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 10,
    fontWeight: "bold",
  },
});
