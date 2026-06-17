import { createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog.tsx'

export const Route = createFileRoute('/')({ component: Home })

const callbackUri =
  import.meta.env.VITE_GID_CALLBACK_URI ||
  `${window.location.origin}${import.meta.env.BASE_URL}auth/callback`

const signInUrl = new URL('https://staging.gid.giantcycling.com/oauth/sign-in/')

signInUrl.search = new URLSearchParams({
  client_id: '2arj0uljj696sqjff07eadspef',
  callback_uri: callbackUri,
}).toString()

function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent className="grid h-[min(760px,calc(100vh-2rem))] max-w-[min(960px,calc(100%-2rem))] grid-rows-[auto_minmax(0,1fr)] gap-3 p-3">
          <DialogTitle className="pr-10">Giant ID sign in</DialogTitle>
          <iframe
            className="h-full min-h-0 w-full rounded-lg border"
            src={signInUrl.toString()}
            title="Giant ID sign in"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
