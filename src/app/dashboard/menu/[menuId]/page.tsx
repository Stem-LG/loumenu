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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMenuState } from "./_hooks/use-menu-state";

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
  } = useMenuState();

  return (
    <div className="mt-5 w-full px-4 pb-20 md:mt-10 lg:px-20">
      <MenuManagamentHeader onSave={saveMenuSections} saveEnabled={changed} />
      <div className="mt-5 flex flex-wrap gap-4 md:gap-5 -lg:justify-evenly">
        {isLoading && <p>Loading...</p>}
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
            <Sortable value={menuSections} onMove={moveSection}>
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
                        onClick={() => {
                          setDeletedSections([
                            ...deletedSections,
                            menuSection.id,
                          ]);
                          setMenuSections(
                            menuSections.filter(
                              (section) => section.id !== menuSection.id,
                            ),
                          );
                          setChanged(true);
                        }}
                      >
                        <Trash className="text-destructive" />
                      </Button>
                    </div>
                    <MenuSectionCard
                      menuSection={menuSection}
                      setMenuSections={setMenuSections}
                      menuSections={menuSections}
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

function MenuSectionCard({ menuSection, setMenuSections, menuSections }) {
  return (
    <div className="flex-1 rounded-xl border bg-card p-4 [&>label]:ml-1">
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        value={menuSection.name}
        onChange={(e) => {
          setMenuSections(
            menuSections.map((section) =>
              section.id === menuSection.id
                ? { ...section, name: e.target.value }
                : section,
            ),
          );
        }}
      />
    </div>
  );
}
