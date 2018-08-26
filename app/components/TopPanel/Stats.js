import React from 'react'
import { Statistic } from 'semantic-ui-react'
import Stat from './Stat'
import './styles/index.scss'

const Stats = ({stats}) =>  {
  let renderStat = (stat, key) => {
    if(React.isValidElement(stat))
    {
      return stat;
    }

    if(stat.divider)
      return (<Statistic key={key} className="divided" ></Statistic>);

    return <Stat key={key} _key={key} stat={stat} />
  }

  return <Statistic.Group size={'small'} className="item">
      {stats.map((stat, index) => renderStat(stat, index))}
    </Statistic.Group>;
}

export default Stats
