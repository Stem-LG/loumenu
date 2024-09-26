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
import { Input } from "@/components/ui/input";
import { useMenu } from "../menu/[menuId]/_hooks/use-menu";
import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateRandomSlug } from "@/lib/utils";
import { Copy, CopyCheck, Download } from "lucide-react";
import { toast } from "sonner";
import QRCode from "react-qr-code";

export default function ShareMenuDialog({
  isOpen,
  onClose,
  menuId,
}: {
  isOpen: boolean;
  onClose: () => void;
  menuId: string;
}) {
  const supabase = createClient();

  const { data: menu, refetch } = useMenu(menuId);

  function setSlug(slug: string) {
    supabase
      .from("menus")
      .update({ slug })
      .eq("id", menu.id)
      .then(() => {
        refetch();
      });
  }

  useEffect(() => {
    if (!menu) return;

    if (!menu.slug) {
      setSlug(generateRandomSlug());
    }
  // eslint-disable-next-line
  }, [menu]);

  const menuSlug = useMemo(() => {
    return menu ? menu.slug : `generating...`;
  }, [menu]);

  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/menu/${menuSlug}`);

    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function saveSlug(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const slug = formData.get("slug") as string;

    supabase
      .from("menus")
      .update({ slug })
      .eq("id", menu.id)
      .then(({ error }) => {
        if (error) {
          toast.error(error.message);
          return;
        }

        refetch();
        toast.success("New link saved successfully!");
        onClose();
      });
  }

  const qrCodeRef = useRef(null);

  const [copiedQr, setCopiedQr] = useState(false);

  function downloadQRCode() {
    const svg = qrCodeRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = "qrcode.png";
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  }

  //copy qr code to clipboard as png
  function CopyQRCode() {
    const svg = qrCodeRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        setCopiedQr(true);
        toast.success("QR Code copied to clipboard!");
        setTimeout(() => {
          setCopiedQr(false);
        }, 2000);
      });
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  }

  return (
    <Credenza open={isOpen} onOpenChange={onClose}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Share {menu ? menu.name : "..."}</CredenzaTitle>
          <CredenzaDescription>
            Share this menu with your customers and community.
          </CredenzaDescription>
        </CredenzaHeader>
        <form className="space-y-4" onSubmit={saveSlug}>
          <CredenzaBody>
            <input type="text" className="fixed -translate-x-[200dvw]" />
            <QRCode
              size={288}
              value={`${window.location.origin}/menu/${menuSlug}`}
              className="mx-auto"
              ref={qrCodeRef}
            />
            <div className="mx-auto my-2 flex w-72 gap-2">
              <Button
                className="flex-1 gap-2"
                onClick={CopyQRCode}
                type="button"
              >
                {copiedQr ? <CopyCheck size={18} /> : <Copy size={18} />}
                Copy
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={downloadQRCode}
                type="button"
              >
                <Download size={18} /> Download
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-sm">{window.location.origin}/menu/</p>
              <Input
                name="slug"
                defaultValue={menuSlug}
                className="mr-1 flex-1"
              />
              <Button size="icon" onClick={copyLink}>
                {copied ? <CopyCheck size={20} /> : <Copy size={20} />}
              </Button>
            </div>
          </CredenzaBody>
          <CredenzaFooter className="gap-1">
            <CredenzaClose>
              <Button type="reset" variant="ghost">
                Close
              </Button>
            </CredenzaClose>
            <Button type="submit">Save</Button>
          </CredenzaFooter>
        </form>
      </CredenzaContent>
    </Credenza>
  );
}
