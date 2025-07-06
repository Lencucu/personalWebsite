import MainMapCom from '@/components/map/main'
import HomePage from '@/components/HomePage/HomePage'
import SplitContainer from '@/components/Containers/SplitContainer'

export default function Origin() {
  return <SplitContainer frameFront={<HomePage />} frameBack={<MainMapCom />}/>;
}