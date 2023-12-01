import React from 'react'
import PromptReceipts from '../../components/upload/promptReceipts'
import withLayout from '../../components/layouts/withLayout'

function Prompt() {

  return (
    <div>
      <div>hi</div>
      <PromptReceipts/>
      
    </div>
  )
}

export default withLayout(Prompt, "login")
