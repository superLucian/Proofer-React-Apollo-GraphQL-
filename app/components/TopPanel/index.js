import React from 'react'
import { Menu } from 'semantic-ui-react'

import './styles/index.scss'

const TopPanel = ({leftBlock, middleBlock, rightBlock} ) =>  {
  return (<Menu borderless fixed="top" className="page-wrapper top-bar">
    <Menu.Item position={'left'}>
      {leftBlock}
    </Menu.Item>

    {middleBlock}

    <Menu.Item position='right'>
      {rightBlock}
    </Menu.Item>
  </Menu>)
}

export default TopPanel
