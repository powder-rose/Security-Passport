import { getActiveRegions } from '../config/regions.mjs';

for (const region of getActiveRegions()) {
  console.log(region.slug);
}
