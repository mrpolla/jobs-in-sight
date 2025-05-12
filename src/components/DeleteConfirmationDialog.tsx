
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  jobTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationDialog({
  isOpen,
  jobTitle,
  onConfirm,
  onCancel
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive">
            <Trash className="mr-2 h-5 w-5" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to delete the job <span className="font-semibold">{jobTitle}</span>?
            <p className="mt-2">This action cannot be undone.</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-between sm:gap-0">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
