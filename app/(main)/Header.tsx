'use client'

import React from 'react'

import { clsxm } from '@zolplay/utils'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion'
import { signIn, signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

import { NavigationBar } from '~/app/(main)/NavigationBar'
import { ThemeSwitcher } from '~/app/(main)/ThemeSwitcher'
import {
  GitHubBrandIcon,
  GoogleBrandIcon,
  MailIcon,
  UserArrowLeftIcon,
} from '~/assets'
import { Avatar } from '~/components/Avatar'
import { Container } from '~/components/ui/Container'
import { Tooltip } from '~/components/ui/Tooltip'
import { clamp } from '~/lib/math'

// Extend the Session user type to include provider
declare module 'next-auth' {
  interface User {
    provider?: string
  }
}

export function Header() {
  const isHomePage = usePathname() === '/'

  const headerRef = React.useRef<HTMLDivElement>(null)
  const avatarRef = React.useRef<HTMLDivElement>(null)
  const isInitial = React.useRef(true)

  const avatarX = useMotionValue(0)
  const avatarScale = useMotionValue(1)
  const avatarBorderX = useMotionValue(0)
  const avatarBorderScale = useMotionValue(1)

  React.useEffect(() => {
    const downDelay = avatarRef.current?.offsetTop ?? 0
    const upDelay = 64

    function setProperty(property: string, value: string | null) {
      document.documentElement.style.setProperty(property, value)
    }

    function removeProperty(property: string) {
      document.documentElement.style.removeProperty(property)
    }

    function updateHeaderStyles() {
      if (!headerRef.current) {
        return
      }

      const { top, height } = headerRef.current.getBoundingClientRect()
      const scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight
      )

      if (isInitial.current) {
        setProperty('--header-position', 'sticky')
      }

      setProperty('--content-offset', `${downDelay}px`)

      if (isInitial.current || scrollY < downDelay) {
        setProperty('--header-height', `${downDelay + height}px`)
        setProperty('--header-mb', `${-downDelay}px`)
      } else if (top + height < -upDelay) {
        const offset = Math.max(height, scrollY - upDelay)
        setProperty('--header-height', `${offset}px`)
        setProperty('--header-mb', `${height - offset}px`)
      } else if (top === 0) {
        setProperty('--header-height', `${scrollY + height}px`)
        setProperty('--header-mb', `${-scrollY}px`)
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed')
        removeProperty('--header-top')
        removeProperty('--avatar-top')
      } else {
        removeProperty('--header-inner-position')
        setProperty('--header-top', '0px')
        setProperty('--avatar-top', '0px')
      }
    }

    function updateAvatarStyles() {
      if (!isHomePage) {
        return
      }

      const fromScale = 1
      const toScale = 36 / 64
      const fromX = 0
      const toX = 2 / 16

      const scrollY = downDelay - window.scrollY

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale
      scale = clamp(scale, fromScale, toScale)

      let x = (scrollY * (fromX - toX)) / downDelay + toX
      x = clamp(x, fromX, toX)

      avatarX.set(x)
      avatarScale.set(scale)

      const borderScale = 1 / (toScale / scale)

      avatarBorderX.set((-toX + x) * borderScale)
      avatarBorderScale.set(borderScale)

      setProperty('--avatar-border-opacity', scale === toScale ? '1' : '0')
    }

    function updateStyles() {
      updateHeaderStyles()
      updateAvatarStyles()
      isInitial.current = false
    }

    updateStyles()
    window.addEventListener('scroll', updateStyles, { passive: true })
    window.addEventListener('resize', updateStyles)

    return () => {
      window.removeEventListener('scroll', updateStyles)
      window.removeEventListener('resize', updateStyles)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHomePage])

  const avatarTransform = useMotionTemplate`translate3d(${avatarX}rem, 0, 0) scale(${avatarScale})`
  const avatarBorderTransform = useMotionTemplate`translate3d(${avatarBorderX}rem, 0, 0) scale(${avatarBorderScale})`

  const [isShowingAltAvatar, setIsShowingAltAvatar] = React.useState(false)
  const onAvatarContextMenu = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsShowingAltAvatar((prev) => !prev)
    },
    []
  )

  return (
    <>
      <motion.header
        className={clsxm(
          'pointer-events-none relative z-50 mb-[var(--header-mb,0px)] flex flex-col',
          isHomePage
            ? 'h-[var(--header-height,180px)]'
            : 'h-[var(--header-height,64px)]'
        )}
        layout
        layoutRoot
      >
        <AnimatePresence>
          {isHomePage && (
            <>
              <div
                ref={avatarRef}
                className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
              />
              <Container
                className="top-0 order-last -mb-3 pt-3"
                style={{
                  position:
                    'var(--header-position)' as React.CSSProperties['position'],
                }}
              >
                <motion.div
                  className="top-[var(--avatar-top,theme(spacing.3))] w-full select-none"
                  style={{
                    position:
                      'var(--header-inner-position)' as React.CSSProperties['position'],
                  }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 200,
                  }}
                >
                  <motion.div
                    className="relative inline-flex"
                    layoutId="avatar"
                    layout
                    onContextMenu={onAvatarContextMenu}
                  >
                    <motion.div
                      className="absolute left-0 top-3 origin-left opacity-[var(--avatar-border-opacity,0)] transition-opacity"
                      style={{
                        transform: avatarBorderTransform,
                      }}
                    >
                      <Avatar />
                    </motion.div>

                    <motion.div
                      className="block h-16 w-16 origin-left"
                      style={{
                        transform: avatarTransform,
                      }}
                    >
                      <Avatar.Image
                        large
                        alt={isShowingAltAvatar}
                        className="block h-full w-full"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Container>
            </>
          )}
        </AnimatePresence>
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{
            position:
              'var(--header-position)' as React.CSSProperties['position'],
          }}
        >
          <Container
            className="top-[var(--header-top,theme(spacing.6))] w-full"
            style={{
              position:
                'var(--header-inner-position)' as React.CSSProperties['position'],
            }}
          >
            <div className="relative flex gap-4">
              <motion.div
                className="flex flex-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 200,
                }}
              >
                <AnimatePresence>
                  {!isHomePage && (
                    <motion.div
                      layoutId="avatar"
                      layout
                      onContextMenu={onAvatarContextMenu}
                    >
                      <Avatar>
                        <Avatar.Image alt={isShowingAltAvatar} />
                      </Avatar>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <div className="flex flex-1 justify-end md:justify-center">
                <NavigationBar.Mobile className="pointer-events-auto relative z-50 md:hidden" />
                <NavigationBar.Desktop className="pointer-events-auto relative z-50 hidden md:block" />
              </div>
              <motion.div
                className="flex justify-end gap-3 md:flex-1"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
                <UserInfo />
                <div className="pointer-events-auto">
                  <ThemeSwitcher />
                </div>
              </motion.div>
            </div>
          </Container>
        </div>
      </motion.header>
      {isHomePage && <div className="h-[--content-offset]" />}
    </>
  )
}

