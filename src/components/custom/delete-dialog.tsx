'use client';

import { IconTrash } from '@tabler/icons-react';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

type ActionType = 
  | ((formData: FormData) => Promise<any>)
  | ((userId: string) => Promise<any>);

interface Props {
  action: ActionType;
  title: string;
  description: string;
  id?: string;
}

function DeleteButton({ pending }: { pending: boolean }) {
  
  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}

export default function DeleteDialog({ action, title, description, id }: Props) {
  const [open, setOpen] = React.useState(false);
  const { pending } = useFormStatus();
  // Create a wrapped action for the form
  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        let result;
        if (id) {
          // For server action that expects a userId string
          result = await (action as (userId: string) => Promise<any>)(id);
        } else {
          // For actions expecting FormData (form submissions)
          const formData = new FormData(e.target as HTMLFormElement);
          result = await (action as (formData: FormData) => Promise<any>)(formData);
        }

        if (result.success) {
          toast.success('Item deleted successfully');
          setOpen(false);
        } else {
          toast.error(result.error || 'Failed to delete item');
        }
      } catch (error) {
        console.error("Error during deletion:", error);
        toast.error('An unexpected error occurred');
      }
    },
    [action, id]
  );
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <IconTrash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {id && <input type="hidden" name="id" value={id} />}
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <DeleteButton pending={pending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
