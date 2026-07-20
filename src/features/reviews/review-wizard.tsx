'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/auth-provider'
import { Button } from '@ui/button'
import { TextInput, Textarea } from '@ui/input'
import { Star } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { SPRING_SUBTLE } from '@ui/animations'
import { submitReviewAction } from '@/app/(public)/review/new/actions'
import { useToast } from '@ui/feedback/toast-context'

interface PropertyBrief {
  id: string
  slug: string
  name: string
  neighborhood: string
}

interface ReviewWizardProps {
  properties: PropertyBrief[]
}

// Star rating component — single motion system, no CSS scale mixing.
// Hoisted to module scope so React preserves its identity across renders
// (defining it inside the wizard remounted it on every state change).
const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="flex gap-sm justify-center py-xs">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          onClick={() => onChange(star)}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.15 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 rounded-soft"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={32}
            className={
              star <= value ? 'fill-status-warning text-status-warning' : 'text-border-subtle'
            }
          />
        </motion.button>
      ))}
    </div>
  )
}

/**
 * Conversational Review Submission Wizard.
 * Sprint D3: Removed outer card container, replaced emoji with text labels,
 * replaced inline raw inputs with design system components, softened heading weights,
 * replaced boxed error with plain text treatment, replaced CSS hover scale with
 * a single motion system on star buttons.
 */
