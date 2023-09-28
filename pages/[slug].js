import Zone from 'components/page/page.zone'
import {zones} from 'util/dummy-data'

function ZonePage() {
  return <Zone />
}

export async function getStaticPaths() {
  const slugs = zones.map(({slug}) => ({params: {slug}}))

  return {paths: slugs, fallback: false}
}

export async function getStaticProps() {
  return {props: {}}
}

export default ZonePage
