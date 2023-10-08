import Zone from 'components/page/page.zone'

function ZonePage() {
  return <Zone />
}

export async function getStaticPaths() {
  return {paths: [], fallback: 'blocking'}
}

export async function getStaticProps() {
  return {props: {}}
}

export default ZonePage
