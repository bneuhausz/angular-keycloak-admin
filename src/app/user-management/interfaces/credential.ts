export interface Credential {
  type: string;
  value: string;
  temporary: boolean;
}

export type CredentialInput = Partial<Omit<Credential, 'value'>> & Pick<Credential, 'value'>;

export const createCredential = (
  partial: CredentialInput
): Credential => ({
  ...partial,
  type: 'password',
  value: partial.value,
  temporary: true,
});