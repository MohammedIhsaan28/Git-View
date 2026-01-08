"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-4 w-[85%] max-w-sm rounded-xl h-auto
                   fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   border border-violet-500 shadow-lg"
      >
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-lg">
            <Trash2 className="h-5 w-5 text-violet-500" />
            Delete Item
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Are you sure you want to delete? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-center gap-3 mt-2">
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="bg-violet-500 text-white hover:opacity-90"
          >
            OK
          </Button>

          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="border-violet-500 text-violet-500 hover:bg-violet-50"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
