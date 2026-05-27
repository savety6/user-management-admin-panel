import { ArrowRight, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function V1EmptyState() {
  return (
    <div className="v1-empty-state flex min-h-full items-center justify-center px-6 py-10">
      <Card className="v1-card w-full max-w-xl border-0 shadow-none">
        <CardHeader className="space-y-3">
          <Badge variant="secondary" className="v1-badge w-fit">
            Version v1
          </Badge>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-semibold tracking-tight">
              `v1` is ready for its own UI
            </CardTitle>
            <CardDescription className="max-w-lg text-sm leading-6">
              This route is intentionally empty for now. The versioned app shell and styles are in
              place so you can build a separate admin experience here later without affecting `/`
              or `/v0`.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers3 className="size-4" />
          <span>Start implementing new layouts, components, and tokens under `src/versions/v1`.</span>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <span className="text-xs text-muted-foreground">Root and `v0` keep the current admin panel.</span>
          <Button asChild className="v1-cta">
            <Link to="/v0/users">
              Open current UI
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
