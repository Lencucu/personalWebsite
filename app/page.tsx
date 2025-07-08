import MainMapCom from '@/components/map/main'
import IntroPage from '@/components/IntroPage/IntroPage'
import SplitContainer from '@/components/Containers/SplitContainer'

export default function Origin() {
  return <SplitContainer
    FrameFront={IntroPage}
    FrameBack={<MainMapCom/>}
    bot_pl1 = {[70,17]}
    bot_pl2 = {[36,10]}
    bot_pl3 = {[10,7]}
    />;
}