"use client";

import { useParams } from "next/navigation";
import { useMenu } from "../_hooks/use-menu";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, Save, Share } from "lucide-react";
import ShareMenuDialog from "@/app/dashboard/_components/share-menu-dialog";
import { useState } from "react";

export function MenuManagamentHeader({ onSave, saveEnabled }) {
  const { menuId } = useParams<{ menuId: string }>();

  const { data: menu } = useMenu(menuId);

  const [isShareMenuDialogOpen, setIsShareMenuDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center">
        <Link href={"/dashboard/" + (menu as any)?.restaurant_id || ""}>
          <Button size="icon" variant="ghost">
            <ChevronLeft />
          </Button>
        </Link>
        {menu ? (
          <div className="relative w-full">
            <h1 className="flex-1 text-2xl font-semibold md:text-4xl -md:-translate-x-5 -md:text-center">
              {(menu as any).name}
            </h1>
            <p className="absolute -bottom-3 left-0 text-xs -md:w-full -md:-translate-x-5 -md:text-center">
              ({(menu as any).restaurant.name})
            </p>
          </div>
        ) : (
          <p className="text-2xl md:text-4xl">...</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          className="gap-1 pl-2.5"
          onClick={() => setIsShareMenuDialogOpen(true)}
        >
          <Share size-20 />
          Share
        </Button>
        <Button
          className="gap-1 pl-2.5 -md:fixed -md:bottom-5 -md:right-5"
          onClick={onSave}
          disabled={!saveEnabled}
        >
          {saveEnabled ? (
            <>
              <Save size={20} /> <p>Save</p>
            </>
          ) : (
            <>
              <Check size={20} /> <p>Saved</p>
            </>
          )}
        </Button>
      </div>
      <ShareMenuDialog
        isOpen={isShareMenuDialogOpen}
        onClose={() => setIsShareMenuDialogOpen(false)}
        menuId={menuId}
      />
    </div>
  );
}
