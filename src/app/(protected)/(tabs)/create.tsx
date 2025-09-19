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
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useAtom } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { selectedGroupAtom } from "../../../atoms";
import { supabase } from "../../../lib/superbase";
import { TablesInsert } from "../../../types/database.types";

type InsertPost = TablesInsert<"posts">;

const insertPost = async (post: InsertPost) => {
  // API call to insert a new post
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();

  if (error) {
    throw error;
  } else {
    return data;
  }
};

export default function CreateScreen() {
  const [title, setTitle] = useState<string>("");
  const [bodyText, setBodyText] = useState<string>("");
  const [group, setGroup] = useAtom(selectedGroupAtom);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => {

      if(!group) {
        throw new Error("Please select a community");
      }
      if(!title) {
        throw new Error("Title is required");
      }
       
      return insertPost({
        title,
        description: bodyText,
        group_id: group.id ,
        user_id: "446eadc5-e323-4bc9-b817-2c43f3b22e91",
      });
    },
     
      onSuccess: (data) => {
        console.log("data", data); 

        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        goBack();
      },
      onError: (error) => {
        // console.error("Error inserting post:", error);
        Alert.alert("Fail to Insert Data", error.message);
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
          onPress={() => mutate()}
          style={{ marginLeft: "auto" }}
          disabled={isPending}
        >
          <Text style={styles.postText}>
            {isPending ? "Posting..." : "Post"}
          </Text>
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
