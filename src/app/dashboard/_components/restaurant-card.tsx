import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function RestaurantCard({ restaurant }: any) {
  const supabase = createClient();

  const [isCredenzaDeleteOpen, setCredenzaDeleteOpen] = useState(false);
  const [isCredenzaEditOpen, setCredenzaEditOpen] = useState(false);

  const { refetch } = useQuery({
    queryKey: ["restaurants"],
  });

  async function deleteRestaurant() {
    const { error } = await supabase
      .from("restaurants")
      .delete()
      .eq("id", restaurant.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Restaurant deleted successfully!");
    setCredenzaDeleteOpen(false);
    refetch();
  }

  async function onEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const { error } = await supabase
      .from("restaurants")
      .update({ name, description })
      .eq("id", restaurant.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Restaurant updated successfully!");
    setCredenzaEditOpen(false);
    refetch();
  }

  return (
    <div className="w-full rounded-xl bg-card shadow-lg md:w-96">
      <Link href={`/dashboard/${restaurant.id}`}>
        <Image
          src="/assets/logo.svg"
          width={320}
          height={320}
          alt="restaurant_image"
          className="h-40 w-full object-cover"
        />
      </Link>
      <div className="flex items-center justify-between pr-1">
        <Link href={`/dashboard/${restaurant.id}`}>
          <div className="p-4">
            <h2 className="text-lg font-semibold md:text-2xl">
              {restaurant.name}
            </h2>
            <p className="opacity-80 -md:text-sm">
              {restaurant.menus.length} menus
            </p>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setCredenzaEditOpen(true)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCredenzaDeleteOpen(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Credenza
          open={isCredenzaDeleteOpen}
          onOpenChange={setCredenzaDeleteOpen}
        >
          <CredenzaContent>
            <CredenzaHeader>
              <CredenzaTitle>Delete {restaurant.name}</CredenzaTitle>
              <CredenzaDescription>
                Are you sure you want to delete this restaurant?
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaFooter>
              <CredenzaClose asChild>
                <Button variant="ghost">Cancel</Button>
              </CredenzaClose>
              <Button onClick={deleteRestaurant}>Confirm</Button>
            </CredenzaFooter>
          </CredenzaContent>
        </Credenza>

        <Credenza open={isCredenzaEditOpen} onOpenChange={setCredenzaEditOpen}>
          <CredenzaContent>
            <CredenzaHeader>
              <CredenzaTitle>Edit {restaurant.name}</CredenzaTitle>
              <CredenzaDescription>
                Change the name and description of your restaurant.
              </CredenzaDescription>
            </CredenzaHeader>
            <form onSubmit={onEditSubmit} className="md:space-y-4" autoFocus={false}>
              <CredenzaBody className="[&>label]:ml-0.5">
                <Label htmlFor="name">
                  Name<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  className="mb-1"
                  placeholder="Restaurant Name"
                  defaultValue={restaurant.name}
                  onFocus={(e) => e.currentTarget.blur()}
                />
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description (optional)"
                  defaultValue={restaurant.description}
                />
              </CredenzaBody>
              <CredenzaFooter>
                <CredenzaClose asChild>
                  <Button variant="ghost" type="reset">
                    Cancel
                  </Button>
                </CredenzaClose>
                <Button type="submit">Save</Button>
              </CredenzaFooter>
            </form>
          </CredenzaContent>
        </Credenza>
      </div>
    </div>
  );
}