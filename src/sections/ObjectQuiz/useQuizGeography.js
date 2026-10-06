import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  normalizeGeoName,
} from '../../lib/formInput';


export default function useQuizGeography({
  questionType,
  regionValue,
}) {
  const [
    geography,
    setGeography,
  ] = useState(null);


  useEffect(
    () => {
      let cancelled =
        false;

      const controller =
        new AbortController();

      fetch(
        '/assets/quiz-geography-v1.json',
        {
          cache: 'force-cache',
          signal:
            controller.signal,
        },
      )
        .then(
          response => {
            if (!response.ok) {
              throw new Error(
                `Geography HTTP ${response.status}`,
              );
            }

            return response.json();
          },
        )
        .then(
          data => {
            if (
              cancelled ||
              !Array.isArray(data?.regions)
            ) {
              return;
            }

            setGeography(data);
          },
        )
        .catch(
          () => {
            if (!cancelled) {
              setGeography(null);
            }
          },
        );

      return () => {
        cancelled = true;
        controller.abort();
      };
    },
    [],
  );


  const regionOptions =
    useMemo(
      () =>
        geography?.regions ??
        [],
      [geography],
    );


  const selectedGeoRegion =
    useMemo(
      () => {
        if (
          questionType !== 'location' ||
          !regionValue
        ) {
          return null;
        }

        const target =
          normalizeGeoName(
            regionValue,
          );

        return (
          regionOptions.find(
            region =>
              normalizeGeoName(
                region.name,
              ) === target,
          ) ??
          null
        );
      },
      [
        questionType,
        regionValue,
        regionOptions,
      ],
    );


  const settlementOptions =
    selectedGeoRegion
      ?.settlements ??
    [];


  return {
    regionOptions,
    settlementOptions,
  };
}
