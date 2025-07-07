import MainMapCom from '@/components/map/main'
import IntroPage from '@/components/IntroPage/IntroPage'
import SplitContainer from '@/components/Containers/SplitContainer'

export default function Origin() {
  return <SplitContainer frameFront={<IntroPage />} frameBack={<MainMapCom />}/>;
}