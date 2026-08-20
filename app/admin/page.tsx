import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import AdminDashboard from '@/components/AdminDashboard'

export const metadata = { title: 'Admin — Shah Solutions', robots: 'noindex,nofollow' }

export default async function AdminPage() {
  const ok = await getSession()
  if (!ok) redirect('/admin/login')

  return <AdminDashboard />
}
