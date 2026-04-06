/**
 * Enum for job application status values.
 * Uses SCREAMING_CASE to align with existing DTO references.
 */
export enum EnumJobApplicationStatus {
  new = 'new',
  reviewed = 'reviewed',
  interviewScheduled = 'interviewScheduled',
  interviewing = 'interviewing',
  hired = 'hired',
  rejected = 'rejected',
}
