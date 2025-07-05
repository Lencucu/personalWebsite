import DynamicMap from '@/components/map/dynamic-map'
import HomePage from '@/components/HomePage/HomePage'
import SplitContainer from '@/components/Containers/SplitContainer'

export default function Origin() {
  return <SplitContainer frameFront={<HomePage />} frameBack={<DynamicMap />}/>;
}