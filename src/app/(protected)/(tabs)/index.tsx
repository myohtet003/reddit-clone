import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";

import PostListItem from "../../../components/PostListItem"; 
import { fetchPosts } from "../../../services/postService";

// import posts from "../../../../assets/data/posts.json";



export default function HomeScreen() {
  const {
    data: posts,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => fetchPosts(),
  });

//   console.log("data", posts);

  //   const [posts, setPosts] = useState<Post[]>([]);
  //   const [isLoading, setIsLoading] = useState(false);

  //   useEffect(() => {
  //     fetchPosts();
  //   }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading posts</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
        keyExtractor={(item) => item.id}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </View>
  );
}
