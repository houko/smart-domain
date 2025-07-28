import {
  SECURITY_LABELS,
  SECURITY_LEVELS,
  SECURITY_THRESHOLDS,
} from '@/constants'

const flagMapping = {
  critical: SECURITY_LEVELS.CRITICAL,
  high: SECURITY_LEVELS.HIGH,
  medium: SECURITY_LEVELS.MEDIUM,
  low: SECURITY_LEVELS.LOW,
  informational: SECURITY_LEVELS.INFORMATIONAL,
}

const formatCVSSScore = (
  score: number,
): { severity: string; label: string } => {
  if (score >= SECURITY_THRESHOLDS.CRITICAL) {
    return {
      severity: SECURITY_LEVELS.CRITICAL,
      label: SECURITY_LABELS.CRITICAL,
    }
  }
  if (score >= SECURITY_THRESHOLDS.HIGH) {
    return { severity: SECURITY_LEVELS.HIGH, label: SECURITY_LABELS.HIGH }
  }
  if (score >= SECURITY_THRESHOLDS.MEDIUM) {
    return { severity: SECURITY_LEVELS.MEDIUM, label: SECURITY_LABELS.MEDIUM }
  }
  if (score >= SECURITY_THRESHOLDS.LOW) {
    return { severity: SECURITY_LEVELS.LOW, label: SECURITY_LABELS.LOW }
  }
  return {
    severity: SECURITY_LEVELS.INFORMATIONAL,
    label: SECURITY_LABELS.INFORMATIONAL,
  }
}

export { flagMapping, formatCVSSScore }
