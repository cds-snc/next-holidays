/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import Head from 'next/head'
import { mediaQuery } from './styles'

const main = css`
  font-size: 28px;
  font-family: sans-serif;
  margin-top: 15px;
  padding-left: 15px;
  padding-right: 10px;
  max-width: 960px;
  background-color: snow;

h1, h2 {
  font-weight: 400;
  font-size: 200%;
  margin-top: 0;
  margin-bottom: 25px;
  }
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  padding-bottom: 5px;
}

a, a:visited {
  color: #0572d5;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

${mediaQuery.lg(css`
  font-size: 24px;
`)}

${mediaQuery.md(css`
  font-size: 22px;
`)}

${mediaQuery.sm(css`
  font-size: 18px;
`)}
`

const Layout = props => (
  <div role="main" css={main}>
    <Head>
      <title>{props.title ? `${props.title} ` : 'next holidays'}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div>{props.children}</div>
  </div>
)

export default Layout
