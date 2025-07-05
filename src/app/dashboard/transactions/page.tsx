import React from 'react'
import { TransactionsTable } from '@/components/TransactionsTable'

function page() {
  return (
     <div className="p-6 max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">All Transactions</h1>
      <TransactionsTable />
    </div>
  )
}

export default page