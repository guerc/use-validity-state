import React from 'react';

export type ValidityCollection<T> = {
  [K in keyof T]?: ValidityState;
};

export type CompositeValidity<T> = ValidityCollection<T> & {
  every: boolean;
};

export type ConstraintValidationCandidate =
  | HTMLButtonElement
  | HTMLInputElement
  | HTMLOutputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

const useValidityState = <
  T extends Record<string, React.RefObject<ConstraintValidationCandidate>>
>(
  initial: T,
): CompositeValidity<T> => {
  const x = Object.entries(initial).reduce((prev, [name, ref]) => {
    return { ...prev, [name]: ref.current?.validity };
  }, {} as ValidityCollection<T>);

  const every = Object.values(initial).every(ref => ref.current?.validity.valid);

  return { ...x, every };
};

export default useValidityState;
