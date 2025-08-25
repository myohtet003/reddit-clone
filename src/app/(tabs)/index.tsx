import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import React from "react"; 
import PostListItem from "../../components/PostListItem";

import posts from "../../../assets/data/posts.json";


export default function HomeScreen() {
  
  return (
    <View>
		<FlatList
			data={posts}
			renderItem={({ item }) => <PostListItem post={item} />}
			keyExtractor={(item) => item.id}
		/>
    </View>
  );
}  


