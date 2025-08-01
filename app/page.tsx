import MainMapCom from '~/component/map/main'
import IntroPage from '~/component/IntroPage/introPage'
import SplitContainer from '~/ui/SplitContainer'

export default function Origin() {
  return <SplitContainer
    FrameFront={IntroPage}
    FrameBack={<MainMapCom/>}
    bot_pl1 = {[70,17]}
    bot_pl2 = {[36,10]}
    bot_pl3 = {[10,7]}
    />;
}