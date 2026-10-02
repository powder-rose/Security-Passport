const getNeutralRegionPrepositional = (
    name,
) => {
    const value =
      String(name || '').trim();

    if (!value) {
      return '';
    }

    const parts =
      value.split(' — ');

    let head =
      parts[0];

    const tail =
      parts.length > 1
        ? ` — ${parts.slice(1).join(' — ')}`
        : '';

    if (
      head.startsWith(
        'Республика ',
      )
    ) {
      return (
        `Республике ${head.slice(
          'Республика '.length,
        )}${tail}`
      );
    }

    if (
      head.endsWith(
        ' Республика',
      )
    ) {
      head = head
        .replace(
          /ская Республика$/,
          'ской Республике',
        )
        .replace(
          /цкая Республика$/,
          'цкой Республике',
        );

      return `${head}${tail}`;
    }

    if (
      head.endsWith(
        ' область',
      )
    ) {
      head = head
        .replace(
          /ская /g,
          'ской ',
        )
        .replace(
          /цкая /g,
          'цкой ',
        )
        .replace(
          /ная /g,
          'ной ',
        )
        .replace(
          /яя /g,
          'ей ',
        )
        .replace(
          / область$/,
          ' области',
        );

      return `${head}${tail}`;
    }

    if (
      head.endsWith(
        ' край',
      )
    ) {
      head = head
        .replace(
          /ский край$/,
          'ском крае',
        )
        .replace(
          /цкий край$/,
          'цком крае',
        );

      return `${head}${tail}`;
    }

    if (
      head.endsWith(
        ' автономный округ',
      )
    ) {
      head = head
        .replace(
          /ский автономный округ$/,
          'ском автономном округе',
        )
        .replace(
          /цкий автономный округ$/,
          'цком автономном округе',
        );

      return `${head}${tail}`;
    }

    return '';
};


export const getRegionalWorkText = (
    currentCity,
) => {
    if (
      !currentCity ||
      currentCity.isDefault
    ) {
      return '';
    }

    if (
      currentCity.prepositional
    ) {
      return (
        `Работаем в ` +
        `${currentCity.prepositional}.`
      );
    }

    if (
      currentCity.type === 'region'
    ) {
      const regionName =
        getNeutralRegionPrepositional(
          currentCity.name,
        );

      if (regionName) {
        return (
          `Работаем в ${regionName}.`
        );
      }

      return (
        `Работаем в регионе ` +
        `«${currentCity.name}».`
      );
    }

    if (
      currentCity.type === 'city'
    ) {
      return (
        `Работаем в городе ` +
        `«${currentCity.name}».`
      );
    }

    return (
      `Работаем в населённом пункте ` +
      `«${currentCity.name}».`
    );
};