function UserInfo() {
  const [tooltipOpen, setTooltipOpen] = React.useState(false)
  const { data: session, status } = useSession()

  const StrategyIcon = React.useMemo(() => {
    if (!session?.user?.provider) return null

    switch (session.user.provider) {
      case 'github':
        return GitHubBrandIcon
      case 'google':
        return GoogleBrandIcon
      default:
        return MailIcon
    }
  }, [session?.user?.provider])

  return (
    <AnimatePresence>
      {status === 'authenticated' ? (
        <motion.div
          className="pointer-events-auto relative flex h-10 items-center"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 25 }}
        >
          <button
            onClick={() => signOut()}
            className="flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-white/20"
          >
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {session.user.name?.[0] || 'U'}
              </span>
            )}
          </button>
          {StrategyIcon && (
            <span className="pointer-events-none absolute -bottom-1 -right-1 flex h-4 w-4 select-none items-center justify-center rounded-full bg-white dark:bg-zinc-900">
              <StrategyIcon className="h-3 w-3" />
            </span>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="pointer-events-auto"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 25 }}
        >
          <Tooltip.Provider disableHoverableContent>
            <Tooltip.Root open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <Tooltip.Trigger asChild>
                <button
                  type="button"
                  className="group h-10 rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 text-sm shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
                  onClick={() => signIn()}
                >
                  <UserArrowLeftIcon className="h-5 w-5" />
                </button>
              </Tooltip.Trigger>

              <AnimatePresence>
                {tooltipOpen && (
                  <Tooltip.Portal forceMount>
                    <Tooltip.Content asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        Sign In
                      </motion.div>
                    </Tooltip.Content>
                  </Tooltip.Portal>
                )}
              </AnimatePresence>
            </Tooltip.Root>
          </Tooltip.Provider>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
