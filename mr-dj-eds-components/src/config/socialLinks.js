import socialContent from '../content/social.json';

const DEFAULT_SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  linkedin: 'https://www.linkedin.com/'
};

const mergedSocialLinks = {
  ...DEFAULT_SOCIAL_LINKS,
  ...(socialContent ?? {})
};

const sanitizedSocialLinks = Object.entries(mergedSocialLinks).reduce((acc, [platform, url]) => {
  if (typeof url === 'string' && url.trim().length > 0) {
    acc[platform] = url.trim();
  }
  return acc;
}, {});

const socialLinks = Object.freeze(sanitizedSocialLinks);

export const socialLinkUrls = Object.freeze(Object.values(socialLinks));

export default socialLinks;
