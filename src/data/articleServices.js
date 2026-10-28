import { marketObjectType } from './marketObjectType.js';
import { servicePages } from './servicePages.js';

const marketService = {
  id: marketObjectType.id,
  title: marketObjectType.seoName,
  path: marketObjectType.path,
  description: marketObjectType.description,
};

export function getArticleServices(slug) {
  const services = servicePages.slice(0, 2);

  if (slug !== 'pasport-bezopasnosti-rynka') {
    return services;
  }

  return services.map(service => (service.id === 'categorization-act' ? marketService : service));
}
