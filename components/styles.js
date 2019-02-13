// need this comment for emotion to work
/** @jsx jsx */
import { jsx, css } from '@emotion/core'

export const breakpoints = {
  xs: 330,
  sm: 575,
  md: 764,
  base: 764,
  lg: 1050,
  xl: 1325,
}

export const theme = {
  colour: {
    black: '#000000',
    blackLight: '#262626',
    white: '#fff',
    grayOutline: '#b7b7b7',
    grayLight: '#f0efef',
  },
  font: {
    xs: '8pt',
    sm: '10pt',
    base: '12pt',
    md: '12pt',
    lg: '14pt',
    xl: '20pt',
    xxl: '24pt',
  },
  spacing: {
    xxs: '0.17rem',
    xs: '0.33rem',
    sm: '0.5rem',
    md: '1.0rem',
    base: '1.0rem',
    lg: '1.5rem',
    xl: '2.5rem',
    xxl: '5rem',
    xxxl: '12rem',
  },
}

/* eslint-disable security/detect-object-injection */

export const mediaQuery = Object.keys(breakpoints).reduce(
  (accumulator, label) => {
    let prefix = typeof breakpoints[label] === 'string' ? '' : 'max-width:'
    let suffix = typeof breakpoints[label] === 'string' ? '' : 'px'
    accumulator[label] = cls =>
      css`
        @media screen and (${prefix + breakpoints[label] + suffix}) {
          ${cls};
        }
      `
    return accumulator
  },
  {},
)

export const roundedEdges = css`
  -webkit-border-radius: 0.5rem;
  -moz-border-radius: 0.5rem;
  border-radius: 0.5rem;
`

/*
 * Hide only visually, but have it
 * available for screenreaders
 */

export const visuallyhidden = css`
  border: 0;
  clip: rect(0 0 0 0);
  height: auto;
  margin: 0;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  white-space: nowrap;
`

export const visuallyhiddenMobile = css`
  ${mediaQuery.sm(css`
    ${visuallyhidden};
  `)};
`
