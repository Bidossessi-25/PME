import React from 'react'
import { SectionCards } from '@/components/section-cards'
const adminDashBoard = () => {
  return (
    <section>
         <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              
              <div>
                Hi dev
              </div>
            </div>
          </div>
        </div>
    </section>
  )
}

export default adminDashBoard