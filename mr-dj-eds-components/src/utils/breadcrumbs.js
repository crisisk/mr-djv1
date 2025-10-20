const HOME_CRUMB = { name: 'Home', url: '/' };

const createBreadcrumbTrail = (...crumbs) => [HOME_CRUMB, ...crumbs];

export const createServiceBreadcrumbs = (name, url) =>
  createBreadcrumbTrail({ name: 'Diensten', url: '/#diensten' }, { name, url });

export const createSimpleBreadcrumbs = (name, url) => createBreadcrumbTrail({ name, url });

export const createLocalSeoBreadcrumbs = ({ city, slug, isBruiloft }) => {
  const serviceCrumb = isBruiloft
    ? { name: 'Bruiloft DJ', url: '/bruiloft-dj' }
    : { name: 'Feest DJ', url: '/feest-dj' };

  const pageCrumb = {
    name: isBruiloft ? `Bruiloft DJ in ${city}` : `DJ in ${city}`,
    url: isBruiloft ? `/${slug}` : `/dj-in-${slug}`,
  };

  return createBreadcrumbTrail(serviceCrumb, pageCrumb);
};

export default {
  createServiceBreadcrumbs,
  createSimpleBreadcrumbs,
  createLocalSeoBreadcrumbs,
};
