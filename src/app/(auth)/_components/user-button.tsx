import { createClient } from "@/lib/supabase/client";
import { useUser } from "../_hooks/use-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, SquareArrowOutUpRight } from "lucide-react";
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
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function UserButton() {
  const supabase = createClient();

  const { data: user, refetch, isError, isRefetching } = useUser();

  async function logout() {
    await supabase.auth.signOut();
    refetch();
  }

  const [isCredenzaManageAccountOpen, setIsCredenzaManageAccountOpen] =
    useState(false);
  const [isCredenzaLogoutOpen, setIsCredenzaLogoutOpen] = useState(false);

  async function handleUpdateProfile(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const full_name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const { error } = await supabase.auth.updateUser({
      data: { full_name },
      email,
    });

    if (error) {
      toast.error(error.message);
    } else if (email == user.email) {
      toast.success("Profile updated successfully.");
      refetch();
      setIsCredenzaManageAccountOpen(false);
    } else {
      toast.success("Email change confirmation sent to your email.");
      refetch();
      setIsCredenzaManageAccountOpen(false);
    }
  }

  if (isError || !user) {
    return (
      <Link href="/login">
        <Button className="dark:bg-foreground" disabled={isRefetching}>
          Login
        </Button>
      </Link>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" disabled={isRefetching}>
            {user.user_metadata.full_name
              ? user.user_metadata.full_name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()
              : user.email[0].toUpperCase()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="gap-1"
            onClick={() => setIsCredenzaManageAccountOpen(true)}
          >
            <Settings size={16} /> Manage Account
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-1 text-destructive"
            onClick={() => setIsCredenzaLogoutOpen(true)}
          >
            <LogOut className="rotate-180" size={16} /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Credenza
        open={isCredenzaManageAccountOpen}
        onOpenChange={setIsCredenzaManageAccountOpen}
      >
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Manage Account</CredenzaTitle>
            <CredenzaDescription>
              Manage your account settings here.
            </CredenzaDescription>
          </CredenzaHeader>
          <form className="md:space-y-4" onSubmit={handleUpdateProfile}>
            <input className="fixed -left-[200vh]" />
            <CredenzaBody>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.user_metadata.full_name}
              />
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" defaultValue={user.email} />

              <Link href="/reset">
                <Button className="mt-2 gap-2">
                  <SquareArrowOutUpRight size={18} /> Reset Password
                </Button>
              </Link>
            </CredenzaBody>
            <CredenzaFooter>
              <CredenzaClose>
                <Button variant="outline" type="reset">
                  Close
                </Button>
              </CredenzaClose>
              <Button type="submit">Save</Button>
            </CredenzaFooter>
          </form>
        </CredenzaContent>
      </Credenza>
      <Credenza
        open={isCredenzaLogoutOpen}
        onOpenChange={setIsCredenzaLogoutOpen}
      >
        <CredenzaContent>
          <input className="fixed -left-[200vh]" />
          <CredenzaHeader>
            <CredenzaTitle>Logout</CredenzaTitle>
            <CredenzaDescription>
              Are you sure you want to logout?
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaFooter>
            <CredenzaClose>
              <Button variant="outline">Cancel</Button>
            </CredenzaClose>
            <Button onClick={logout}>Logout</Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
