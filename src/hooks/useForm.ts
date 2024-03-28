import { ChangeEvent, useEffect, useMemo, useState } from 'react';

type FormState<T> = {
  [K in keyof T]: string;
}

type ValidationFunction = (value: string) => boolean;

export type FormValidations<T> = {
  [K in keyof T]: [ValidationFunction, string];
}

type ValidationResult<T> = {
  [K in keyof T as `${Extract<K, string>}Valid`]: string;
}

type UseForm<T> = {
  [K in keyof FormState<T>]: string;
} & {
  formState: FormState<T>;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onResetForm: () => void;
} & ValidationResult<T>
& {
  isFormValid: boolean;
}

export const useForm = <T>( initialForm: T = {} as T, formValidations: FormValidations<T> = {} as FormValidations<T>): UseForm<T> => {

  const [ formState, setFormState ] = useState<FormState<T>>( initialForm as FormState<T> );
  const [ formValidation, setFormValidation ] = useState<ValidationResult<T>>({} as ValidationResult<T>);

  useEffect(() => {
    const createValidators = () => {
      const formCheckedValues: Record<string, string> = {} as ValidationResult<T>;
  
      for (const formField of Object.keys( formValidations )) {
        const [ fn, errorMessage = 'Field is required' ] = formValidations[formField as keyof T];
        const fieldValue = formState[formField as keyof T];
        
        formCheckedValues[`${ formField }Valid`] = fn( fieldValue ) ? '' : errorMessage;
      }      
      setFormValidation( formCheckedValues as ValidationResult<T> );
    }
    
    createValidators();
  }, [ formState, formValidations ]);

  useEffect(() => {
    setFormState(initialForm as FormState<T>);
  }, [initialForm])

  const isFormValid = useMemo( () => {
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue as keyof typeof formValidation] !== '') return false;
    }

    return true;
  }, [ formValidation ])
  

  const onInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [ name ]: value,
    });
  }

  const onResetForm = () => {
    setFormState(initialForm as FormState<T>);
  }

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    ...formValidation,
    isFormValid,
  }
}
