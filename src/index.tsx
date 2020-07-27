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
  const refsMap = useRef<Record<string, ConstraintValidationCandidate>>({});

  const validityCollection = Object.entries(refsMap.current).reduce((prev, [name, ref]) => {
    return { ...prev, [name]: ref.validity };
  }, {} as ValidityCollection);

  const every = Object.values(refsMap.current).every(ref => ref.validity.valid);

  const register = useCallback((instance: ConstraintValidationCandidate | null): void => {
    if (!instance?.name) {
      console.warn('You didn’t provide an input element or one without a "name" prop. Ignoring...', instance);
      return;
    }

    refsMap.current[instance.name] = instance;
  }, []);

  return { any: validityCollection, every, register };
};

export default useValidityState;
