import { Metadata } from 'next'
import React from 'react'
import MaintenanceDetails from './components/tabs/MaintenanceDetails'

export const metadata:Metadata={
    title: 'Chi tiết bảo trì',
    description: 'Chi tiết bảo trì',
}
export default function MaintainenceDetails() {
  return (
    <MaintenanceDetails/>
  )
}
