"use client"
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMenu(menuId) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["menu", menuId],

    queryFn: async () => {
      const { data: menu, error } = await supabase
        .from("menus")
        .select("*, restaurant:restaurants(*), menu_sections(*, menu_items(*))")
        .eq("id", menuId)
        .single();

      if (error) {
        toast.error(error.message);
        throw error;
      }
      return menu;
    },
  });
}