import { useCallback, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  CheckIcon,
  ChevronRightIcon,
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
} from 'lucide-react'

import { Button } from '#/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog.tsx'
import { cn } from '#/lib/utils.ts'

export const Route = createFileRoute('/')({ component: Home })

const prototypeAssetBase =
  'https://ycc-bct.github.io/giant-us-registration-prototype/assets'

const callbackUri =
  import.meta.env.VITE_GID_CALLBACK_URI ||
  `${window.location.origin}${import.meta.env.BASE_URL}auth/callback`

const clientId =
  import.meta.env.VITE_GID_CLIENT_ID || '2arj0uljj696sqjff07eadspef'
const signInUrl = new URL(
  'https://giant-id-staging.auth.ap-northeast-1.amazoncognito.com/login',
)

signInUrl.search = new URLSearchParams({
  client_id: clientId,
  response_type: 'code',
  redirect_uri: callbackUri,
}).toString()

const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(
  window.location.hostname,
)

const iframeAllow =
  import.meta.env.DEV || isLocalhost ? 'local-network-access' : undefined

const decodeUrlForDisplay = (url: string) => {
  try {
    return decodeURIComponent(url)
  } catch {
    return url
  }
}

const states = [
  'Select state',
  'Alabama',
  'California',
  'Florida',
  'New York',
  'Oregon',
  'Washington',
]

const steps = [
  'Confirm Your Frame Number',
  'Address & Contact info',
  'Point of purchase',
  'Purchase date',
  'Confirmation',
]

