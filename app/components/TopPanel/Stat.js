import { Icon, Statistic } from 'semantic-ui-react'

import './styles/index.scss'

const Stat = ({stat, _key}) => (
    <Statistic key={_key}>
      <Statistic.Value>
        <span>{stat.value}</span>
      </Statistic.Value>
      <Statistic.Label>{stat.label}</Statistic.Label>
      {!isNaN(stat.indicator) && (<div className="indicator">
        <Icon name={"arrow " + (stat.indicator >= 0 ? 'up' : 'down')} />
        <span>{Math.abs(stat.indicator)}</span>
      </div>)}
    </Statistic>
)

export default Stat
