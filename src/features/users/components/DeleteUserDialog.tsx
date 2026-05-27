import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import type { User } from '../types'
import { useDeleteUserMutation } from '../usersApi'

interface DeleteUserDialogProps {
  user: User | null
  open: boolean
  onClose: () => void
}

export default function DeleteUserDialog({ user, open, onClose }: DeleteUserDialogProps) {
  const [deleteUser, { isLoading }] = useDeleteUserMutation()

  const handleDelete = async () => {
    if (!user) return
    try {
      await deleteUser(user.id).unwrap()
      toast.success('User deleted', {
        description: `${user.name} has been removed from the system.`,
      })
      onClose()
    } catch {
      toast.error('Failed to delete user', { description: 'Please try again.' })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[15px]">Delete user?</AlertDialogTitle>
          <AlertDialogDescription className="text-[13px]">
            This will permanently delete{' '}
            <span className="font-semibold text-foreground">{user?.name}</span> and remove all of
            their data. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-9 text-[13px]">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="h-9 text-[13px] bg-red-600 hover:bg-red-700 text-white min-w-[90px]"
          >
            {isLoading ? (
              <>
                <Loader2 size={13} className="mr-1.5 animate-spin" />
                Deleting…
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
