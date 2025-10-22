import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Requirement =
  | string
  | {
      field: string;
      message?: string;
    };

type ValidationError = {
  field?: string;
  message: string;
};

type StepProgress = {
  flowId: string;
  stepId: string;
  isComplete: boolean;
  payload?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

type ValidationSuccessResponse = {
  success: true;
  flowId: string;
  stepId: string;
  persisted: boolean;
  progress: StepProgress[];
};

type StepNavigationProps = {
  flowId: string;
  stepId: string;
  stepData: Record<string, unknown>;
  requiredFields?: Requirement[];
  onNext?: () => void;
  onBack?: () => void;
  onValidationSuccess?: (response: ValidationSuccessResponse) => void;
  onValidationError?: (errors: ValidationError[]) => void;
  ctaLabel?: string;
  backLabel?: string;
  endpoint?: string;
};

const DEFAULT_ENDPOINT = "/api/booking-steps/validate";

const DEFAULT_REQUIREMENTS: Record<string, Requirement[]> = {
  "event-details": [
    { field: "eventType", message: "Kies een type evenement." },
    { field: "eventDate", message: "Selecteer een datum." },
  ],
  "package-selection": [{ field: "packageId", message: "Selecteer een pakket." }],
  "contact-details": [
    { field: "name", message: "Naam is vereist." },
    { field: "email", message: "Voer een geldig e-mailadres in." },
    { field: "phone", message: "Telefoonnummer is vereist." },
  ],
  review: [{ field: "confirmation", message: "Bevestig dat de gegevens kloppen." }],
};

function getRequirementField(requirement: Requirement) {
  return typeof requirement === "string" ? requirement : requirement.field;
}

function getNestedValue(source: Record<string, unknown>, path: string): unknown {
  if (!path.includes(".")) {
    return source?.[path];
  }

  return path.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object") {
      const next = (current as Record<string, unknown>)[segment];
      return next;
    }
    return undefined;
  }, source);
}

function hasMeaningfulValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasMeaningfulValue(item));
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((item) => hasMeaningfulValue(item));
  }

  return true;
}

function serializeData(data: Record<string, unknown>): string {
  try {
    return JSON.stringify(data ?? {});
  } catch (_error) {
    return "";
  }
}

async function postValidation(endpoint: string, payload: unknown) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => undefined);

  if (!response.ok) {
    const error = (data && typeof data === "object" ? data : { error: "Validatie mislukt" }) as {
      error?: string;
      details?: ValidationError[];
    };

    const details = Array.isArray(error.details) ? error.details : [];
    const message = error.error ?? "Validatie mislukt";
    const err = new Error(message) as Error & { details?: ValidationError[] };
    err.details = details;
    throw err;
  }

  return data as ValidationSuccessResponse;
}

function useRequirements(stepId: string, provided?: Requirement[]) {
  return useMemo(() => {
    if (Array.isArray(provided) && provided.length > 0) {
      return provided;
    }

    return DEFAULT_REQUIREMENTS[stepId] ?? [];
  }, [provided, stepId]);
}

export default function StepNavigation({
  flowId,
  stepId,
  stepData,
  requiredFields,
  onNext,
  onBack,
  onValidationSuccess,
  onValidationError,
  ctaLabel = "Volgende stap",
  backLabel = "Vorige",
  endpoint = DEFAULT_ENDPOINT,
}: StepNavigationProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<ValidationError[]>([]);
  const serializedData = serializeData(stepData);
  const previousSerialized = useRef<string>(serializedData);

  const requirements = useRequirements(stepId, requiredFields);

  const canProceed = useMemo(() => {
    if (requirements.length === 0) {
      return true;
    }

    return requirements.every((requirement) => {
      const field = getRequirementField(requirement);
      const value = getNestedValue(stepData, field);
      return hasMeaningfulValue(value);
    });
  }, [requirements, stepData]);

  useEffect(() => {
    if (previousSerialized.current !== serializedData) {
      previousSerialized.current = serializedData;
      if (error) {
        setError(null);
        setDetails([]);
      }
    }
  }, [error, serializedData]);

  const handleNext = useCallback(async () => {
    if (submitting || !canProceed) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setDetails([]);

    try {
      const result = await postValidation(endpoint, {
        flowId,
        stepId,
        payload: stepData,
      });

      onValidationSuccess?.(result);
      onNext?.();
    } catch (validationError) {
      const err = validationError as Error & { details?: ValidationError[] };
      const message = err.message || "Validatie mislukt";
      const validationDetails = Array.isArray(err.details) ? err.details : [];

      setError(message);
      setDetails(validationDetails);
      onValidationError?.(validationDetails);
    } finally {
      setSubmitting(false);
    }
  }, [
    canProceed,
    endpoint,
    flowId,
    onNext,
    onValidationError,
    onValidationSuccess,
    stepData,
    stepId,
    submitting,
  ]);

  return (
    <div className="booking-step-navigation">
      {onBack ? (
        <button
          type="button"
          className="booking-step-navigation__back"
          onClick={onBack}
          disabled={submitting}
        >
          {backLabel}
        </button>
      ) : null}

      <button
        type="button"
        className="booking-step-navigation__cta"
        onClick={handleNext}
        disabled={submitting || !canProceed}
      >
        {submitting ? "Bezig met opslaan…" : ctaLabel}
      </button>

      {!canProceed && !submitting ? (
        <p className="booking-step-navigation__hint" role="status">
          Maak eerst alle verplichte keuzes om verder te gaan.
        </p>
      ) : null}

      {error ? (
        <div className="booking-step-navigation__error" role="alert">
          <p>{error}</p>
          {details.length > 0 ? (
            <ul>
              {details.map((detail, index) => (
                <li key={`${detail.field ?? "general"}-${index}`}>{detail.message}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
