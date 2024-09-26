"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { toast } from "sonner";

const MenuItem = ({ name, description, price }) => (
  <div className="mb-4">
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-semibold text-primary">{name}</h4>
      <span className="font-bold text-primary">${price.toFixed(2)}</span>
    </div>
    <p className="text-sm text-primary">{description}</p>
  </div>
);
const MenuSection = ({ title, items }) => (
  <Card className="mb-6 border-primary bg-background">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-primary">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {items.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </CardContent>
  </Card>
);

export default function PublicMenuPage() {
  const supabase = createClient();

  const { menuSlug } = useParams<{ menuSlug: string }>();

  const {
    data: menu,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["menu", menuSlug],
    retry: 1,
    queryFn: async () => {
      const { data: menu, error } = await supabase
        .from("menus")
        .select("*, menu_sections(*, menu_items(*)), restaurants(name)")
        .eq("slug", menuSlug)
        .single();

      if (error) {
        toast.error(error.message);
        throw error;
      }

      return menu;
    },
  });

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return redirect("/404");
  }

  console.log(menu);

  return (
    <div className="mx-auto mt-3 max-w-3xl rounded-lg bg-primary/10 p-6 shadow-lg">
      <h1 className="mb-4 text-center text-4xl font-extrabold text-primary">
        {menu.restaurants.name}
      </h1>
      <h2 className="mb-6 text-center text-2xl font-bold text-primary">
        {menu.name}
      </h2>
      <Separator className="my-4 bg-primary" />
      <ScrollArea className="h-[calc(100dvh-200px)] pr-4">
        {menu.menu_sections.map((section, index) => (
          <MenuSection
            key={index}
            title={section.name}
            items={section.menu_items}
          />
        ))}
      </ScrollArea>
      <Link href="/">
        <Button className="fixed bottom-5 right-10">Made with Loumenu</Button>
      </Link>
    </div>
  );
}
