import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { User } from '../types'
import { useUpdateUserMutation } from '../usersApi'
import { getUserRole, getUserStatus, splitName } from '../utils'
import UserAvatar from './UserAvatar'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(1, 'Username is required').regex(/^\S+$/, 'No spaces allowed'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  website: z.string().optional(),
  role: z.enum(['admin', 'editor', 'viewer']),
  status: z.enum(['active', 'pending', 'suspended']),
  companyName: z.string().optional(),
  city: z.string().optional(),
  canManageUsers: z.boolean(),
  canViewReports: z.boolean(),
  canExportData: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface EditUserModalProps {
  user: User | null
  open: boolean
  onClose: () => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-[12px] text-red-500 mt-1">{message}</p>
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
      {children}
    </p>
  )
}

export default function EditUserModal({ user, open, onClose }: EditUserModalProps) {
  const [updateUser, { isLoading }] = useUpdateUserMutation()

  const { firstName: defFirst, lastName: defLast } = user ? splitName(user.name) : { firstName: '', lastName: '' }
  const defRole = user ? getUserRole(user.id) : 'viewer'
  const defStatus = user ? getUserStatus(user.id) : 'active'

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: defFirst,
      lastName: defLast,
      username: user?.username ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      website: user?.website ?? '',
      role: defRole,
      status: defStatus,
      companyName: user?.company.name ?? '',
      city: user?.address.city ?? '',
      canManageUsers: defRole === 'admin',
      canViewReports: defRole !== 'viewer',
      canExportData: defRole === 'admin',
    },
  })

  useEffect(() => {
    if (user) {
      const { firstName, lastName } = splitName(user.name)
      const role = getUserRole(user.id)
      reset({
        firstName,
        lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        role,
        status: getUserStatus(user.id),
        companyName: user.company.name,
        city: user.address.city,
        canManageUsers: role === 'admin',
        canViewReports: role !== 'viewer',
        canExportData: role === 'admin',
      })
    }
  }, [user, reset])

  const watchedFirstName = watch('firstName')
  const watchedLastName = watch('lastName')
  const previewName = [watchedFirstName, watchedLastName].filter(Boolean).join(' ') || (user?.name ?? '')

  const onSubmit = async (values: FormValues) => {
    if (!user) return
    const updatedUser: User = {
      ...user,
      name: `${values.firstName} ${values.lastName}`.trim(),
      username: values.username,
      email: values.email,
      phone: values.phone ?? user.phone,
      website: values.website ?? user.website,
      company: { ...user.company, name: values.companyName ?? user.company.name },
      address: { ...user.address, city: values.city ?? user.address.city },
    }
    try {
      await updateUser(updatedUser).unwrap()
      toast.success('User updated successfully', {
        description: `${updatedUser.name}'s profile has been saved.`,
      })
      onClose()
    } catch {
      toast.error('Failed to update user', {
        description: 'Please try again.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-[16px] font-semibold">Edit User</DialogTitle>
          <DialogDescription className="text-[13px]">
            Update {user?.name ?? 'user'}'s profile, role, and access permissions.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <form id="edit-user-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 py-5 space-y-6">
              {/* Avatar section */}
              <div className="flex items-center gap-4 rounded-xl bg-[#F8F9FA] border border-[#E9EAEC] p-4">
                <UserAvatar name={previewName} size="xl" />
                <div>
                  <p className="text-[13.5px] font-semibold text-foreground leading-snug">{previewName}</p>
                  <p className="text-[12px] text-muted-foreground mb-2.5">
                    {user?.email}
                  </p>
                  <Button type="button" variant="outline" size="sm" className="h-7 text-[12px]">
                    <Upload size={12} className="mr-1.5" />
                    Change Photo
                  </Button>
                </div>
              </div>

              {/* Personal information */}
              <div>
                <SectionTitle>Personal Information</SectionTitle>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="firstName" className="text-[13px]">First Name</Label>
                      <Input
                        id="firstName"
                        {...register('firstName')}
                        className={cn('h-9 text-[13px]', errors.firstName && 'border-red-400')}
                        placeholder="John"
                      />
                      <FieldError message={errors.firstName?.message} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="lastName" className="text-[13px]">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register('lastName')}
                        className={cn('h-9 text-[13px]', errors.lastName && 'border-red-400')}
                        placeholder="Doe"
                      />
                      <FieldError message={errors.lastName?.message} />
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="username" className="text-[13px]">Username</Label>
                    <Input
                      id="username"
                      {...register('username')}
                      className={cn('h-9 text-[13px] font-mono', errors.username && 'border-red-400')}
                      placeholder="johndoe"
                    />
                    <FieldError message={errors.username?.message} />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="email" className="text-[13px]">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={cn('h-9 text-[13px]', errors.email && 'border-red-400')}
                      placeholder="john@example.com"
                    />
                    <FieldError message={errors.email?.message} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="phone" className="text-[13px]">Phone</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        className="h-9 text-[13px]"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="website" className="text-[13px]">Website</Label>
                      <Input
                        id="website"
                        {...register('website')}
                        className="h-9 text-[13px]"
                        placeholder="example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Role & access */}
              <div>
                <SectionTitle>Role &amp; Access</SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label className="text-[13px]">Role</Label>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-9 text-[13px]">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin" className="text-[13px]">Admin</SelectItem>
                            <SelectItem value="editor" className="text-[13px]">Editor</SelectItem>
                            <SelectItem value="viewer" className="text-[13px]">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-[13px]">Status</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-9 text-[13px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active" className="text-[13px]">Active</SelectItem>
                            <SelectItem value="pending" className="text-[13px]">Pending</SelectItem>
                            <SelectItem value="suspended" className="text-[13px]">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Permissions */}
              <div>
                <SectionTitle>Permissions</SectionTitle>
                <div className="space-y-3 rounded-xl border border-[#E9EAEC] bg-[#F9FAFB] p-4">
                  {[
                    { name: 'canManageUsers' as const, label: 'Manage Users', desc: 'Create, edit, and delete users' },
                    { name: 'canViewReports' as const, label: 'View Reports', desc: 'Access analytics and audit logs' },
                    { name: 'canExportData' as const, label: 'Export Data', desc: 'Download CSV and data exports' },
                  ].map((perm) => (
                    <div key={perm.name} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{perm.label}</p>
                        <p className="text-[12px] text-muted-foreground">{perm.desc}</p>
                      </div>
                      <Controller
                        name={perm.name}
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Organisation */}
              <Separator />
              <div>
                <SectionTitle>Organisation</SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="companyName" className="text-[13px]">Team / Company</Label>
                    <Input
                      id="companyName"
                      {...register('companyName')}
                      className="h-9 text-[13px]"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="city" className="text-[13px]">City</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      className="h-9 text-[13px]"
                      placeholder="San Francisco"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-[#E9EAEC] bg-[#F9FAFB]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-9 text-[13px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-user-form"
            size="sm"
            disabled={isLoading || !isDirty}
            className="h-9 text-[13px] min-w-[110px]"
          >
            {isLoading ? (
              <>
                <Loader2 size={13} className="mr-1.5 animate-spin" />
                Saving…
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
