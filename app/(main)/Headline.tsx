'use client'

import { motion } from 'framer-motion'
import Balancer from 'react-wrap-balancer'

import { SocialLink } from '~/components/links/SocialLink'

function Developer() {
  return (
    <span className="group relative">
      <span className="font-mono text-emerald-600 dark:text-emerald-400">
        &lt;
      </span>
      Full Stack Developer
      <span className="font-mono text-emerald-600 dark:text-emerald-400">
        /&gt;
      </span>
      <span className="invisible inline-flex text-zinc-300 before:content-['|'] group-hover:visible group-hover:animate-typing dark:text-zinc-500" />
    </span>
  )
}

function Designer() {
  return (
    <span className="group relative bg-black/5 p-1 dark:bg-white/5">
      <span className="pointer-events-none absolute inset-0 border border-purple-700/90 opacity-70 group-hover:border-dashed group-hover:opacity-100 dark:border-purple-400/90">
        <span className="absolute -left-[3.5px] -top-[3.5px] size-1.5 border border-purple-700 bg-zinc-50 dark:border-purple-400" />
        <span className="absolute -bottom-[3.5px] -right-[3.5px] size-1.5 border border-purple-700 bg-zinc-50 dark:border-purple-400" />
        <span className="absolute -bottom-[3.5px] -left-[3.5px] size-1.5 border border-purple-700 bg-zinc-50 dark:border-purple-400" />
        <span className="absolute -right-[3.5px] -top-[3.5px] size-1.5 border border-purple-700 bg-zinc-50 dark:border-purple-400" />
      </span>
      UI/UX Designer
    </span>
  )
}

function Innovator() {
  return (
    <span className="group inline-flex items-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="mr-1 h-4 w-4 stroke-zinc-600 transition group-hover:stroke-zinc-800 dark:stroke-zinc-400 dark:group-hover:stroke-zinc-200"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      <span>Tech Innovator</span>
    </span>
  )
}

export function Headline() {
  return (
    <div className="max-w-2xl">
      <motion.h1
        className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 100,
          duration: 0.3,
        }}
      >
        <Developer />，<Designer />，
        <span className="block h-2" />
        <Innovator />
      </motion.h1>
      <motion.p
        className="mt-6 text-base text-zinc-600 dark:text-zinc-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 85,
          duration: 0.3,
          delay: 0.1,
        }}
      >
        <Balancer>
          Hi, I&apos;m Vishu - a passionate full-stack developer and UI/UX
          designer. I create modern web applications with a focus on user
          experience and performance. Currently building innovative solutions
          that make a difference in how people interact with technology.
        </Balancer>
      </motion.p>
      <motion.div
        className="mt-6 flex gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          damping: 50,
          stiffness: 90,
          duration: 0.35,
          delay: 0.25,
        }}
      >
        <SocialLink
          href="https://x.com/vishucodes"
          aria-label="Follow on Twitter"
          platform="twitter"
        />
        <SocialLink
          href="https://github.com/01vishu"
          aria-label="Follow on GitHub"
          platform="github"
        />
        <SocialLink href="/feed.xml" platform="rss" aria-label="RSS Feed" />
        <SocialLink
          href="mailto:01vishuverma@gmail.com"
          aria-label="Send email"
          platform="mail"
        />
      </motion.div>
    </div>
  )
}
