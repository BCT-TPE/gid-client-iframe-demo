import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'

export const Route = createFileRoute('/auth/callback/')({
  component: AuthCallback,
})

const tokenEndpoint =
  import.meta.env.VITE_GID_TOKEN_ENDPOINT ||
  'https://staging-api.gid.giantcycling.com/v1/user-token'
const userTokenApiKey = '5zmMaCJTFpa2VfvSV5uoI1rcsFDNZaXoHzAmM7F9'
const authSessionStorageKey = 'gid-auth-token'
const authReturnStepStorageKey = 'gid-auth-return-step'
const appHomeUrl = new URL(import.meta.env.BASE_URL, window.location.origin)

function AuthCallback() {
  const code = useMemo(() => {
    const params = new URLSearchParams(window.location.search)

    return params.get('code')
  }, [])

  useEffect(() => {
    if (!code) {
      return
    }

    const abortController = new AbortController()
    const codeValue = code

    async function exchangeCodeForToken() {
      const tokenExchangeUrl = new URL(tokenEndpoint)

      tokenExchangeUrl.searchParams.set('code', codeValue)

      try {
        const response = await fetch(tokenExchangeUrl, {
          method: 'GET',
          headers: {
            'x-api-key': userTokenApiKey,
          },
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
          console.error('Giant ID token exchange failed', responseBody)
          return
        }

        if (window.parent !== window) {
          window.parent.postMessage(
            {
              type: 'gid-auth-success',
              token: responseBody,
            },
            window.location.origin,
          )
          return
        }

        window.sessionStorage.setItem(
          authSessionStorageKey,
          JSON.stringify(responseBody),
        )
        window.sessionStorage.setItem(authReturnStepStorageKey, '3')
        window.location.replace(appHomeUrl)
      } catch (error) {
        if (abortController.signal.aborted) {
          return
        }

        console.error('Giant ID token exchange failed', error)
      }
    }

    void exchangeCodeForToken()

    return () => {
      abortController.abort()
    }
  }, [code])

  return null
}
