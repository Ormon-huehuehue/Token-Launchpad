"use client"

import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import React from 'react'

const Navbar = () => {
  return (
    <div className = "flex justify-between w-full px-10">
        <WalletMultiButton/>
        <WalletDisconnectButton/>
    </div>
  )
}

export default Navbar