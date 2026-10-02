function getNeutralRegionPrepositional(
  name,
) {
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
    return (
      `${head
        .replace(
          /ский край$/,
          'ском крае',
        )
        .replace(
          /цкий край$/,
          'цком крае',
        )}${tail}`
    );
  }

  if (
    head.endsWith(
      ' автономный округ',
    )
  ) {
    return (
      `${head
        .replace(
          /ский автономный округ$/,
          'ском автономном округе',
        )
        .replace(
          /цкий автономный округ$/,
          'цком автономном округе',
        )}${tail}`
    );
  }

  return '';
}


export function getRegionalWorkText(
  city,
) {
  if (
    !city ||
    city.isDefault
  ) {
    return '';
  }

  if (city.prepositional) {
    return (
      `Работаем в ${city.prepositional}.`
    );
  }

  if (
    city.type === 'region'
  ) {
    const name =
      getNeutralRegionPrepositional(
        city.name,
      );

    if (name) {
      return `Работаем в ${name}.`;
    }

    return (
      `Работаем в регионе ` +
      `«${city.name}».`
    );
  }

  if (
    city.type === 'city'
  ) {
    return (
      `Работаем в городе ` +
      `«${city.name}».`
    );
  }

  return (
    `Работаем в населённом пункте ` +
    `«${city.name}».`
  );
}
