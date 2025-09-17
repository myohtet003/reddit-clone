// import { supabase } from "../lib/superbase";

// export const fetchGroups = async (search: string) => {
//   const { data, error } = await supabase
//   .from("groups")
//   .select("*")
//   .ilike("name", search);
//   //   console.log("error", error);
//   //   console.log("data", JSON.stringify(data,null, 2));
//   if (error) {
//   throw error;
//   } else {
//   return data;
//   }
// };


import { supabase } from "../lib/superbase";

export const fetchGroups = async (search: string) => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .ilike("name", `%${search}%`); // <-- wrap search with % for partial match

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  } else {
    console.log("Supabase groups data:", JSON.stringify(data, null, 2)); // 👈 check what comes back
    return data;
  }
};
