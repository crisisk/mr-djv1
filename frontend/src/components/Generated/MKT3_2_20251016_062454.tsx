import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useGeneratedContentConfig } from '../../context/useGeneratedContentConfig'

const DEFAULT_EVENT_PREFIX = 'social_media_ad_impression'
const EMPTY_ANALYTICS_PAYLOAD: Record<string, unknown> = Object.freeze({})

const SocialMediaAd = ({
  videoUrl,
  platform,
  headline,
  description,
  ctaText,
  analyticsConfig,
}) => {
  const { analytics: analyticsFromContext } = useGeneratedContentConfig()

  const resolvedAnalytics = analyticsConfig ?? analyticsFromContext
  const trackEvent = resolvedAnalytics?.trackEvent
  const eventNamesByPlatform = resolvedAnalytics?.eventNamesByPlatform
  const defaultEventName = resolvedAnalytics?.defaultEventName
  const analyticsPayload = useMemo(
    () => resolvedAnalytics?.payload ?? EMPTY_ANALYTICS_PAYLOAD,
    [resolvedAnalytics],
  )

  useEffect(() => {
    if (!trackEvent) {
      return
    }

    const eventName =
      eventNamesByPlatform?.[platform] ??
      defaultEventName ??
      `${DEFAULT_EVENT_PREFIX}_${platform}`

    trackEvent(eventName, {
      platform,
      headline,
      description,
      ctaText,
      videoUrl,
      ...analyticsPayload,
    })
  }, [
    analyticsPayload,
    ctaText,
    defaultEventName,
    description,
    eventNamesByPlatform,
    headline,
    platform,
    trackEvent,
    videoUrl,
  ])

  return (
    <div className="social-media-ad">
      <div className="video-container">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="ad-video"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="ad-content">
        <h2 className="ad-headline">{headline}</h2>
        <p className="ad-description">{description}</p>
        <button className="ad-cta">{ctaText}</button>
      </div>
    </div>
  );
};

SocialMediaAd.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
  analyticsConfig: PropTypes.shape({
    trackEvent: PropTypes.func,
    eventNamesByPlatform: PropTypes.objectOf(PropTypes.string),
    defaultEventName: PropTypes.string,
    payload: PropTypes.object,
  }),
}

SocialMediaAd.defaultProps = {
  analyticsConfig: undefined,
}

export default SocialMediaAd
