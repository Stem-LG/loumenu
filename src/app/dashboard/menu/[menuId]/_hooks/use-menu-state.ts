"use client"
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { useMenu } from "./use-menu";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";


// ❤️ Copilot, it auto generated most of the crud operations below, few hours saved 🚀

export function useMenuState() {
  const supabase = createClient();

  const { menuId } = useParams<{ menuId: string }>();

  const { data: menu, isLoading: menuIsLoading, refetch } = useMenu(menuId);

  const [menuSections, setMenuSections] = useState([]);
  const [deletedSections, setDeletedSections] = useState([]);
  const [deletedMenuItems, setDeletedMenuItems] = useState([]);
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
      //eslint-disable-next-line
      .upsert(menuSections.map(({ menu_items, ...section }) => section));

    const { error: menuItemError } = await supabase
      .from("menu_items")
      .delete()
      .in("id", deletedMenuItems);

    const { error: menuItemUpsertError } = await supabase
      .from("menu_items")
      .upsert(
        menuSections.reduce(
          (acc, { menu_items }) => [...acc, ...menu_items],
          [],
        ),
      );


    if (error || deleteError || menuItemError || menuItemUpsertError) {
      toast.error(error?.message || deleteError?.message || menuItemError?.message || menuItemUpsertError?.message);
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

  function addMenuItem(menuItem) {
    setMenuSections(
      menuSections.map((section) =>
        section.id === menuItem.menu_section_id
          ? {
            ...section,
            menu_items: [
              ...section.menu_items,
              {
                id: crypto.randomUUID(),
                ...menuItem,
              }
            ],
          }
          : section,
      ),
    );
    setChanged(true);
  }

  function deleteMenuItem(menuItem) {

    console.log(menuItem);

    setMenuSections(
      menuSections.map((section) =>
        section.id === menuItem.menu_section_id
          ? {
            ...section,
            menu_items: section.menu_items.filter(
              (item) => {
                return item.id !== menuItem.id
              },
            ),
          }
          : section,
      ),
    );

    setDeletedMenuItems([
      ...deletedMenuItems,
      menuItem.id,
    ]);

    setChanged(true);
  }

  function changeMenuItem(menuItem) {
    setMenuSections(
      menuSections.map((section) =>
        section.id === menuItem.menu_section_id
          ? {
            ...section,
            menu_items: section.menu_items.map((item) =>
              item.id === menuItem.id
                ? menuItem
                : item,
            ),
          }
          : section,
      ),
    );
    setChanged(true);
  }

  function moveMenuItem(sectionId, { activeIndex, overIndex }) {
    const section = menuSections.find(
      (section) => section.id === sectionId,
    );

    const newMenuItems = arrayMove(
      section.menu_items,
      activeIndex,
      overIndex,
    );

    newMenuItems.forEach((item, index) => {
      (item as any).position = index;
    });

    setMenuSections(
      menuSections.map((section) =>
        section.id === sectionId
          ? { ...section, menu_items: newMenuItems }
          : section,
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
    addMenuItem,
    deleteMenuItem,
    changeMenuItem,
    moveMenuItem,
  };
}