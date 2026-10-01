import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  normalizeGeoName,
  normalizeSettlementName,
} from '../../lib/formInput';


export default function useQuizGeography({
  questionType,
  regionValue,
}) {
  const [
    geography,
    setGeography,
  ] =
    useState(null);

  const [
    geographyError,
    setGeographyError,
  ] =
    useState(false);


  useEffect(
    () => {
      let cancelled =
        false;

      fetch(
        '/assets/quiz-geography-v1.json',
        {
          cache:
            'force-cache',
        },
      )
        .then(
          response => {
            if (
              !response.ok
            ) {
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
              !Array.isArray(
                data?.regions,
              )
            ) {
              return;
            }

            setGeography(
              data,
            );

            setGeographyError(
              false,
            );
          },
        )
        .catch(
          () => {
            if (
              !cancelled
            ) {
              setGeographyError(
                true,
              );
            }
          },
        );

      return () => {
        cancelled =
          true;
      };
    },
    [],
  );


  const regionOptions =
    geography?.regions ??
    [];


  const selectedGeoRegion =
    useMemo(
      () => {
        if (
          questionType !==
            'location' ||
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
              ) ===
              target,
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


  function validateLocation(
    answer,
  ) {
    if (
      geographyError ||
      !geography
    ) {
      return (
        'Не удалось загрузить справочник населённых пунктов. Обновите страницу и попробуйте ещё раз.'
      );
    }


    const regionTarget =
      normalizeGeoName(
        answer?.region,
      );

    const region =
      geography.regions.find(
        item =>
          normalizeGeoName(
            item.name,
          ) ===
          regionTarget,
      );


    if (!region) {
      return (
        'Выберите регион из списка.'
      );
    }


    const cityTarget =
      normalizeSettlementName(
        answer?.city,
      );

    const cityExists =
      region.settlements.some(
        settlement =>
          normalizeGeoName(
            settlement.name,
          ) ===
          cityTarget,
      );


    if (!cityExists) {
      return (
        'Выберите существующий населённый пункт в выбранном регионе.'
      );
    }


    return null;
  }


  return {
    regionOptions,
    settlementOptions,
    validateLocation,
  };
}
