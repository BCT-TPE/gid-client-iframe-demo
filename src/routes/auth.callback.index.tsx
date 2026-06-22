import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/auth/callback/')({
  component: AuthCallback,
})

const clientId =
  import.meta.env.VITE_GID_CLIENT_ID || '3tddp22horis0i6p5ippfrh57m'
const tokenEndpoint =
  import.meta.env.VITE_GID_TOKEN_ENDPOINT ||
  'https://giant-id-staging-auth.gid.giantcycling.com/oauth2/token'
const redirectUri =
  import.meta.env.VITE_GID_CALLBACK_URI ||
  `${window.location.origin}${import.meta.env.BASE_URL}auth/callback`

type TokenExchangeState =
  | { status: 'idle'; data?: undefined; error?: undefined }
  | { status: 'loading'; data?: undefined; error?: undefined }
  | { status: 'success'; data: unknown; error?: undefined }
  | { status: 'error'; data?: undefined; error: string }

function AuthCallback() {
  const { code, state } = useMemo(() => {
    const params = new URLSearchParams(window.location.search)

    return {
      code: params.get('code'),
      state: params.get('state'),
    }
  }, [])
  const [tokenExchange, setTokenExchange] = useState<TokenExchangeState>({
    status: 'idle',
  })

  useEffect(() => {
    if (!code) {
      return
    }

    const abortController = new AbortController()
    const codeValue = code

    async function exchangeCodeForToken() {
      setTokenExchange({ status: 'loading' })

      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code: codeValue,
        redirect_uri: redirectUri,
      })

      try {
        const response = await fetch(tokenEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
          signal: abortController.signal,
        })
        const responseText = await response.text()
        let responseBody: unknown = responseText

        try {
          responseBody = JSON.parse(responseText)
        } catch {
          // Keep non-JSON responses visible for debugging OAuth errors.
        }

        if (!response.ok) {
          setTokenExchange({
            status: 'error',
            error: JSON.stringify(responseBody, null, 2),
          })
          return
        }

        setTokenExchange({ status: 'success', data: responseBody })
      } catch (error) {
        if (abortController.signal.aborted) {
          return
        }

        setTokenExchange({
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    void exchangeCodeForToken()

    return () => {
      abortController.abort()
    }
  }, [code])

  const tokenExchangeResult = useMemo(() => {
    if (tokenExchange.status === 'success') {
      return JSON.stringify(tokenExchange.data, null, 2)
    }

    if (tokenExchange.status === 'error') {
      return tokenExchange.error
    }

    if (tokenExchange.status === 'loading') {
      return 'Exchanging authorization code for tokens...'
    }

    return code ? 'Waiting to exchange code.' : 'No code received.'
  }, [code, tokenExchange])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex w-full max-w-2xl flex-col gap-2">
        <h1 className="text-xl font-semibold">AUTH CALLBACK</h1>
        <p className="text-sm text-muted-foreground">
          Giant ID redirected back to this callback page.
        </p>
      </div>

      <section className="flex w-full max-w-2xl flex-col gap-3 rounded-lg border bg-card p-4 text-left text-card-foreground">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">Authorization code</h2>
          <pre className="min-h-12 overflow-auto rounded-md bg-muted p-3 text-xs break-all whitespace-pre-wrap">
            {code || 'No code received.'}
          </pre>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">State</h2>
          <pre className="min-h-12 overflow-auto rounded-md bg-muted p-3 text-xs break-all whitespace-pre-wrap">
            {state || 'No state received.'}
          </pre>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">Token endpoint</h2>
          <pre className="min-h-12 overflow-auto rounded-md bg-muted p-3 text-xs break-all whitespace-pre-wrap">
            {tokenEndpoint}
          </pre>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">Redirect URI</h2>
          <pre className="min-h-12 overflow-auto rounded-md bg-muted p-3 text-xs break-all whitespace-pre-wrap">
            {redirectUri}
          </pre>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">Token exchange result</h2>
          <pre className="max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs break-all whitespace-pre-wrap">
            {tokenExchangeResult}
          </pre>
        </div>
      </section>
    </main>
  )
}
