import { Variants } from 'framer-motion'

// Standard Spring Settings (conforming to Design Bible Section 17)
export const SPRING_SUBTLE = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 20,
}

export const SPRING_BOUNCY = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 15,
}

// 1. Fade Animation Preset
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
}

// 2. Slide Animations Presets
export const slideUpVariants: Variants = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: SPRING_SUBTLE },
  exit: { y: 20, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
}

export const slideDownVariants: Variants = {
  initial: { y: -30, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: SPRING_SUBTLE },
  exit: { y: -20, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
}

export const slideLeftVariants: Variants = {
  initial: { x: 30, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: SPRING_SUBTLE },
  exit: { x: 20, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
}

export const slideRightVariants: Variants = {
  initial: { x: -30, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: SPRING_SUBTLE },
  exit: { x: -20, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
}

// 3. Scale Preset (Pop Transition)
export const scaleVariants: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: SPRING_SUBTLE },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
}

// 4. Page Transition Preset
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: 'easeIn' } },
}

// 5. Card Hover Preset (applied on hover gesture)
export const cardHoverPreset: Variants = {
  hover: {
    y: -4,
    scale: 1.01,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transition: SPRING_SUBTLE,
  },
  tap: {
    scale: 0.99,
    transition: { type: 'spring' as const, stiffness: 400, damping: 15 },
  },
}

// 6. List Stagger Container & Item Animations
export const listContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export const listItemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: SPRING_SUBTLE },
}

// 7. Modal Animation Preset
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING_SUBTLE },
  exit: { opacity: 0, scale: 0.96, y: 10, transition: { duration: 0.15, ease: 'easeIn' } },
}

// Backdrop Fade
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}
