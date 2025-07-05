import React from 'react'
import { TransactionsTable } from '@/components/TransactionsTable'

function page() {
  return (
     <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">All Transactions</h1>
      <TransactionsTable />
    </div>
  )
}

export default page