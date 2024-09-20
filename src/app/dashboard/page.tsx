"use client";
import { AppBar } from "@/app/_components/appbar";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

import { RestaurantCard } from "./_components/restaurant-card";
import { RestaurantListHeader } from "./_components/restaurant-list-header";

export default function DashboardPage() {
  return (
    <div>
      <AppBar />
      <RestaurantListSection />
    </div>
  );
}

function RestaurantListSection() {
  const supabase = createClient();

  const { data: restaurants, isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data: restaurants, error } = await supabase
        .from("restaurants")
        .select("*, menus(*)");

      if (error) {
        throw error;
      }

      return restaurants;
    },
  });

  return (
    <div className="mt-5 w-full px-4 pb-20 md:mt-10 lg:px-20">
      <RestaurantListHeader />
      <div className="mt-5 flex flex-wrap gap-4 md:gap-5 -lg:justify-evenly">
        {isLoading && <p>Loading...</p>}

        {restaurants?.length === 0 && (
          <p>No restaurants found. Create a new one!</p>
        )}

        {restaurants &&
          restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
      </div>
    </div>
  );
}
