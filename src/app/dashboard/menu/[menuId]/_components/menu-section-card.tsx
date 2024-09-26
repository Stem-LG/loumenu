"use client";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "@/components/ui/sortable";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Menu, MoreHorizontal, SquarePlus } from "lucide-react";
import { useState } from "react";

export function MenuSectionCard({
  menuSection,
  changeSectionName,
  addMenuItem,
  changeMenuItem,
  deleteMenuItem,
  moveMenuItem,
}) {
  const [isCredenzaAddOpen, setCredenzaAddOpen] = useState(false);

  function onAddItemSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");

    addMenuItem({
      name,
      description,
      price,
      menu_section_id: menuSection.id,
    });

    setCredenzaAddOpen(false);
  }

  return (
    <div className="flex-1 rounded-xl border bg-card p-4 [&>label]:ml-1">
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        value={menuSection.name}
        onChange={(e) => changeSectionName(menuSection.id, e.target.value)}
      />
      <div className="mt-1 flex justify-end pr-2">
        <Button
          className="gap-1 px-2.5 text-primary hover:bg-transparent"
          variant="ghost"
          onClick={() => setCredenzaAddOpen(true)}
        >
          <SquarePlus size={20} /> New
        </Button>
      </div>
      <div className="w-full rounded-xl border p-4">
        {!menuSection.menu_items.length && (
          <p className="text-center">No menu items found. Create a new one!</p>
        )}
        <Sortable
          value={menuSection.menu_items}
          onMove={(e) => {
            moveMenuItem(menuSection.id, e);
          }}
          overlay={
            <div className="size-full pl-9">
              <div className="size-full rounded-md border bg-primary/10" />
            </div>
          }
        >
          {menuSection.menu_items.map((menuItem) => (
            <SectionItem
              key={menuItem.id}
              menuItem={menuItem}
              deleteMenuItem={deleteMenuItem}
              changeMenuItem={changeMenuItem}
            />
          ))}
        </Sortable>
      </div>
      <Credenza open={isCredenzaAddOpen} onOpenChange={setCredenzaAddOpen}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Create a new item</CredenzaTitle>
            <CredenzaDescription>
              Start by choosing a name, description, and price for your new
              item.
            </CredenzaDescription>
          </CredenzaHeader>
          <form onSubmit={onAddItemSubmit} className="md:space-y-4">
            <CredenzaBody className="[&>label]:ml-0.5">
              <Label htmlFor="name">
                Name<span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                className="mb-1"
                placeholder="Item Name"
              />
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                className="mb-1"
                placeholder="Description (optional)"
              />
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                name="price"
                placeholder="Item Price"
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

function SectionItem({ menuItem, deleteMenuItem, changeMenuItem }) {
  const [isCredenzaEditOpen, setCredenzaEditOpen] = useState(false);
  const [isCredenzaDeleteOpen, setCredenzaDeleteOpen] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");

    changeMenuItem({
      ...menuItem,
      name,
      description,
      price,
    });

    setCredenzaEditOpen(false);
  }

  return (
    <>
      <SortableItem key={menuItem.id} value={menuItem.id}>
        <div className="flex gap-2">
          <SortableDragHandle variant="ghost" size="icon">
            <Menu />
          </SortableDragHandle>
          <div
            key={menuItem.id}
            className="flex w-full items-center justify-between"
          >
            <p className="flex-1 cursor-pointer">{menuItem.name}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={() => setCredenzaEditOpen(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCredenzaDeleteOpen(true)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SortableItem>
      <Credenza
        open={isCredenzaDeleteOpen}
        onOpenChange={setCredenzaDeleteOpen}
      >
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Delete {menuItem.name}</CredenzaTitle>
            <CredenzaDescription>
              Are you sure you want to delete this item?
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button variant="ghost">Cancel</Button>
            </CredenzaClose>
            <Button
              onClick={() => {
                deleteMenuItem(menuItem);
                setCredenzaDeleteOpen(false);
              }}
            >
              Confirm
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
      <Credenza open={isCredenzaEditOpen} onOpenChange={setCredenzaEditOpen}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Edit {menuItem.name}</CredenzaTitle>
            <CredenzaDescription>
              Change your item&apos;s name, description, and price.
            </CredenzaDescription>
          </CredenzaHeader>
          <form onSubmit={onSubmit} className="md:space-y-4">
            <CredenzaBody className="[&>label]:ml-0.5">
              <Switch className="fixed -translate-x-[200vh]" />{" "}
              {/* Hack to not get auto focused input*/}
              <Label htmlFor="name">
                Name<span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                className="mb-1"
                placeholder="Item Name"
                defaultValue={menuItem.name}
              />
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                className="mb-1"
                placeholder="Description (optional)"
                defaultValue={menuItem.description}
              />
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                placeholder="Item Price"
                type="number"
                defaultValue={menuItem.price}
              />
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
    </>
  );
}
