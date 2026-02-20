import { Animation, createAnimation } from '@ionic/angular';

type NavAnimationOptions = {
  enteringEl: HTMLElement;
  leavingEl?: HTMLElement;
  direction?: 'forward' | 'back';
};

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const appNavAnimation = (_: HTMLElement, opts?: NavAnimationOptions): Animation => {
  const enteringEl = opts?.enteringEl;
  const leavingEl = opts?.leavingEl;
  const isBack = opts?.direction === 'back';

  if (!enteringEl) {
    return createAnimation();
  }

  if (prefersReducedMotion()) {
    const noMotion = createAnimation().duration(0);
    noMotion.addAnimation(
      createAnimation().addElement(enteringEl).fromTo('opacity', '1', '1')
    );
    if (leavingEl) {
      noMotion.addAnimation(
        createAnimation().addElement(leavingEl).fromTo('opacity', '1', '1')
      );
    }
    return noMotion;
  }

  const enteringFromX = isBack ? '-20px' : '20px';
  const leavingToX = isBack ? '28px' : '-20px';

  const enteringAnimation = createAnimation()
    .addElement(enteringEl)
    .beforeRemoveClass('ion-page-invisible')
    .fromTo('opacity', '0.9', '1')
    .fromTo('transform', `translateX(${enteringFromX})`, 'translateX(0)');

  const rootAnimation = createAnimation()
    .duration(220)
    .easing('cubic-bezier(0.22, 0.61, 0.36, 1)')
    .addAnimation(enteringAnimation);

  if (leavingEl) {
    const leavingAnimation = createAnimation()
      .addElement(leavingEl)
      .fromTo('opacity', '1', '0.95')
      .fromTo('transform', 'translateX(0)', `translateX(${leavingToX})`);

    rootAnimation.addAnimation(leavingAnimation);
  }

  return rootAnimation;
};
