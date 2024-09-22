"use client";
import { AppBar } from "@/app/_components/appbar";
import { Button } from "@/components/ui/button";
import { Menu, SquarePlus, Trash } from "lucide-react";
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "@/components/ui/sortable";

import { MenuManagamentHeader } from "./_components/menu-management-header";
import { useMenuState } from "./_hooks/use-menu-state";
import { MenuSectionCard } from "./_components/menu-section-card";

export default function MenuManagementPage() {
  return (
    <div>
      <AppBar />
      <MenuListSection />
    </div>
  );
}

function MenuListSection() {
  const {
    menu,
    menuIsLoading,
    menuSections,
    changeSectionName,
    deleteSection,
    changed,
    moveSection,
    saveMenuSections,
    addNewSection,
  } = useMenuState();

  return (
    <div className="mt-5 w-full px-4 pb-20 md:mt-10 lg:px-20">
      <MenuManagamentHeader onSave={saveMenuSections} saveEnabled={changed} />
      <div className="mt-5 flex flex-wrap gap-4 md:gap-5 -lg:justify-evenly">
        {menuIsLoading && <p>Loading...</p>}
        {!menu ||
          (menuSections.length === 0 && (
            <p>No menus found. Create a new one!</p>
          ))}
        {menu && (
          <div className="mx-auto w-full max-w-screen-md">
            <div className="mb-2 flex justify-end pr-2">
              <Button className="gap-1 pl-2.5" onClick={addNewSection}>
                <SquarePlus size={20} /> New
              </Button>
            </div>
            <Sortable
              value={menuSections}
              onMove={moveSection}
              overlay={
                <div className="size-full pl-11">
                  <div className="size-full rounded-xl bg-primary/30" />
                </div>
              }
            >
              {menuSections.map((menuSection) => (
                <SortableItem
                  key={menuSection.id}
                  value={menuSection.id}
                  className="mb-6"
                >
                  <div className="flex w-full gap-1">
                    <div className="flex flex-col">
                      <SortableDragHandle size="icon" variant="ghost">
                        <Menu />
                      </SortableDragHandle>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteSection(menuSection.id)}
                      >
                        <Trash className="text-destructive" />
                      </Button>
                    </div>
                    <MenuSectionCard
                      menuSection={menuSection}
                      changeSectionName={changeSectionName}
                    />
                  </div>
                </SortableItem>
              ))}
            </Sortable>
          </div>
        )}
      </div>
    </div>
  );
}
