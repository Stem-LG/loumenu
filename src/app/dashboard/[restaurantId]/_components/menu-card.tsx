"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { EllipsisVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import ShareMenuDialog from "../../_components/share-menu-dialog";

export function MenuCard({ menu }: { menu: any }) {
  const supabase = createClient();

  const { restaurantId } = useParams<{ restaurantId: string }>();

  const [isCredenzaDeleteOpen, setCredenzaDeleteOpen] = useState(false);
  const [isCredenzaEditOpen, setCredenzaEditOpen] = useState(false);
  const [isShareMenuDialogOpen, setIsShareMenuDialogOpen] = useState(false);

  const { refetch, isFetching } = useQuery({
    queryKey: ["restaurant", restaurantId],
  });

  async function toggleMenuVisibilty() {
    const { error } = await supabase
      .from("menus")
      .update({ enabled: !menu.enabled })
      .eq("id", menu.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    refetch();
  }

  async function deleteMenu() {
    const { error } = await supabase.from("menus").delete().eq("id", menu.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Menu deleted successfully!");
    setCredenzaDeleteOpen(false);
    refetch();
  }

  async function onEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const enabled = formData.get("enabled") === "on";

    const { error } = await supabase
      .from("menus")
      .update({ name, description, enabled })
      .eq("id", menu.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Menu updated successfully!");
    setCredenzaEditOpen(false);
    refetch();
  }

  return (
    <div className="w-full rounded-xl bg-card shadow-lg md:w-96">
      <div className="space-y-4 p-4">
        <Link href={`/dashboard/menu/${menu.id}`}>
          <h2 className="text-lg font-semibold md:text-2xl">{menu.name}</h2>
        </Link>
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <Switch
              checked={menu.enabled}
              disabled={isFetching}
              onClick={toggleMenuVisibilty}
            />
            <p>{menu.enabled ? "Public" : "Private"}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setIsShareMenuDialogOpen(true)}>
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCredenzaEditOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCredenzaDeleteOpen(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ShareMenuDialog
            isOpen={isShareMenuDialogOpen}
            onClose={() => setIsShareMenuDialogOpen(false)}
            menuId={menu.id}
          />
          <Credenza
            open={isCredenzaDeleteOpen}
            onOpenChange={setCredenzaDeleteOpen}
          >
            <CredenzaContent>
              <CredenzaHeader>
                <CredenzaTitle>Delete {menu.name}</CredenzaTitle>
                <CredenzaDescription>
                  Are you sure you want to delete this Menu?
                </CredenzaDescription>
              </CredenzaHeader>
              <CredenzaFooter>
                <CredenzaClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </CredenzaClose>
                <Button onClick={deleteMenu}>Confirm</Button>
              </CredenzaFooter>
            </CredenzaContent>
          </Credenza>
          <Credenza
            open={isCredenzaEditOpen}
            onOpenChange={setCredenzaEditOpen}
          >
            <CredenzaContent>
              <CredenzaHeader>
                <CredenzaTitle>Edit {menu.name}</CredenzaTitle>
                <CredenzaDescription>
                  Update the name, description, and visibility of this menu.
                </CredenzaDescription>
              </CredenzaHeader>
              <form onSubmit={onEditSubmit} className="md:space-y-4">
                <CredenzaBody className="[&>label]:ml-0.5">
                  {/* Hack to not get auto focused input*/}
                  <Switch className="fixed -translate-x-[200vh]" />
                  <Label htmlFor="name">
                    Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    className="mb-1"
                    placeholder="Menu Name"
                    defaultValue={menu.name}
                  />
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Description (optional)"
                    defaultValue={menu.description}
                  />
                  <Label htmlFor="enabled">Visibility</Label>
                  <div className="flex items-center gap-1">
                    <Switch
                      id="enabled"
                      name="enabled"
                      defaultChecked={menu.enabled}
                    />
                    <p>{menu.enabled ? "Public" : "Private"}</p>
                  </div>
                </CredenzaBody>
                <CredenzaFooter>
                  <CredenzaClose asChild>
                    <Button variant="ghost" type="reset">
                      Cancel
                    </Button>
                  </CredenzaClose>
                  <Button type="submit">Confirm</Button>
                </CredenzaFooter>
              </form>
            </CredenzaContent>
          </Credenza>
        </div>
      </div>
    </div>
  );
}
