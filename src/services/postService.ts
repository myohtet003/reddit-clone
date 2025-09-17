import { supabase } from "../lib/superbase";

export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, group:groups(*), user:users!posts_user_id_fkey(*)");
  //   console.log("error", error);
  //   console.log("data", JSON.stringify(data,null, 2));
  if (error) {
    throw error;
  } else {
    return data;
  }
};


export const fetchPostsById = async (id: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, group:groups(*), user:users!posts_user_id_fkey(*)")
	.eq("id", id)
	.single();
  //   console.log("data", data);
  //   console.log("error", error);
  //   console.log("data", JSON.stringify(data,null, 2));
  if (error) {
    throw error;
  } else {
    return data;
  }
};