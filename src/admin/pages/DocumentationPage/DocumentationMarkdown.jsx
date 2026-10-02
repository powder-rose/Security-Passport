import React from 'react';


function renderInline(
  value,
  keyPrefix,
) {
  const source =
    String(value || '');

  const pattern =
    /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

  const parts = [];
  let lastIndex = 0;
  let match;
  let index = 0;


  while (
    (
      match =
        pattern.exec(source)
    )
  ) {
    if (
      match.index >
      lastIndex
    ) {
      parts.push(
        source.slice(
          lastIndex,
          match.index,
        ),
      );
    }


    const token =
      match[0];

    const key =
      `${keyPrefix}-${index}`;


    if (
      token.startsWith('`') &&
      token.endsWith('`')
    ) {
      parts.push(
        <code key={key}>
          {token.slice(1, -1)}
        </code>,
      );
    } else if (
      token.startsWith('**') &&
      token.endsWith('**')
    ) {
      parts.push(
        <strong key={key}>
          {
            token.slice(
              2,
              -2,
            )
          }
        </strong>,
      );
    } else {
      const linkMatch =
        token.match(
          /^\[([^\]]+)\]\(([^)]+)\)$/,
        );

      if (linkMatch) {
        const label =
          linkMatch[1];

        const href =
          linkMatch[2];

        const safeHref =
          /^(https?:\/\/|\/|#)/i
            .test(href)
            ? href
            : '#';

        const external =
          /^https?:\/\//i
            .test(safeHref);

        parts.push(
          <a
            key={key}
            href={safeHref}
            target={
              external
                ? '_blank'
                : undefined
            }
            rel={
              external
                ? 'noopener noreferrer'
                : undefined
            }
          >
            {label}
          </a>,
        );
      } else {
        parts.push(
          token,
        );
      }
    }


    lastIndex =
      pattern.lastIndex;

    index += 1;
  }


  if (
    lastIndex <
    source.length
  ) {
    parts.push(
      source.slice(
        lastIndex,
      ),
    );
  }


  return parts;
}


function isBlockStart(line) {
  return (
    /^#{1,6}\s+/.test(line) ||
    /^-\s+/.test(line) ||
    /^\d+\.\s+/.test(line) ||
    /^>\s?/.test(line) ||
    /^ {4}/.test(line) ||
    /^---+$/.test(
      line.trim(),
    )
  );
}


export default function DocumentationMarkdown({
  markdown,
  headings = [],
}) {
  const lines =
    String(markdown || '')
      .replace(
        /\r\n?/g,
        '\n',
      )
      .split('\n');

  const headingsByLine =
    new Map(
      headings.map(
        heading => [
          heading.lineIndex,
          heading,
        ],
      ),
    );

  const blocks = [];

  let index = 0;
  let blockIndex = 0;


  while (
    index <
    lines.length
  ) {
    const line =
      lines[index];


    if (
      !line.trim()
    ) {
      index += 1;
      continue;
    }


    const headingMatch =
      line.match(
        /^(#{1,6})\s+(.+)$/,
      );

    if (
      headingMatch
    ) {
      const level =
        headingMatch[1].length;

      const Tag =
        `h${level}`;

      const heading =
        headingsByLine.get(
          index,
        );

      blocks.push(
        React.createElement(
          Tag,
          {
            key:
              `heading-${blockIndex}`,

            id:
              heading?.id,

            className:
              'documentation-content__heading',
          },
          renderInline(
            headingMatch[2],
            `heading-${blockIndex}`,
          ),
        ),
      );

      index += 1;
      blockIndex += 1;

      continue;
    }


    if (
      /^---+$/.test(
        line.trim(),
      )
    ) {
      blocks.push(
        <hr
          key={
            `hr-${blockIndex}`
          }
        />,
      );

      index += 1;
      blockIndex += 1;

      continue;
    }


    if (
      /^ {4}/.test(line)
    ) {
      const codeLines = [];

      while (
        index <
        lines.length
      ) {
        const current =
          lines[index];

        if (
          /^ {4}/.test(
            current,
          )
        ) {
          codeLines.push(
            current.slice(4),
          );

          index += 1;
          continue;
        }

        if (
          !current.trim() &&
          index + 1 <
            lines.length &&
          /^ {4}/.test(
            lines[index + 1],
          )
        ) {
          codeLines.push('');
          index += 1;
          continue;
        }

        break;
      }

      blocks.push(
        <pre
          key={
            `code-${blockIndex}`
          }
        >
          <code>
            {
              codeLines.join(
                '\n',
              )
            }
          </code>
        </pre>,
      );

      blockIndex += 1;

      continue;
    }


    if (
      /^-\s+/.test(line)
    ) {
      const items = [];

      while (
        index <
          lines.length &&
        /^-\s+/.test(
          lines[index],
        )
      ) {
        items.push(
          lines[index]
            .replace(
              /^-\s+/,
              '',
            ),
        );

        index += 1;
      }

      blocks.push(
        <ul
          key={
            `ul-${blockIndex}`
          }
        >
          {items.map(
            (
              item,
              itemIndex,
            ) => (
              <li
                key={
                  `ul-${blockIndex}-${itemIndex}`
                }
              >
                {renderInline(
                  item,
                  `ul-${blockIndex}-${itemIndex}`,
                )}
              </li>
            ),
          )}
        </ul>,
      );

      blockIndex += 1;

      continue;
    }


    if (
      /^\d+\.\s+/.test(
        line,
      )
    ) {
      const items = [];

      while (
        index <
          lines.length &&
        /^\d+\.\s+/.test(
          lines[index],
        )
      ) {
        items.push(
          lines[index]
            .replace(
              /^\d+\.\s+/,
              '',
            ),
        );

        index += 1;
      }

      blocks.push(
        <ol
          key={
            `ol-${blockIndex}`
          }
        >
          {items.map(
            (
              item,
              itemIndex,
            ) => (
              <li
                key={
                  `ol-${blockIndex}-${itemIndex}`
                }
              >
                {renderInline(
                  item,
                  `ol-${blockIndex}-${itemIndex}`,
                )}
              </li>
            ),
          )}
        </ol>,
      );

      blockIndex += 1;

      continue;
    }


    if (
      /^>\s?/.test(line)
    ) {
      const quote = [];

      while (
        index <
          lines.length &&
        /^>\s?/.test(
          lines[index],
        )
      ) {
        quote.push(
          lines[index]
            .replace(
              /^>\s?/,
              '',
            ),
        );

        index += 1;
      }

      blocks.push(
        <blockquote
          key={
            `quote-${blockIndex}`
          }
        >
          <p>
            {renderInline(
              quote.join(' '),
              `quote-${blockIndex}`,
            )}
          </p>
        </blockquote>,
      );

      blockIndex += 1;

      continue;
    }


    const paragraph = [
      line.trim(),
    ];

    index += 1;

    while (
      index <
        lines.length &&
      lines[index].trim() &&
      !isBlockStart(
        lines[index],
      )
    ) {
      paragraph.push(
        lines[index].trim(),
      );

      index += 1;
    }

    blocks.push(
      <p
        key={
          `paragraph-${blockIndex}`
        }
      >
        {renderInline(
          paragraph.join(' '),
          `paragraph-${blockIndex}`,
        )}
      </p>,
    );

    blockIndex += 1;
  }


  return blocks;
}
