import { DashboardLeft } from '@/app/modules/Dashboard'
import React from 'react'

const FeaturesLayout = ({children}: {children: React.ReactNode}) => {
  return (

    <div className='flex h-screen'>
    <DashboardLeft />
    {children}
    </div>
  )
}




export default FeaturesLayout