function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeUrl, setIframeUrl] = useState(signInUrl.toString())
  const [activeStep, setActiveStep] = useState(1)
  const [proposal, setProposal] = useState<'A' | 'B'>('A')
  const [showContactForm, setShowContactForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const displayIframeUrl = decodeUrlForDisplay(iframeUrl)

  const handleIframeLoad = useCallback(() => {
    try {
      const nextUrl = iframeRef.current?.contentWindow?.location.href

      if (nextUrl) {
        setIframeUrl(nextUrl)
      }
    } catch {
      setIframeUrl(iframeRef.current?.src || signInUrl.toString())
    }
  }, [])

  const goToStep = (step: number) => {
    setActiveStep(Math.min(Math.max(step, 1), steps.length))
  }

  return (
    <main className="min-h-screen bg-white text-[#333333]">
      <div className="bg-[#111111] px-4 py-2.5 text-center text-[13px] tracking-wide text-white">
        June Promo: Buy any Gavia Course Tires and get FREE Eco Bar Tape{' '}
        <a className="font-bold underline underline-offset-2" href="#">
          Shop Now
        </a>
      </div>

      <header className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-[#e2e2e2] px-4 py-3 md:px-7">
        <div className="flex items-center gap-6">
          <button
            aria-label="Open menu"
            className="inline-flex text-[#06038d]"
            type="button"
          >
            <MenuIcon />
          </button>
          <nav className="hidden items-center gap-5 text-[15px] font-semibold text-[#333333] md:flex">
            <a href="#">Bikes</a>
            <a href="#">Gear</a>
            <a href="#">Discover Cycling</a>
            <a href="#">Clearance Sale</a>
            <a href="#">Stores</a>
          </nav>
        </div>

        <div className="text-[26px] font-black tracking-[-0.05em] text-[#06038d] italic">
          GIANT
        </div>

        <div className="flex items-center justify-end gap-4 text-[#06038d]">
          <button
            className="hidden items-center gap-2 rounded-full border border-[#e2e2e2] px-4 py-2 text-xs text-[#777777] transition-colors hover:border-[#06038d] hover:text-[#06038d] sm:flex"
            type="button"
          >
            <SearchIcon />
            SEARCH
          </button>
          <button aria-label="Account" className="inline-flex" type="button">
            <UserIcon />
          </button>
          <button aria-label="Cart" className="inline-flex" type="button">
            <ShoppingCartIcon />
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#1a1d22]">
        <picture>
          <source
            media="(max-width: 760px)"
            srcSet={`${prototypeAssetBase}/banner_mobile.jpg`}
          />
          <img
            alt="Giant road bike on a mountain road"
            className="h-auto w-full"
            src={`${prototypeAssetBase}/banner_desktop.jpg`}
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55" />
        <h1 className="absolute right-0 bottom-[7%] left-0 z-10 text-center text-[28px] font-black tracking-[0.08em] text-white uppercase drop-shadow-lg md:text-[46px]">
          Product Registration
        </h1>
      </section>

      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-10 md:grid-cols-[minmax(0,1fr)_360px] md:px-7 md:py-12">
        <section>
          <p className="mb-8 text-[15px] leading-7 text-[#444444]">
            Congratulations on your new bike. We're sure you can't wait to take
            it out for a spin, but before you do we highly recommend that you
            register it by completing the registration form. By doing so, you
            will help make it easier for us, or one of our licensed dealers, to
            service any warranty claim you might have.
          </p>

          <RegistrationStep activeStep={activeStep} index={1} title={steps[0]}>
            <div className="mb-4 rounded bg-[#f8d7da] px-3.5 py-3 text-sm text-[#a33]">
              The serial number you entered could not be found. Please try
              again.
            </div>
            <p className="mb-4 text-sm leading-6 text-[#555555]">
              Please enter/confirm your frame number. If you are unsure where to
              find your frame number, please reference the illustrations for the
              location on your bike model.
            </p>
            <div className="flex max-w-xl items-stretch">
              <input
                className="min-w-0 flex-1 rounded-l border border-r-0 border-[#bbbbbb] px-3 py-3 text-[15px] outline-none focus:border-[#06038d]"
                placeholder="Enter frame number"
                type="text"
              />
              <button
                className="inline-flex items-center gap-1 rounded-r bg-[#06038d] px-6 py-3 font-bold text-white transition-colors hover:bg-[#04026b]"
                onClick={() => goToStep(2)}
                type="button"
              >
                Proceed
                <ChevronRightIcon />
              </button>
            </div>
            <label className="mt-4 flex max-w-lg items-start gap-2 text-sm text-[#555555]">
              <input className="mt-1" type="checkbox" />
              <span>Enter the key number (e-bike battery lock)</span>
            </label>
          </RegistrationStep>

          <RegistrationStep
            activeStep={activeStep}
            headerExtra={
              showContactForm ? (
                <GiantIdDialog
                  displayIframeUrl={displayIframeUrl}
                  handleIframeLoad={handleIframeLoad}
                  iframeRef={iframeRef}
                  variant="link"
                >
                  <span className="text-[#333333]">
                    Already have a Giant ID?{' '}
                    <span className="font-semibold text-[#06038d]">
                      Log in instead
                    </span>
                  </span>
                </GiantIdDialog>
              ) : undefined
            }
            index={2}
            title={steps[1]}
          >
            {!showContactForm && proposal === 'A' ? (
              <div className="mb-6 max-w-[460px]">
                <div className="rounded-xl border border-[#e2e2e2] bg-white p-5">
                  <h3 className="mb-2 text-lg font-extrabold text-[#111111]">
                    Save your registration
                  </h3>
                  <p className="mb-4 text-sm leading-6 text-[#58626e]">
                    Sign in or create a free Giant ID — one account across
                    Giant, Liv, Momentum & CADEX.
                  </p>
                  <ul className="mb-4 grid grid-cols-2 gap-x-5 gap-y-2 rounded-lg bg-[#06038d]/5 p-3 text-[13px] text-[#444444]">
                    {[
                      'Track & warranty',
                      'Faster next time',
                      'Online claims',
                      'Saved details',
                    ].map((benefit) => (
                      <li className="flex items-start gap-2" key={benefit}>
                        <CheckIcon className="mt-0.5 text-[#06038d]" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <GiantIdDialog
                    displayIframeUrl={displayIframeUrl}
                    handleIframeLoad={handleIframeLoad}
                    iframeRef={iframeRef}
                  >
                    Sign in or create account
                  </GiantIdDialog>
                </div>
                <p className="mt-3 text-center text-sm text-[#58626e]">
                  Prefer not to create an account?{' '}
                  <button
                    className="underline underline-offset-2"
                    onClick={() => setShowContactForm(true)}
                    type="button"
                  >
                    Continue as a guest
                  </button>
                </p>
              </div>
            ) : null}

            {!showContactForm && proposal === 'B' ? (
              <div className="mb-6 grid max-w-[680px] grid-cols-1 gap-[18px] sm:grid-cols-2">
                <div className="flex flex-col rounded-xl border border-[#06038d]/20 bg-white p-5">
                  <h3 className="mb-2 text-lg font-extrabold text-[#111111]">
                    Giant ID
                  </h3>
                  <p className="mb-4 text-sm leading-6 text-[#58626e]">
                    Log in to your account, or create one to manage your
                    registrations.
                  </p>
                  <ul className="mb-4 flex flex-col gap-2 rounded-lg bg-[#06038d]/5 p-3 text-[13px] text-[#444444]">
                    {[
                      'Track your registrations and warranty',
                      'Faster registration next time',
                      'One account across Giant, Liv, Momentum and CADEX',
                    ].map((benefit) => (
                      <li className="flex items-start gap-2" key={benefit}>
                        <CheckIcon className="mt-0.5 text-[#06038d]" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <GiantIdDialog
                      displayIframeUrl={displayIframeUrl}
                      handleIframeLoad={handleIframeLoad}
                      iframeRef={iframeRef}
                    >
                      Log in
                    </GiantIdDialog>
                  </div>
                </div>
                <div className="flex flex-col rounded-xl border border-[#e2e2e2] bg-white p-5">
                  <h3 className="mb-2 text-lg font-extrabold text-[#111111]">
                    New customer
                  </h3>
                  <p className="mb-4 text-sm leading-6 text-[#58626e]">
                    Register your product as a guest — no account needed.
                  </p>
                  <button
                    className="mt-auto inline-flex min-h-10 w-fit items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#222222]"
                    onClick={() => setShowContactForm(true)}
                    type="button"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : null}

            {showContactForm ? (
              <>
                <div className="mb-5">
                  <span className="mb-2 block text-sm font-bold text-[#333333]">
                    Title
                  </span>
                  <div className="flex flex-wrap gap-5 text-sm text-[#333333]">
                    {['None', 'Mr.', 'Mrs.'].map((title) => (
                      <label className="flex items-center gap-2" key={title}>
                        <input
                          defaultChecked={title === 'None'}
                          name="title"
                          type="radio"
                        />
                        <span>{title}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid max-w-[440px] grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextField label="First name *" />
                  <TextField label="Last name *" />
                </div>
                <TextField label="Street *" />
                <div className="mt-3 grid max-w-[440px] grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextField label="Zipcode *" />
                  <TextField label="City *" />
                </div>
                <FormLabel label="State *" />
                <select className="registration-input">
                  {states.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
                <TextField label="Phone number *" type="tel" />
                <TextField label="Email address *" type="email" />
                <div className="mt-6">
                  <button
                    className="inline-flex items-center justify-center gap-1 rounded bg-[#06038d] px-5 py-2.5 text-[15px] font-bold text-white transition-colors hover:bg-[#04026b]"
                    onClick={() => goToStep(3)}
                    type="button"
                  >
                    Proceed
                    <ChevronRightIcon />
                  </button>
                </div>
              </>
            ) : null}
          </RegistrationStep>

          <RegistrationStep activeStep={activeStep} index={3} title={steps[2]}>
            <p className="mb-4 text-sm text-[#555555]">
              Where did you buy your bike?
            </p>
            <RadioRow
              defaultChecked
              label="Yes, that is correct — I bought it from a Giant authorized retailer."
              name="purchase"
            />
            <RadioRow
              label="No, I got the bike somewhere else."
              name="purchase"
            />
            <FormLabel label="Select the retailer where you bought the product" />
            <input className="registration-input" placeholder="Search" />
            <FormLabel label="Please describe where you bought it" />
            <input className="registration-input" type="text" />
            <StepButtons
              onBack={() => goToStep(2)}
              onProceed={() => goToStep(4)}
            />
          </RegistrationStep>

          <RegistrationStep activeStep={activeStep} index={4} title={steps[3]}>
            <p className="mb-4 text-sm text-[#555555]">
              Please select your purchase date.
            </p>
            <TextField label="Purchase date" type="date" />
            <TextField label="Proof of purchase (optional)" type="text" />
            <StepButtons
              onBack={() => goToStep(3)}
              onProceed={() => goToStep(5)}
            />
          </RegistrationStep>

          <RegistrationStep activeStep={activeStep} index={5} title={steps[4]}>
            <label className="flex items-start gap-2 text-sm text-[#555555]">
              <input className="mt-1" type="checkbox" />
              <span>I have read and agree to the privacy policy.</span>
            </label>
            <div className="mt-4 flex max-w-[300px] items-center gap-3 rounded border border-[#d3d3d3] px-3.5 py-3 text-sm text-[#555555]">
              <input type="checkbox" />
              <span>I'm not a robot</span>
              <span className="ml-auto text-xs text-[#777777]">reCAPTCHA</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => goToStep(4)}
                type="button"
                variant="outline"
              >
                Back
              </Button>
              <Button onClick={() => setSubmitted(true)} type="button">
                Submit your registration
              </Button>
            </div>
            {submitted && (
              <div className="mt-5 rounded-lg bg-[#e8f5e9] px-5 py-4 font-semibold text-[#2e7d32]">
                Thank you for submitting your registration.
              </div>
            )}
          </RegistrationStep>
        </section>

        <aside className="hidden md:block">
          <div className="sticky top-6 flex flex-col gap-5">
            <img
              alt="Road bike frame number (F/N) location"
              className="w-full bg-white"
              src={`${prototypeAssetBase}/bike_road.jpg`}
            />
            <img
              alt="E-bike frame number (F/N) location"
              className="w-full bg-white"
              src={`${prototypeAssetBase}/bike_ebike.jpg`}
            />
          </div>
        </aside>
      </div>

      <footer className="mt-12 bg-[#06038d] text-white">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-12 md:grid-cols-[repeat(3,1fr)_1.3fr] md:px-7">
          <FooterColumn
            links={[
              'News',
              'Events',
              'Technology',
              'Teams & Riders',
              'Find a Giant Retailer',
              "Women's Bikes",
            ]}
            title="Features"
          />
          <FooterColumn
            links={[
              'Customer Support',
              'Bike Registration',
              'Product Manuals',
              'Bike Archive',
              'Warranty Policy',
              'Online Return Policy',
              'Financing',
              'Contact Us',
            ]}
            title="Support"
          />
          <FooterColumn
            links={[
              'About Giant Bicycles',
              'Advocacy',
              'Privacy policy',
              'Accessibility',
              'Recall Information',
              'Careers At Giant',
              'Terms and Conditions',
            ]}
            title="Company"
          />
          <div>
            <h4 className="mb-4 text-sm font-black tracking-wide uppercase">
              Stay in the Lead
            </h4>
            <div className="mb-2 flex max-w-xs">
              <input
                className="min-w-0 flex-1 px-3 py-3 text-sm text-[#333333]"
                aria-label="Newsletter email"
              />
              <button
                className="bg-[#d7d8ea] px-4 text-sm font-bold text-[#06038d]"
                type="button"
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs leading-5 text-[#cfd0f0]">
              * indicates a required field
            </p>
            <p className="mt-3 max-w-sm text-xs leading-5 text-[#cfd0f0]">
              I would like to sign up and learn about new products, special
              events and get riding tips sent straight to my inbox every week.
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 px-5 py-4 text-right text-sm text-[#cfd0f0] md:px-7">
          United States | GIANT
        </div>
      </footer>

      <div className="fixed right-4 bottom-4 z-[99999] flex items-center gap-2 rounded-full border border-[#d4d4d4] bg-white/95 py-1.5 pr-1.5 pl-3 shadow-[0_4px_18px_rgba(0,0,0,0.2)]">
        <span className="text-[11px] font-bold tracking-[0.04em] text-[#888888] uppercase">
          Proposal
        </span>
        {(['A', 'B'] as const).map((option) => (
          <button
            className={cn(
              'rounded-full px-3.5 py-2 text-[13px] font-bold text-[#555555] transition-colors hover:text-[#06038d]',
              proposal === option && 'bg-[#06038d] text-white hover:text-white',
            )}
            key={option}
            onClick={() => {
              setProposal(option)
              setShowContactForm(false)
            }}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </main>
  )
}

function GiantIdDialog({
  children,
  displayIframeUrl,
  handleIframeLoad,
  iframeRef,
  variant = 'button',
}: {
  children: React.ReactNode
  displayIframeUrl: string
  handleIframeLoad: () => void
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  variant?: 'button' | 'link'
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            variant === 'button'
              ? 'inline-flex min-h-10 w-fit items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#222222]'
              : 'text-sm hover:underline',
          )}
          type="button"
        >
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="grid h-[min(680px,calc(100vh-2rem))] w-[min(546px,calc(100%-2rem))] max-w-none grid-rows-[auto_auto_minmax(0,1fr)] gap-3 p-3 sm:max-w-none">
        <DialogTitle className="pr-10">Giant ID sign in</DialogTitle>
        <input
          aria-label="Current iframe URL"
          className="min-w-0 rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          readOnly
          title={displayIframeUrl}
          value={displayIframeUrl}
        />
        <iframe
          allow={iframeAllow}
          className="h-full min-h-0 w-full rounded-lg border"
          onLoad={handleIframeLoad}
          ref={iframeRef}
          src={signInUrl.toString()}
          title="Giant ID sign in"
        />
      </DialogContent>
    </Dialog>
  )
}

function RegistrationStep({
  activeStep,
  children,
  headerExtra,
  index,
  title,
}: {
  activeStep: number
  children: React.ReactNode
  headerExtra?: React.ReactNode
  index: number
  title: string
}) {
  const isActive = activeStep === index
  const isDone = activeStep > index

  return (
    <section className="border-b border-[#e2e2e2] py-5">
      <div className="flex items-center gap-3.5">
        <div
          className={cn(
            'flex size-[30px] shrink-0 items-center justify-center rounded-full border-2 text-[15px] font-bold',
            isActive
              ? 'border-black bg-black text-white'
              : 'border-[#c5c5c5] bg-white text-[#b0b0b0]',
            isDone && 'border-[#9a9a9a] text-[#9a9a9a]',
          )}
        >
          {index}
        </div>
        <h2
          className={cn(
            'text-[22px] font-bold',
            isActive ? 'text-[#111111]' : 'text-[#b0b0b0]',
            isDone && 'text-[#8f8f8f]',
          )}
        >
          {title}
        </h2>
        {isDone && <CheckIcon className="ml-auto text-[#b5b5b5]" />}
        {isActive && headerExtra ? (
          <div className="ml-auto hidden text-sm md:block">{headerExtra}</div>
        ) : null}
      </div>
      {isActive && <div className="mt-5 md:ml-11">{children}</div>}
    </section>
  )
}

function FormLabel({ label }: { label: string }) {
  return (
    <label className="mt-3.5 mb-1.5 block text-sm font-bold text-[#333333]">
      {label}
    </label>
  )
}

function TextField({ label, type = 'text' }: { label: string; type?: string }) {
  return (
    <div>
      <FormLabel label={label} />
      <input className="registration-input" type={type} />
    </div>
  )
}

function RadioRow({
  defaultChecked,
  label,
  name,
}: {
  defaultChecked?: boolean
  label: string
  name: string
}) {
  return (
    <label className="my-2 flex items-center gap-2.5 text-[15px] text-[#333333]">
      <input defaultChecked={defaultChecked} name={name} type="radio" />
      <span>{label}</span>
    </label>
  )
}

function StepButtons({
  onBack,
  onProceed,
}: {
  onBack: () => void
  onProceed: () => void
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        className="inline-flex items-center justify-center rounded border border-[#06038d] bg-white px-5 py-2.5 text-[15px] font-bold text-[#06038d] transition-colors hover:bg-[#f4f4ff]"
        onClick={onBack}
        type="button"
      >
        Back
      </button>
      <button
        className="inline-flex items-center justify-center gap-1 rounded bg-[#06038d] px-5 py-2.5 text-[15px] font-bold text-white transition-colors hover:bg-[#04026b]"
        onClick={onProceed}
        type="button"
      >
        Proceed
        <ChevronRightIcon />
      </button>
    </div>
  )
}

function FooterColumn({ links, title }: { links: string[]; title: string }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-black tracking-wide uppercase">
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link}>
            <a className="text-sm text-[#dfe0f5] hover:text-white" href="#">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
