"use client";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SquarePlus } from "lucide-react";

export function RestaurantListHeader() {
  const [isCredenzaOpen, setCredenzaOpen] = useState(false);

  const supabase = createClient();

  const { refetch } = useQuery({
    queryKey: ["restaurants"],
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const { error } = await supabase.from("restaurants").insert({
      name,
      description,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    refetch();
    toast.success("Restaurant created successfully!");
    setCredenzaOpen(false);
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold md:text-4xl">My Restaurants</h1>
      <Credenza open={isCredenzaOpen} onOpenChange={setCredenzaOpen}>
        <CredenzaTrigger asChild>
          <Button className="gap-1 pl-2.5 -md:fixed -md:bottom-5 -md:right-5">
            <SquarePlus size={20} /> New
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Create New Restaurant</CredenzaTitle>
            <CredenzaDescription>
              Start by choosing a name and a description for your restaurant.
            </CredenzaDescription>
          </CredenzaHeader>
          <form onSubmit={onSubmit} className="md:space-y-4">
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
              />
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description (optional)"
              />
            </CredenzaBody>
            <CredenzaFooter>
              <CredenzaClose asChild>
                <Button variant="ghost" type="reset">
                  Cancel
                </Button>
              </CredenzaClose>
              <Button type="submit" autoFocus>
                Confirm
              </Button>
            </CredenzaFooter>
          </form>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}
