import MainMapCom from 'C/component/map/main'
import IntroPage from 'C/component/IntroPage/IntroPage'
import SplitContainer from 'C/ui/SplitContainer'

export default function Origin() {
  return <SplitContainer
    FrameFront={IntroPage}
    FrameBack={<MainMapCom/>}
    bot_pl1 = {[70,17]}
    bot_pl2 = {[36,10]}
    bot_pl3 = {[10,7]}
    />;
}