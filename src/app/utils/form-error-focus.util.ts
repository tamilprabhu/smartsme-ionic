function isElementVisible(element: Element): boolean {
  const htmlElement = element as HTMLElement;
  if (!htmlElement) {
    return false;
  }
  if (htmlElement.offsetParent === null && htmlElement.getClientRects().length === 0) {
    return false;
  }
  return true;
}

function focusElement(element: Element): void {
  const candidate = element as HTMLElement & { setFocus?: () => Promise<void> | void };
  if (typeof candidate?.setFocus === 'function') {
    candidate.setFocus();
    return;
  }

  const focusable = element.querySelector<HTMLElement>(
    'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable) {
    focusable.focus();
  }
}

export function focusAndScrollToFirstError(root: ParentNode = document): void {
  requestAnimationFrame(() => {
    const firstError = Array.from(
      root.querySelectorAll('form ion-text[color="danger"], form .validation-error, form [aria-invalid="true"]')
    ).find(isElementVisible);

    const firstInvalidControl = Array.from(
      root.querySelectorAll(
        'form ion-input.ng-invalid, form ion-select.ng-invalid, form ion-textarea.ng-invalid, form input.ng-invalid, form select.ng-invalid, form textarea.ng-invalid'
      )
    ).find(isElementVisible);

    const scrollTarget = firstError ?? firstInvalidControl;
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (firstInvalidControl) {
      focusElement(firstInvalidControl);
    }
  });
}
