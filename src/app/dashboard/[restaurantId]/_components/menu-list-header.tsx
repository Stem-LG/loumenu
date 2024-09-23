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
import { ChevronLeft, SquarePlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useParams } from "next/navigation";
import Link from "next/link";

export function MenuListHeader() {
  const [isCredenzaOpen, setCredenzaOpen] = useState(false);

  const [switchState, setSwitchState] = useState(false);

  const { restaurantId } = useParams<{ restaurantId: string }>();

  const supabase = createClient();

  const { data: restaurant, refetch } = useQuery({
    queryKey: ["restaurant", restaurantId],
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const enabled = formData.get("enabled") === "on";

    const { error } = await supabase.from("menus").insert({
      name,
      description,
      enabled,
      restaurant_id: restaurantId,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    refetch();
    toast.success("Restaurant created successfully!");
    setCredenzaOpen(false);
    setSwitchState(false);
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center">
        <Link href="/dashboard/">
          <Button size="icon" variant="ghost">
            <ChevronLeft />
          </Button>
        </Link>
        <h1 className="flex-1 text-2xl font-semibold md:text-4xl -md:-translate-x-5 -md:text-center">
          {restaurant && (restaurant as any).name
            ? (restaurant as any).name
            : "..."}
        </h1>
      </div>
      <Credenza open={isCredenzaOpen} onOpenChange={setCredenzaOpen}>
        <CredenzaTrigger asChild>
          <Button className="gap-1 pl-2.5 -md:fixed -md:bottom-5 -md:right-5">
            <SquarePlus size={20} /> New
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Create New Menu</CredenzaTitle>
            <CredenzaDescription>
              Start by choosing a name and a description for your Menu.
            </CredenzaDescription>
          </CredenzaHeader>
          <form
            onSubmit={onSubmit}
            className="md:space-y-4"
            onReset={() => setCredenzaOpen(false)}
          >
            <CredenzaBody className="[&>label]:ml-0.5">
              <Label htmlFor="name">
                Name<span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                required
                className="mb-1"
                placeholder="Menu Name"
              />
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description (optional)"
              />
              <Label htmlFor="enabled">Visibility</Label>
              <div className="flex items-center gap-1">
                <Switch
                  id="enabled"
                  name="enabled"
                  checked={switchState}
                  onCheckedChange={setSwitchState}
                />
                <p>{switchState ? "Public" : "Private"}</p>
              </div>
            </CredenzaBody>
            <CredenzaFooter>
              <CredenzaClose asChild>
                <Button variant="ghost" type="reset">
                  Cancel
                </Button>
              </CredenzaClose>
              <Button type="submit" autoFocus>Confirm</Button>
            </CredenzaFooter>
          </form>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}
