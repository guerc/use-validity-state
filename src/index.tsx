import { useRef, useCallback } from 'react';

export type ValidityCollection = Record<string, ValidityState>;

export interface CompositeValidity {
  any: ValidityCollection;
  every: boolean;
  register: (instance: ConstraintValidationCandidate | null) => void;
}

export type ConstraintValidationCandidate =
  | HTMLButtonElement
  | HTMLInputElement
  | HTMLOutputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

const useValidityState = (): CompositeValidity => {
  const refs = useRef<Record<string, ConstraintValidationCandidate>>({});

  const validityCollection = Object.entries(refs.current).reduce((prev, [name, ref]) => {
    return { ...prev, [name]: ref.validity };
  }, {} as ValidityCollection);

  const every = Object.values(refs.current).every(ref => ref.validity.valid);

  const register = useCallback((instance: ConstraintValidationCandidate | null): void => {
    if (!instance?.name) {
      console.warn('Name for input field not found. Please make sure you assign one via the "name" prop.')
      return;
    }

    if (refs.current) {
      refs.current[instance.name] = instance;
    }
  }, []);

  return { any: validityCollection, every, register };
};

export default useValidityState;
