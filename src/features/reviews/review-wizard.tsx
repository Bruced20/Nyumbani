'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/auth-provider'
import { Button } from '@ui/button'
import { Star, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SPRING_SUBTLE } from '@ui/animations'
import { submitReviewAction } from '@/app/(public)/review/new/actions'

interface PropertyBrief {
  id: string
  name: string
  neighborhood: string
}

interface ReviewWizardProps {
  properties: PropertyBrief[]
}

/**
 * Conversational Review Submission Wizard.
 * Guides the user through a 7-step review submission funnel.
 * Intercepts submission with AuthProvider guards.
 */
export const ReviewWizard: React.FC<ReviewWizardProps> = ({ properties }) => {
  const router = useRouter()
  const { user, triggerProtectedAction } = useAuth()

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Review Form States
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
      setErrorMessage('Please complete all stages of the review wizard.')
      return
    }

    // Wrap the review submission action in the triggerProtectedAction auth guard!
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
          router.push(`/property/${selectedProperty.id}`)
          router.refresh()
        } else {
          setErrorMessage(result.error || 'Failed to submit review.')
        }
      } catch {
        setErrorMessage('An unexpected error occurred during submission.')
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  return (
    <div className="border border-border-subtle p-lg rounded-symmetric bg-bg-secondary shadow-md w-full">
      {/* Header Indicator */}
      <header className="flex justify-between items-center mb-md border-b border-border-subtle pb-xs">
        <span className="text-metadata text-text-muted">Step {step} of 7</span>
        <span className="text-metadata text-brand-indigo font-semibold">Conversational Review</span>
      </header>

      {/* Screen Container */}
      <div className="min-h-[220px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-bold mb-xxs text-text-primary">
                Select your building
              </h2>
              <p className="text-metadata text-text-muted mb-xs">
                Search for the building name to attach your review.
              </p>

              {selectedProperty ? (
                <div className="p-xs bg-bg-primary border border-brand-indigo/30 rounded-soft flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[14px] text-text-primary">
                      {selectedProperty.name}
                    </span>
                    <p className="text-[11px] text-text-muted">{selectedProperty.neighborhood}</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-metadata p-xxs h-auto"
                    onClick={() => setSelectedProperty(null)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search building..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-xs bg-bg-primary border border-border-subtle rounded-soft focus:outline-none focus:border-brand-indigo text-[14px] text-text-primary"
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
                          className="p-xs hover:bg-bg-secondary cursor-pointer text-[13px] text-text-primary border-b border-border-subtle last:border-0"
                        >
                          <span className="font-semibold">{p.name}</span> — {p.neighborhood}
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-bold mb-xxs text-text-primary">
                Water Reliability
              </h2>
              <p className="text-metadata text-text-muted mb-sm">
                Rate water consistency, pressure, and source safety.
              </p>
              <div className="flex gap-xs justify-center py-xs">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setWaterRating(star)}
                    className="hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      size={32}
                      className={
                        star <= waterRating
                          ? 'fill-accent-warning text-accent-warning'
                          : 'text-border-subtle'
                      }
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-bold mb-xxs text-text-primary">
                Security & Safety
              </h2>
              <p className="text-metadata text-text-muted mb-sm">
                Rate gates, perimeter fences, and neighborhood safety.
              </p>
              <div className="flex gap-xs justify-center py-xs">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSecurityRating(star)}
                    className="hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      size={32}
                      className={
                        star <= securityRating
                          ? 'fill-accent-warning text-accent-warning'
                          : 'text-border-subtle'
                      }
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-bold mb-xxs text-text-primary">
                Caretaker & Management
              </h2>
              <p className="text-metadata text-text-muted mb-sm">
                Rate response time, fairness, and garbage collection.
              </p>
              <div className="flex gap-xs justify-center py-xs">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setCaretakerRating(star)}
                    className="hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      size={32}
                      className={
                        star <= caretakerRating
                          ? 'fill-accent-warning text-accent-warning'
                          : 'text-border-subtle'
                      }
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-bold mb-xxs text-text-primary">
                Would you recommend it?
              </h2>
              <p className="text-metadata text-text-muted mb-sm">
                Would you recommend this building to friends or family?
              </p>
              <div className="flex flex-col gap-xs py-xxs">
                {(['Yes', 'No', 'Maybe'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setRecommend(option)}
                    className={`p-xs border rounded-soft text-left font-medium text-[13px] transition-colors cursor-pointer ${
                      recommend === option
                        ? 'border-brand-indigo bg-brand-indigo/5 text-brand-indigo'
                        : 'border-border-subtle hover:bg-bg-primary'
                    }`}
                  >
                    {option === 'Yes' && '👍 Yes, absolutely'}
                    {option === 'No' && '👎 No, avoid it'}
                    {option === 'Maybe' && '🤔 Maybe, with reservations'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-bold mb-xxs text-text-primary">
                What is your comment?
              </h2>
              <p className="text-metadata text-text-muted mb-sm">
                Provide objective facts about water, power, landlord, or security issues.
              </p>
              <textarea
                placeholder="Type your review details here..."
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-xs bg-bg-primary border border-border-subtle rounded-soft focus:outline-none focus:border-brand-indigo text-[13px] text-text-primary"
              />
            </motion.div>
          )}

          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={SPRING_SUBTLE}
            >
              <h2 className="text-subtitle font-bold mb-xxs text-text-primary">Community Tag</h2>
              <p className="text-metadata text-text-muted mb-xs">
                Select your anonymous label. Your real name will never appear.
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
                    className={`p-xs border rounded-soft text-center font-bold text-[11px] transition-colors cursor-pointer ${
                      roleTag === tag
                        ? 'border-brand-indigo bg-brand-indigo/5 text-brand-indigo'
                        : 'border-border-subtle hover:bg-bg-primary text-text-muted'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {errorMessage && (
                <div className="p-xs bg-accent-coral/10 text-accent-coral border border-accent-coral/25 rounded-soft text-[12px] mb-xs flex items-center gap-xxs">
                  <ShieldAlert size={14} />
                  {errorMessage}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <footer className="flex justify-between items-center mt-md pt-sm border-t border-border-subtle">
        <Button
          onClick={prevStep}
          variant="outline"
          className="text-metadata px-sm py-xxs h-auto"
          disabled={step === 1 || isSubmitting}
        >
          Back
        </Button>

        {step < 7 ? (
          <Button
            onClick={nextStep}
            variant="primary"
            className="text-metadata px-sm py-xxs h-auto"
            disabled={
              (step === 1 && !selectedProperty) ||
              (step === 2 && !waterRating) ||
              (step === 3 && !securityRating) ||
              (step === 4 && !caretakerRating) ||
              (step === 5 && !recommend) ||
              (step === 6 && !comment.trim())
            }
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handlePublish}
            variant="primary"
            className="text-metadata px-sm py-xxs h-auto"
            disabled={!roleTag || isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : user ? 'Publish Review' : 'Sign in to Publish'}
          </Button>
        )}
      </footer>
    </div>
  )
}
