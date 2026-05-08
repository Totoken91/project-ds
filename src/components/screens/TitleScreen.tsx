import { motion } from 'framer-motion'

export function TitleScreen() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex min-h-screen flex-col items-center justify-center gap-12 bg-zinc-950 px-6 text-center text-zinc-100"
    >
      <div className="flex flex-col items-center gap-4">
        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.4em' }}
          animate={{ opacity: 1, letterSpacing: '0.08em' }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="font-display text-6xl tracking-wide text-zinc-50 sm:text-7xl md:text-8xl"
        >
          Tokimemo Proto
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-md text-sm text-zinc-400 sm:text-base"
        >
          A dating sim. You have 36 weeks.
          <br />
          Don&apos;t fuck it up.
        </motion.p>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        className="rounded-sm border border-zinc-700 bg-zinc-900/60 px-10 py-3 text-sm uppercase tracking-[0.3em] text-zinc-200 transition-colors hover:border-zinc-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
      >
        New Game
      </motion.button>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-6 text-xs uppercase tracking-[0.3em] text-zinc-500"
      >
        M0 — project setup
      </motion.span>
    </motion.main>
  )
}
