import sanitizeHtml
from 'sanitize-html';


const SAFE_DIMENSION =
  /^(?:0|[1-9]\d*(?:\.\d+)?)(?:px|%|em|rem)?$/;


export const ARTICLE_HTML_OPTIONS = {

  allowedTags: [
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    's',
    'strike',
    'code',
    'pre',
    'h2',
    'h3',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
    'colgroup',
    'col',
    'hr',
  ],


  allowedAttributes: {

    '*': [
      'class',
    ],

    a: [
      'href',
      'target',
      'rel',
      'title',
    ],

    img: [
      'src',
      'alt',
      'title',
      'width',
      'height',
      'loading',
      'decoding',
    ],

    ol: [
      'start',
      'reversed',
      'type',
    ],

    li: [
      'value',
    ],

    table: [
      'style',
    ],

    colgroup: [
      'span',
    ],

    col: [
      'span',
      'style',
    ],

    th: [
      'colspan',
      'rowspan',
      'scope',
      'abbr',
      'style',
    ],

    td: [
      'colspan',
      'rowspan',
      'headers',
      'style',
    ],

  },


  allowedSchemes: [
    'http',
    'https',
    'mailto',
    'tel',
  ],


  allowedSchemesByTag: {

    img: [
      'http',
      'https',
    ],

  },


  allowProtocolRelative:
    false,


  allowedStyles: {

    table: {

      width: [
        SAFE_DIMENSION,
      ],

      'min-width': [
        SAFE_DIMENSION,
      ],

      'max-width': [
        SAFE_DIMENSION,
      ],

    },


    col: {

      width: [
        SAFE_DIMENSION,
      ],

      'min-width': [
        SAFE_DIMENSION,
      ],

      'max-width': [
        SAFE_DIMENSION,
      ],

    },


    th: {

      width: [
        SAFE_DIMENSION,
      ],

      'min-width': [
        SAFE_DIMENSION,
      ],

      'max-width': [
        SAFE_DIMENSION,
      ],

      'text-align': [
        /^(?:left|center|right)$/i,
      ],

      'vertical-align': [
        /^(?:top|middle|bottom)$/i,
      ],

    },


    td: {

      width: [
        SAFE_DIMENSION,
      ],

      'min-width': [
        SAFE_DIMENSION,
      ],

      'max-width': [
        SAFE_DIMENSION,
      ],

      'text-align': [
        /^(?:left|center|right)$/i,
      ],

      'vertical-align': [
        /^(?:top|middle|bottom)$/i,
      ],

    },

  },


  disallowedTagsMode:
    'discard',

};


export function sanitizeArticleContent(
  value
) {

  return sanitizeHtml(
    String(
      value ??
      ''
    ),
    ARTICLE_HTML_OPTIONS,
  );

}
