export const compactObject = <T extends Record<string, any>>(value: T): Partial<T> =>
  Object.fromEntries(Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)) as Partial<T>;

export const requireDestructiveConfirmation = (confirmed: boolean | undefined, action: string) => {
  if (confirmed !== true) {
    throw new Error(`${action} is destructive. Re-run this tool with confirm_delete set to true to proceed.`);
  }
};

export const requireAtLeastOneArgument = (args: Record<string, any>, names: string[], action: string) => {
  if (!names.some((name) => args[name] !== undefined)) {
    throw new Error(`${action} requires at least one editable field: ${names.join(', ')}`);
  }
};

export const requireNonEmptyObject = (value: Record<string, any>, action: string) => {
  if (Object.keys(value).length === 0) {
    throw new Error(`${action} requires at least one field`);
  }
};

export const redactEmailFields = <T extends Record<string, any>>(items: T[], includeEmails: boolean): T[] => {
  if (includeEmails) {
    return items;
  }

  return items.map((item) => ({
    ...item,
    ...(typeof item.email === 'string' ? { email: '[redacted]' } : {})
  }));
};
