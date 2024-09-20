import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useUser() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["user"],
    retry: false,
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      return user;
    },
  });
}
