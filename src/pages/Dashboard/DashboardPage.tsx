import { Link } from 'react-router-dom'
import { Card } from '../../components/common'

// Temporary until the real dashboard (step 10).
export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-3xl md:text-4xl">Bom dia, explorer</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/lesson/lisboa-hello"><Card className="hover:border-sage">Lisboa · Saying hello</Card></Link>
        <Link to="/lesson/porto-coffee"><Card className="hover:border-sage">Porto · One coffee, please!</Card></Link>
      </div>
    </div>
  )
}
