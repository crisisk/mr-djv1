import React, {
  cloneElement,
  isValidElement,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import styles from './CallToAction.module.css';

type Alignment = 'left' | 'center' | 'right';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outlineLight' | 'ghost';

type CTAButtonAsButton = {
  as?: 'button';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    label: string;
    variant?: ButtonVariant;
  };

type CTAButtonAsAnchor = {
  as: 'a';
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & {
    label: string;
    variant?: ButtonVariant;
  };

export type CTAButtonProps = CTAButtonAsButton | CTAButtonAsAnchor;

export interface CallToActionProps {
  eyebrow?: string;
  title?: string;
  description?: ReactNode;
  align?: Alignment;
  spacing?: 'comfortable' | 'compact';
  stackOnMobile?: boolean;
  className?: string;
  primaryButton: CTAButtonProps;
  secondaryButton?: CTAButtonProps;
  children?: ReactNode;
}

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: styles.primaryButton,
  secondary: styles.secondaryButton,
  outline: styles.outlineButton,
  outlineLight: styles.outlineLightButton,
  ghost: styles.ghostButton,
};

const classNames = (...tokens: Array<string | false | null | undefined>): string =>
  tokens.filter(Boolean).join(' ');

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const normalizeDescription = (description: ReactNode): ReactNode => {
  if (!description) {
    return null;
  }

  if (typeof description === 'string' || typeof description === 'number') {
    return <p className={styles.description}>{description}</p>;
  }

  if (isValidElement(description)) {
    const element = description as ReactElement<{ className?: string }>;
    return cloneElement(element, {
      className: classNames(styles.description, element.props.className),
    });
  }

  return <div className={styles.description}>{description}</div>;
};

const resolveVariant = (variant?: ButtonVariant): ButtonVariant =>
  (variant && buttonVariantClasses[variant] ? variant : 'primary');

const isAnchorConfig = (config: CTAButtonProps): config is CTAButtonAsAnchor => config.as === 'a';

const renderCTAButton = (config: CTAButtonProps, key?: string) => {
  if (isAnchorConfig(config)) {
    const { as: _as, label, variant, className, ...anchorProps } = config;
    const variantClass = buttonVariantClasses[resolveVariant(variant)];
    return (
      <a key={key} className={classNames(styles.button, variantClass, className)} {...anchorProps}>
        {label}
      </a>
    );
  }

  const { as: _as, label, variant, className, type = 'button', ...buttonProps } = config;
  const variantClass = buttonVariantClasses[resolveVariant(variant)];
  return (
    <button key={key} type={type} className={classNames(styles.button, variantClass, className)} {...buttonProps}>
      {label}
    </button>
  );
};

const CallToAction: React.FC<CallToActionProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  spacing = 'comfortable',
  stackOnMobile = true,
  className,
  primaryButton,
  secondaryButton,
  children,
}) => {
  const alignmentClass = styles[`align${capitalize(align) as 'Left' | 'Center' | 'Right'}`] ?? styles.alignCenter;
  const spacingClass = spacing === 'compact' ? styles.compactSpacing : undefined;
  const stackingClass = stackOnMobile ? styles.stackOnMobile : undefined;

  const normalizedDescription = normalizeDescription(description);

  return (
    <div className={classNames(styles.callToAction, alignmentClass, spacingClass, stackingClass, className)}>
      {(eyebrow || title || normalizedDescription || children) && (
        <div className={styles.textGroup}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          {title && <h3 className={styles.title}>{title}</h3>}
          {normalizedDescription}
          {children}
        </div>
      )}
      <div className={styles.buttonGroup}>
        {renderCTAButton(primaryButton)}
        {secondaryButton ? renderCTAButton(secondaryButton) : null}
      </div>
    </div>
  );
};

export default CallToAction;
