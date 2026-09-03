import {
  createContext,
  useContext,
  useMemo,
} from 'react';

import {
  CITY,
  normalizeCity,
} from '../config/city';


const GeoContext =
  createContext(CITY);


export function GeoProvider({
  city,
  children,
}) {
  const value =
    useMemo(
      () =>
        normalizeCity(
          city || CITY,
        ),
      [city],
    );

  return (
    <GeoContext.Provider value={value}>
      {children}
    </GeoContext.Provider>
  );
}


export function useCity() {
  return useContext(GeoContext);
}
