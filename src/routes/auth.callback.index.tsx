import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/callback/')({
  component: AuthCallback,
})

function AuthCallback() {
  return <div>AUTH CALLBACK</div>
}
