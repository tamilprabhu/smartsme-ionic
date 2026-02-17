import { AbstractControl, FormGroup } from '@angular/forms';

export type ServerValidationErrors = Record<string, string[]>;

export interface ApplyServerValidationResult {
  mapped: ServerValidationErrors;
  unmapped: ServerValidationErrors;
}

const SERVER_ERROR_KEY = 'server';

function normalizeMessages(messages: unknown): string[] {
  if (Array.isArray(messages)) {
    return messages
      .map((message) => String(message).trim())
      .filter((message) => message.length > 0);
  }

  if (typeof messages === 'string') {
    const trimmedMessage = messages.trim();
    return trimmedMessage ? [trimmedMessage] : [];
  }

  return [];
}

function getControl(form: FormGroup, controlPath: string): AbstractControl | null {
  return form.get(controlPath);
}

export function extractServerValidationErrors(errorResponse: unknown): ServerValidationErrors {
  const payload = (errorResponse as any)?.error ?? errorResponse;
  const rawErrors = payload?.errors;

  if (!rawErrors) {
    return {};
  }

  // Handle array format: [{field: "username", message: "..."}, ...]
  if (Array.isArray(rawErrors)) {
    return rawErrors.reduce<ServerValidationErrors>((acc, error) => {
      if (error?.field && error?.message) {
        const field = String(error.field);
        const message = String(error.message).trim();
        if (message) {
          if (!acc[field]) acc[field] = [];
          acc[field].push(message);
        }
      }
      return acc;
    }, {});
  }

  // Handle object format: {username: ["msg1", "msg2"], email: ["msg"]}
  if (typeof rawErrors === 'object') {
    return Object.entries(rawErrors).reduce<ServerValidationErrors>((acc, [field, messages]) => {
      const normalizedMessages = normalizeMessages(messages);
      if (normalizedMessages.length > 0) {
        acc[field] = normalizedMessages;
      }
      return acc;
    }, {});
  }

  return {};
}

export function clearServerValidationErrors(form: FormGroup): void {
  Object.values(form.controls).forEach((control) => {
    if ((control as FormGroup).controls) {
      clearServerValidationErrors(control as FormGroup);
      return;
    }

    const existingErrors = control.errors;
    if (!existingErrors || !Object.prototype.hasOwnProperty.call(existingErrors, SERVER_ERROR_KEY)) {
      return;
    }

    const { [SERVER_ERROR_KEY]: _, ...remainingErrors } = existingErrors;
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  });
}

export function applyServerValidationErrors(
  form: FormGroup,
  serverErrors: ServerValidationErrors,
  controlAliases: Record<string, string> = {}
): ApplyServerValidationResult {
  const result: ApplyServerValidationResult = {
    mapped: {},
    unmapped: {}
  };

  Object.entries(serverErrors).forEach(([field, messages]) => {
    const controlPath = controlAliases[field] ?? field;
    const control = getControl(form, controlPath);

    if (!control) {
      result.unmapped[field] = messages;
      return;
    }

    control.setErrors({
      ...(control.errors ?? {}),
      [SERVER_ERROR_KEY]: messages
    });
    control.markAsTouched();
    result.mapped[controlPath] = messages;
  });

  return result;
}
