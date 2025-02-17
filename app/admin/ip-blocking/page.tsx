import { get } from '@vercel/edge-config'
import { revalidatePath } from 'next/cache'

import { Container } from '~/components/ui/Container'

export default async function IPBlockingPage() {
  const blockedIPs = (await get<string[]>('blocked_ips')) || []

  async function addIP(formData: FormData) {
    'use server'
    const ip = formData.get('ip') as string
    if (!ip) return

    const currentIPs = (await get<string[]>('blocked_ips')) || []
    if (currentIPs.includes(ip)) return

    await fetch(process.env.EDGE_CONFIG_ITEMS_URL!, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.EDGE_CONFIG_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            operation: 'update',
            key: 'blocked_ips',
            value: [...currentIPs, ip],
          },
        ],
      }),
    })

    revalidatePath('/admin/ip-blocking')
  }

  async function removeIP(ip: string) {
    'use server'
    const currentIPs = (await get<string[]>('blocked_ips')) || []

    await fetch(process.env.EDGE_CONFIG_ITEMS_URL!, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.EDGE_CONFIG_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            operation: 'update',
            key: 'blocked_ips',
            value: currentIPs.filter((blockedIP) => blockedIP !== ip),
          },
        ],
      }),
    })

    revalidatePath('/admin/ip-blocking')
  }

  return (
    <Container>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">IP Blocking Management</h1>

        <form action={addIP} className="flex gap-4">
          <input
            type="text"
            name="ip"
            placeholder="Enter IP address"
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 dark:border-zinc-800"
            pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
            required
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Block IP
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Blocked IPs</h2>
          {blockedIPs.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400">No IPs blocked</p>
          ) : (
            <ul className="space-y-2">
              {blockedIPs.map((ip) => (
                <li
                  key={ip}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-2 dark:border-zinc-800"
                >
                  <span>{ip}</span>
                  <form action={removeIP.bind(null, ip)}>
                    <button
                      type="submit"
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Container>
  )
}
