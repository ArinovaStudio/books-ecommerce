import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import {toast} from "sonner";
interface IProps extends React.PropsWithChildren {
  url: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function CopyUrlLinkDialog({children, url, open, setOpen }: IProps) {
  const [copied,setCopied] = useState(false);
  const handleCopy = ()=>{navigator.clipboard.writeText(url);toast.success("Link Copied Successfully");setCopied(true)}
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Share this link</DialogTitle>
          <DialogDescription>
            Copy the URL below to share it with others.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 mt-4">
          <Input readOnly value={url} className="flex-1" />
          <Button onClick={handleCopy} className="hover:bg-gray-100" variant="ghost" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={handleCopy}>Copy URL</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
