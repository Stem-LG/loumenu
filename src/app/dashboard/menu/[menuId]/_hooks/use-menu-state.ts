"use client"
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { useMenu } from "./use-menu";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

export function useMenuState() {
  const supabase = createClient();

  const { menuId } = useParams<{ menuId: string }>();

  const { data: menu, isLoading } = useMenu(menuId);

  const [menuSections, setMenuSections] = useState([]);
  const [deletedSections, setDeletedSections] = useState([]);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (menu) {
      setMenuSections(menu.menu_sections);
    }
  }, [menu]);

  function moveSection({ activeIndex, overIndex }) {
    const newMenuSections = arrayMove(menuSections, activeIndex, overIndex);

    newMenuSections.forEach((section, index) => {
      section.position = index;
    });

    setMenuSections(newMenuSections);
    setChanged(true);
  }

  async function saveMenuSections() {
    console.log("deleting deleted");

    const { error: deleteError } = await supabase
      .from("menu_sections")
      .delete()
      .in("id", deletedSections);

    console.log("upserting sections");

    const { error } = await supabase
      .from("menu_sections")
      .upsert(menuSections.map(({ menu_items, ...section }) => section));

    if (error || deleteError) {
      toast.error(error.message || deleteError.message);
    }

    setDeletedSections([]);
    setChanged(false);

    toast.success("Menu sections saved successfully");
  }

  async function addNewSection() {
    const { data: newSection, error } = await supabase
      .from("menu_sections")
      .insert({
        menu_id: menuId,
        name: "New section",
        position: menuSections.length,
      })
      .select();

    if (error) {
      toast.error(error.message);
    }

    setMenuSections([...menuSections, newSection[0]]);

    toast.success("New section added successfully");
  }

  return {
    menu,
    isLoading,
    menuSections,
    setMenuSections,
    deletedSections,
    setDeletedSections,
    changed,
    setChanged,
    moveSection,
    saveMenuSections,
    addNewSection,
  };
}