export const ReviewWizard: React.FC<ReviewWizardProps> = ({ properties }) => {
  const router = useRouter()
  const { user, triggerProtectedAction } = useAuth()
  const toast = useToast()

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Step transition: horizontal slide collapses to a pure cross-fade when the
  // user prefers reduced motion.
  const shouldReduceMotion = useReducedMotion()
  const stepMotion = {
    initial: { opacity: 0, x: shouldReduceMotion ? 0 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: shouldReduceMotion ? 0 : -20 },
  }

  const [selectedProperty, setSelectedProperty] = useState<PropertyBrief | null>(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('propertyId')
      if (param) {
        const found = properties.find((p) => p.id === param)
        if (found) return found
      }
    }
    return null
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [waterRating, setWaterRating] = useState(0)
  const [securityRating, setSecurityRating] = useState(0)
  const [caretakerRating, setCaretakerRating] = useState(0)
  const [recommend, setRecommend] = useState<'Yes' | 'No' | 'Maybe' | null>(null)
  const [comment, setComment] = useState('')
  const [roleTag, setRoleTag] = useState<
    'Current Resident' | 'Former Resident' | 'Neighbour' | 'Community Contributor' | null
  >(null)

  const filteredProperties = searchQuery.trim()
    ? properties.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const nextStep = () => {
    if (step < 7) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handlePublish = async () => {
    if (
      !selectedProperty ||
      !waterRating ||
      !securityRating ||
      !caretakerRating ||
      !recommend ||
      !comment ||
      !roleTag
    ) {
      setErrorMessage('Please complete all stages before publishing.')
      return
    }

    triggerProtectedAction(async () => {
      setIsSubmitting(true)
      setErrorMessage(null)
      try {
        const result = await submitReviewAction({
          propertyId: selectedProperty.id,
          waterRating,
          securityRating,
          caretakerRating,
          recommend,
          comment,
          roleTag,
        })

        if (result.success) {
          toast.success({
            message: 'Review published',
            description: 'Thank you for helping the community.',
          })
          // Property pages are keyed by slug, not id.
          router.push(`/property/${selectedProperty.slug}`)
          router.refresh()
        } else if (result.alreadyReviewed) {
          setErrorMessage(
            'You have already reviewed this property. You can edit it from the property page.'
          )
          toast.info('You have already reviewed this property')
        } else {
          setErrorMessage(result.error || 'Failed to submit review.')
          toast.error(result.error || 'Failed to submit review.')
        }
      } catch {
        setErrorMessage('An unexpected error occurred. Please try again.')
        toast.error('An unexpected error occurred. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  return (
    <div className="w-full">
      {/* Typographic step indicator — no decorative progress bar */}
      <header className="flex justify-between items-center mb-lg pb-xs border-b border-border-subtle">
        <span className="text-[13px] font-medium text-text-muted">
          Step {step} <span className="text-text-muted/50">of 7</span>
        </span>
        <span className="text-[13px] font-medium text-text-muted">Write a Review</span>
      </header>

      {/* Step Content */}
      <div className="min-h-[240px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={stepMotion.initial}
              animate={stepMotion.animate}
              exit={stepMotion.exit}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-semibold mb-xxs text-text-primary">
                Which building are you reviewing?
              </h2>
              <p className="text-[14px] text-text-muted mb-sm">
                Search by building name or neighborhood.
              </p>

              {selectedProperty ? (
                <div className="p-sm bg-bg-secondary border border-brand-primary/20 rounded-soft flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-[14px] text-text-primary">
                      {selectedProperty.name}
                    </span>
                    <p className="text-[12px] text-text-muted">{selectedProperty.neighborhood}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-[13px] px-sm py-xxs h-auto"
                    onClick={() => setSelectedProperty(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <TextInput
                    placeholder="Search building..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {filteredProperties.length > 0 && (
                    <ul className="absolute top-full left-0 right-0 mt-xxs bg-bg-primary border border-border-subtle rounded-soft shadow-lg max-h-[160px] overflow-y-auto z-20">
                      {filteredProperties.map((p) => (
                        <li
                          key={p.id}
                          onClick={() => {
                            setSelectedProperty(p)
                            setSearchQuery('')
                          }}
                          className="px-sm py-xs hover:bg-bg-secondary cursor-pointer text-[13px] text-text-primary border-b border-border-subtle last:border-0"
                        >
                          <span className="font-semibold">{p.name}</span>
                          <span className="text-text-muted"> · {p.neighborhood}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={stepMotion.initial}
              animate={stepMotion.animate}
              exit={stepMotion.exit}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-semibold mb-xxs text-text-primary">
                Water Reliability
              </h2>
              <p className="text-[14px] text-text-muted mb-sm">
                Rate water consistency, pressure, and source safety.
              </p>
              <StarRating value={waterRating} onChange={setWaterRating} />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={stepMotion.initial}
              animate={stepMotion.animate}
              exit={stepMotion.exit}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-semibold mb-xxs text-text-primary">
                Security &amp; Safety
              </h2>
              <p className="text-[14px] text-text-muted mb-sm">
                Rate gates, perimeter fences, and neighborhood safety.
              </p>
              <StarRating value={securityRating} onChange={setSecurityRating} />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={stepMotion.initial}
              animate={stepMotion.animate}
              exit={stepMotion.exit}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-semibold mb-xxs text-text-primary">
                Caretaker &amp; Management
              </h2>
              <p className="text-[14px] text-text-muted mb-sm">
                Rate response time, fairness, and garbage collection.
              </p>
              <StarRating value={caretakerRating} onChange={setCaretakerRating} />
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={stepMotion.initial}
              animate={stepMotion.animate}
              exit={stepMotion.exit}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-semibold mb-xxs text-text-primary">
                Would you recommend it?
              </h2>
              <p className="text-[14px] text-text-muted mb-sm">
                Would you recommend this building to a friend or family member?
              </p>
              <div className="flex flex-col gap-xs py-xxs">
                {(['Yes', 'No', 'Maybe'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setRecommend(option)}
                    className={`p-sm border rounded-soft text-left font-medium text-[14px] transition-colors cursor-pointer ${
                      recommend === option
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                        : 'border-border-subtle text-text-primary hover:bg-bg-secondary'
                    }`}
                  >
                    {option === 'Yes' && 'Yes, absolutely'}
                    {option === 'No' && 'No, I would avoid it'}
                    {option === 'Maybe' && 'Maybe, with reservations'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              initial={stepMotion.initial}
              animate={stepMotion.animate}
              exit={stepMotion.exit}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-semibold mb-xxs text-text-primary">
                Tell us about your experience
              </h2>
              <p className="text-[14px] text-text-muted mb-sm">
                Share objective facts about water, power, the landlord, or security.
              </p>
              <Textarea
                placeholder="Describe what living here is actually like..."
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </motion.div>
          )}

          {step === 7 && (
            <motion.div
              key="step7"
              initial={stepMotion.initial}
              animate={stepMotion.animate}
              exit={stepMotion.exit}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-semibold mb-xxs text-text-primary">
                Your community label
              </h2>
              <p className="text-[14px] text-text-muted mb-sm">
                Your real name will never appear. Choose an anonymous role.
              </p>
              <div className="grid grid-cols-2 gap-xs mb-sm">
                {(
                  [
                    'Current Resident',
                    'Former Resident',
                    'Neighbour',
                    'Community Contributor',
                  ] as const
                ).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setRoleTag(tag)}
                    className={`p-sm border rounded-soft text-center font-semibold text-[13px] transition-colors cursor-pointer ${
                      roleTag === tag
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                        : 'border-border-subtle hover:bg-bg-secondary text-text-muted'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Error — plain text treatment, no bordered alert box */}
              {errorMessage && (
                <p className="text-[13px] font-medium text-status-error mt-xs">{errorMessage}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <footer className="flex justify-between items-center mt-xl pt-sm border-t border-border-subtle">
        <Button
          onClick={prevStep}
          variant="outline"
          className="px-sm py-xxs h-auto text-[14px]"
          disabled={step === 1 || isSubmitting}
        >
          Back
        </Button>

        {step < 7 ? (
          <Button
            onClick={nextStep}
            variant="primary"
            className="px-sm py-xxs h-auto text-[14px]"
            disabled={
              (step === 1 && !selectedProperty) ||
              (step === 2 && !waterRating) ||
              (step === 3 && !securityRating) ||
              (step === 4 && !caretakerRating) ||
              (step === 5 && !recommend) ||
              (step === 6 && !comment.trim())
            }
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={handlePublish}
            variant="primary"
            className="px-sm py-xxs h-auto text-[14px]"
            disabled={!roleTag || isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : user ? 'Publish Review' : 'Sign in to Publish'}
          </Button>
        )}
      </footer>
    </div>
  )
}
