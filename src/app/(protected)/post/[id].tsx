import { useState, useRef, useCallback } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import posts from "../../../../assets/data/posts.json";
import comments from "../../../../assets/data/comments.json";
import PostListItem from "../../../components/PostListItem";
import CommentListItem from "../../../components/CommentListItem";
import { fetchPostsById } from "../../../services/postService";
import { useQuery } from "@tanstack/react-query";

export default function PostDetailed() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [comment, setComment] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const inputRef = useRef<TextInput | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", id],
    queryFn: async () => fetchPostsById(id),
  });

  const detailedPost = posts.find((post) => post.id === id);
  const postComments = comments.filter(
    (comment) => comment.post_id === detailedPost?.id
  );

  const handleReplyButtonPressed = useCallback((commentId: string) => {
    console.log(commentId);
    inputRef.current?.focus();
  }, []);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (!data || error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Post Not Found!</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={insets.top + 10}
    >
      <FlatList
        ListHeaderComponent={
          <PostListItem post={data} isDetailedPost />
        }
        data={postComments}
        renderItem={({ item }) => (
          <CommentListItem
            comment={item}
            depth={0}
            handleReplyButtonPressed={handleReplyButtonPressed}
          />
        )}
      />
      {/* POST A COMMENT */}
      <View
        style={{
          paddingBottom: insets.bottom,
          borderBottomWidth: 1,
          borderBottomColor: "lightgrey",
          padding: 10,
          backgroundColor: "white",
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,

          elevation: 4,
        }}
      >
        <TextInput
          ref={inputRef}
          placeholder="Join the conversation"
          value={comment}
          onChangeText={(text) => setComment(text)}
          style={{ backgroundColor: "#E4E4E4", padding: 5, borderRadius: 5 }}
          multiline
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        {isInputFocused && (
          <Pressable
            disabled={!comment}
            onPress={() => console.error("Pressed")}
            style={{
              backgroundColor: !comment ? "lightgrey" : "#0d469b",
              borderRadius: 15,
              marginLeft: "auto",
              marginTop: 15,
            }}
          >
            <Text
              style={{
                color: "white",
                paddingVertical: 5,
                paddingHorizontal: 10,
                fontWeight: "bold",
                fontSize: 13,
              }}
            >
              Reply
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
