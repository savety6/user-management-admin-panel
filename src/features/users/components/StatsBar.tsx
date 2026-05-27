import { Users, UserCheck, Clock, UserX } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { User } from '../types'
import { getUserStatus } from '../utils'

interface StatsBarProps {
  users: User[]
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ElementType
  iconColor: string
  iconBg: string
  trend?: string
}

function StatCard({ label, value, icon: Icon, iconColor, iconBg }: StatCardProps) {
  return (
    <Card className="shadow-none border border-[#E9EAEC]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          </div>
          <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon size={16} className={iconColor} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StatsBar({ users }: StatsBarProps) {
  const active = users.filter((u) => getUserStatus(u.id) === 'active').length
  const pending = users.filter((u) => getUserStatus(u.id) === 'pending').length
  const suspended = users.filter((u) => getUserStatus(u.id) === 'suspended').length

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        label="Total Users"
        value={users.length}
        icon={Users}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
      />
      <StatCard
        label="Active"
        value={active}
        icon={UserCheck}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      />
      <StatCard
        label="Pending"
        value={pending}
        icon={Clock}
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
      />
      <StatCard
        label="Suspended"
        value={suspended}
        icon={UserX}
        iconBg="bg-red-50"
        iconColor="text-red-600"
      />
    </div>
  )
}
