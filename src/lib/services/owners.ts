import { OwnerRepository } from '../repositories/owners'
import { mapClaimRow, OwnerClaim } from '../mappers'
import { NotFoundError } from '../errors'

/**
 * Owners / Claims Service.
 * Manages verified landlord credentials.
 */
export const OwnerService = {
  async getClaimById(id: string): Promise<OwnerClaim> {
    const claim = await OwnerRepository.findById(id)
    if (!claim) {
      throw new NotFoundError(`Ownership claim with ID "${id}" not found.`)
    }
    return mapClaimRow(claim)
  },

  async getClaimsByUser(userId: string): Promise<OwnerClaim[]> {
    const claims = await OwnerRepository.findByUserId(userId)
    return claims.map(mapClaimRow)
  },
}
