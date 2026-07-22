'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { Navbar } from '@/components/navbar-wrapper'
import { Footer } from '@ui/navigation'
import { Container, Section, Grid } from '@ui/layout'
import { H1 } from '@ui/typography'
import { PropertyCard } from '@ui/card'
import { EmptyState, LoadingSpinner } from '@ui/feedback'
import { useSavedProperties } from '@/features/properties/use-saved-properties'
import { Property } from '@/lib/mappers'

/**
 * Saved properties page. Slugs live in localStorage only, so this is a
 * client-side page that resolves them via /api/properties/by-slugs.
 */
export default function SavedPage() {
  const router = useRouter()
  const { saved } = useSavedProperties()
  const [properties, setProperties] = React.useState<Property[] | null>(null)
  const isLoading = properties === null

  React.useEffect(() => {
    let cancelled = false

    const load =
      saved.length === 0
        ? Promise.resolve({ properties: [] as Property[] })
        : fetch(`/api/properties/by-slugs?slugs=${encodeURIComponent(saved.join(','))}`).then(
            (res) => res.json()
          )

    load.then((data) => {
      if (!cancelled) setProperties(data.properties || [])
    })

    return () => {
      cancelled = true
    }
  }, [saved])

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary">
      <Navbar />

      <main className="flex-1">
        <Section className="py-lg bg-bg-primary">
          <Container className="flex flex-col gap-md">
            <H1>
              {saved.length > 0
                ? `${saved.length} saved ${saved.length === 1 ? 'home' : 'homes'}`
                : 'Saved homes'}
            </H1>

            {isLoading ? (
              <div className="flex justify-center py-xl">
                <LoadingSpinner size="lg" />
              </div>
            ) : properties && properties.length > 0 ? (
              <Grid cols={5} gap="md">
                {properties.map((prop) => (
                  <Link href={`/property/${prop.slug}`} key={prop.id} className="block group">
                    <PropertyCard
                      name={prop.name}
                      neighborhood={prop.neighborhood}
                      rentMin={prop.rentMin}
                      rentMax={prop.rentMax}
                      houseType={prop.houseType}
                      healthScore={prop.healthScore}
                      isVerified={prop.isVerified}
                      imageUrl={prop.images?.[0]}
                      waterRating={
                        prop.waterRating === 'Excellent' ? 5 : prop.waterRating === 'Good' ? 4 : 3
                      }
                      securityRating={
                        prop.securityRating === 'Excellent'
                          ? 5
                          : prop.securityRating === 'Good'
                            ? 4
                            : 3
                      }
                    />
                  </Link>
                ))}
              </Grid>
            ) : (
              <EmptyState
                icon={<Heart size={28} />}
                title="No saved homes yet"
                description="Tap the heart icon on any listing to save it here for later."
                actionLabel="Browse homes"
                onActionClick={() => router.push('/search')}
              />
            )}
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
