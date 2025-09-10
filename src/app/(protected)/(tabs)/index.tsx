import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import React, {useState, useEffect} from "react"; 

import PostListItem from "../../../components/PostListItem";
import { supabase } from "../../../lib/superbase";
import { Tables } from "../../../types/database.types";

type Post = Tables<"posts"> & {
	user: Tables<"users">;
	group: Tables<"groups">;
};

// import posts from "../../../../assets/data/posts.json";


export default function HomeScreen() {

	  const [posts, setPosts] = useState<Post[]>([]);

	  useEffect(() => {
	    fetchPosts();
	  }, []);

	  const fetchPosts = async () => {
	    const { data, error } = await supabase
	      .from('posts')
	      .select('*, group:groups(*), user:users!posts_user_id_fkey(*)');
		//   console.log("error", error);
		//   console.log("data", JSON.stringify(data,null, 2));
		if(error) {
			console.log("Error fetching posts:", error.message);
			return;
		} else {
			setPosts(data);
		}
	  }
  
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


