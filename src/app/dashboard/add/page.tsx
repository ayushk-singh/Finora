import React from 'react'
import { AddTransactionForm } from '@/components/AddTransactionForm'

function page() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Add Transaction</h1>
      <AddTransactionForm />
    </div>
  )
}

export default page