import birth from './icon_birth.png'
import dead from './icon_dead.png'
import live from './icon_live.png'
import blank from './icon_blank.png'
// TODO move to icons
const icons = {
  birth,
  dead,
  live,
  blank
}

const getIcon = name => icons[name] || icons.blank

export default getIcon
