import { auth, signIn } from '~/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { Container } from '~/components/ui/Container'

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect('/')
  }

  return (
    <Container className="mt-24 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Sign in to continue
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Use your Google account to sign in
          </p>
        </div>

        <form
          action={async () => {
            'use server'
            await signIn('google', { redirectTo: '/admin' })
          }}
        >
          <button
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            type="submit"
          >
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </Container>
  )
}
