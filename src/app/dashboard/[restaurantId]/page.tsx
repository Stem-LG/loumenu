"use client";
import { AppBar } from "@/app/_components/appbar";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { MenuListHeader } from "./_components/menu-list-header";
import { MenuCard } from "./_components/menu-card";

export default function RestaurantMenusPage() {
  return (
    <div>
      <AppBar />
      <MenuListSection />
    </div>
  );
}

function MenuListSection() {
  const supabase = createClient();

  const { restaurantId } = useParams<{ restaurantId: string }>();

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: async () => {
      const { data: restaurant, error } = await supabase
        .from("restaurants")
        .select("*, menus(*)")
        .eq("id", restaurantId)
        .single();

      if (error) {
        throw error;
      }

      return restaurant;
    },
  });

  return (
    <div className="mt-5 w-full px-4 pb-20 md:mt-10 lg:px-20">
      <MenuListHeader />
      <div className="mt-5 flex flex-wrap gap-4 md:gap-5 -lg:justify-evenly">
        {isLoading && <p>Loading...</p>}

        {restaurant && restaurant.menus && restaurant.menus.length === 0 && (
          <p>No menus found. Create a new one!</p>
        )}

        {restaurant &&
          restaurant.menus &&
          restaurant.menus
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((menu) => <MenuCard key={menu.id} menu={menu} />)}
      </div>
    </div>
  );
}
