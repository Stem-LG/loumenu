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

  const { data: menu, isLoading: menuIsLoading, refetch } = useMenu(menuId);

  const [menuSections, setMenuSections] = useState([]);
  const [deletedSections, setDeletedSections] = useState([]);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (menu) {
      setMenuSections(menu.menu_sections);
    }
  }, [menu]);

  async function saveMenuSections() {
    const { error: deleteError } = await supabase
      .from("menu_sections")
      .delete()
      .in("id", deletedSections);

    const { error } = await supabase
      .from("menu_sections")
      .upsert(menuSections.map(({ menu_items, ...section }) => section));

    if (error || deleteError) {
      toast.error(error.message || deleteError.message);
    }

    refetch();
    setDeletedSections([]);
    setChanged(false);

    toast.success("Menu sections saved successfully");
  }

  async function addNewSection() {

    const newSection = {
      id: crypto.randomUUID(),
      name: "New Section",
      position: menuSections.length,
      menu_id: menu.id,
      menu_items: [],
    };

    setMenuSections([newSection, ...menuSections]);

    setChanged(true);

    toast.success("New section added successfully");
  }

  function changeSectionName(sectionId, name) {
    setMenuSections(
      menuSections.map((section) =>
        section.id === sectionId
          ? { ...section, name }
          : section,
      ),
    );
    setChanged(true);
  }

  function moveSection({ activeIndex, overIndex }) {
    const newMenuSections = arrayMove(menuSections, activeIndex, overIndex);

    newMenuSections.forEach((section, index) => {
      section.position = index;
    });

    setMenuSections(newMenuSections);
    setChanged(true);
  }

  function deleteSection(sectionId) {
    setDeletedSections([
      ...deletedSections,
      sectionId,
    ]);
    setMenuSections(
      menuSections.filter(
        (section) => section.id !== sectionId,
      ),
    );
    setChanged(true);
  }

  return {
    menu,
    menuIsLoading,
    menuSections,
    changeSectionName,
    deleteSection,
    changed,
    moveSection,
    saveMenuSections,
    addNewSection,
  };
}