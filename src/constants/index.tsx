import Noise from '../components/Noise'
import PointWave from '../components/PointWave'
import TerrainMarble from '../components/TerrainMarble'
import Terrain from '../components/Terrain'
import Twist from '../components/Twist'
import TwistText from '../components/TwistText'
import Terrain2 from '../components/Terrain2'
import BarbedWire from '../components/BarbedWire'
import GridText from '../components/GridText'
import Ascii from '../components/Ascii'
import Metal from '../components/Metal'

export const screens = {
  metal: { id: 0, component: Metal },
  noise: { id: 1, component: Noise },
  pointWav: { id: 2, component: PointWave },
  terrainMarble: { id: 3, component: TerrainMarble },
  terrain: { id: 4, component: Terrain },
  terrain2: { id: 5, component: Terrain2 },
  twist: { id: 6, component: Twist },
  twistText: { id: 7, component: TwistText },
  barbedWire: { id: 8, component: BarbedWire },
  gridText: { id: 9, component: GridText },
  ascii: { id: 10, component: Ascii }
}

export const screenKeys = Object.keys(screens)
