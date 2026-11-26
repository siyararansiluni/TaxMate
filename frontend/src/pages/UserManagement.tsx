import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'

import { getAccessToken } from '../auth/session'

type UserRole = 'Tax Payer' | 'Tax Advisor' 
type AccountStatus = 'Active' | 'Pending Approval' | 'Deactivated'
type RoleFilter = 'All roles' | UserRole

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: AccountStatus
}

interface ApiUser {
  user_id: string
  email: string
  account_status: string
  user_roles: { roles: { role_name: string } }[]
  taxpayer_profiles: { full_name: string } | null
  advisor_profiles: { qualifications: string | null } | null
}

interface AdminUsersResponse {
  message: string
  data: ApiUser[]
}

function mapApiUser(user: ApiUser): User {
  const roleNames: Record<string, UserRole> = {
    TAXPAYER: 'Tax Payer',
    ADVISOR: 'Tax Advisor',}
   

  const statusNames: Record<string, AccountStatus> = {
    ACTIVE: 'Active',
    PENDING: 'Pending Approval',
    PENDING_APPROVAL: 'Pending Approval',
    DEACTIVATED: 'Deactivated',
  }

  const role = roleNames[user.user_roles[0]?.roles.role_name]
  const status = statusNames[user.account_status.toUpperCase()]

  if (!role || !status) {
    throw new Error(
      `Unsupported user role or account status for ${user.email}`,
    )
  }

  return {
    id: user.user_id,
    name: user.taxpayer_profiles?.full_name || user.email.split('@')[0],
    email: user.email,
    role,
    status,
  }
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchDraft, setSearchDraft] = useState('')
  const [roleDraft, setRoleDraft] = useState<RoleFilter>('All roles')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedRole, setAppliedRole] = useState<RoleFilter>('All roles')
  const [viewingUser, setViewingUser] = useState<User | null>(null)
  const [managingUser, setManagingUser] = useState<User | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadUsers() {
      const accessToken = getAccessToken()

      if (!accessToken) {
        setLoadError('Sign in as an admin to view users.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        const result = (await response.json()) as AdminUsersResponse

        if (!response.ok) {
          throw new Error(result.message || 'Unable to load users.')
        }

        const loadedUsers = result.data
  .filter(
    (user) =>
      !user.user_roles.some(({ roles }) => roles.role_name === 'ADMIN'),
  )
  .map(mapApiUser)

        if (!cancelled) {
          setUsers(loadedUsers)
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error ? error.message : 'Unable to load users.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadUsers()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!viewingUser && !managingUser) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setViewingUser(null)
        setManagingUser(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewingUser, managingUser])

  const filteredUsers = useMemo(() => {
    const search = appliedSearch.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        search.length === 0 ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)

      const matchesRole =
        appliedRole === 'All roles' || user.role === appliedRole

      return matchesSearch && matchesRole
    })
  }, [users, appliedSearch, appliedRole])

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAppliedSearch(searchDraft)
    setAppliedRole(roleDraft)
  }

  function updateUserStatus(userId: string, status: AccountStatus) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, status } : user,
      ),
    )

    setManagingUser((currentUser) =>
      currentUser?.id === userId ? { ...currentUser, status } : currentUser,
    )
  }

  function deleteUser(user: User) {
    const confirmed = window.confirm(
      `Delete ${user.name}? This action cannot be undone.`,
    )

    if (!confirmed) return

    setUsers((currentUsers) =>
      currentUsers.filter((currentUser) => currentUser.id !== user.id),
    )
    setManagingUser(null)
  }

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-bold text-[#173453] sm:text-[28px]">
          User Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review accounts, roles and advisor approval requests.
        </p>
      </header>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-[#173453]">
          User directory
        </h2>

        <form
          onSubmit={applyFilters}
          className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-end"
        >
          <div>
            <label
              htmlFor="user-search"
              className="mb-1 block text-xs font-medium text-slate-800"
            >
              Search users
            </label>
            <input
              id="user-search"
              type="search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Search by name or email"
              className="h-10 w-full rounded-md border border-[#5B84B1] bg-white px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="relative">
            <select
              id="role-filter"
              value={roleDraft}
              onChange={(event) => {
                const role = event.target.value

                if (
                  role === 'All roles' ||
                  role === 'Tax Payer' ||
                  role === 'Tax Advisor' 
                  
                ) {
                  setRoleDraft(role)
                }
              }}
              className="h-10 w-full appearance-none rounded-md border border-[#5B84B1] bg-white px-3 pr-10 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="All roles">All roles</option>
              <option value="Tax Payer">Tax Payer</option>
              <option value="Tax Advisor">Tax Advisor</option>
          
            </select>

            <svg
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="m5 7.5 5 5 5-5" />
            </svg>
          </div>

          <button
            type="submit"
            className="h-10 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
          >
            Apply filters
          </button>
        </form>

        <div className="mt-6 overflow-x-auto rounded-xl border border-[#5B84B1] bg-white">
          <table className="w-full min-w-200 text-left text-sm">
            <thead className="bg-blue-50 text-xs text-slate-700">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  User Name
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Email
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Role
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Account Status
                </th>
                <th scope="col" className="px-4 py-3 text-center font-semibold">
                  View
                </th>
                <th scope="col" className="px-4 py-3 text-center font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Loading users...
                  </td>
                </tr>
              )}

              {!loading && loadError && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-rose-700"
                  >
                    {loadError}
                  </td>
                </tr>
              )}

              {!loading &&
                !loadError &&
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-slate-100 text-slate-600"
                  >
                    <td className="px-4 py-4 font-medium text-slate-900">
                      {user.name}
                    </td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4">{user.role}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setViewingUser(user)}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setManagingUser(user)}
                        aria-label={`Manage ${user.name}`}
                        title="Manage user"
                        className="inline-flex rounded p-2 text-slate-800 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                          <path d="M15 5l4 4" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && !loadError && filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    {users.length === 0
                      ? 'No users found.'
                      : 'No users match those filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {viewingUser && (
        <ModalShell
          title="User Details"
          onClose={() => setViewingUser(null)}
        >
          <UserSummary user={viewingUser} />

          <div className="space-y-3 px-5 pb-5">
            <DetailRow label="Name" value={viewingUser.name} />
            <DetailRow label="Email" value={viewingUser.email} />
            <DetailRow label="Role" value={viewingUser.role} />
            <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3">
              <span className="text-sm text-slate-500">Account Status</span>
              <StatusBadge status={viewingUser.status} />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={() => setViewingUser(null)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </ModalShell>
      )}

      {managingUser && (
        <ModalShell
          title="Manage User"
          onClose={() => setManagingUser(null)}
        >
          <UserSummary user={managingUser} />

          <div className="px-5 pb-5">
            <p className="text-xs font-semibold text-[#173453]">
              Account Status
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <StatusBadge status={managingUser.status} />
              <span className="text-xs text-slate-500">
                {managingUser.status === 'Active'
                  ? 'User can log in to the system.'
                  : managingUser.status === 'Deactivated'
                    ? 'User cannot log in to the system.'
                    : 'This account is awaiting approval.'}
              </span>
            </div>
          </div>

          <div className="grid gap-2 border-t border-slate-100 p-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => deleteUser(managingUser)}
              className="rounded-md bg-rose-100 px-3 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              Delete user
            </button>

            <button
              type="button"
              disabled={managingUser.status === 'Deactivated'}
              onClick={() =>
                updateUserStatus(managingUser.id, 'Deactivated')
              }
              className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Deactivate
            </button>

            <button
              type="button"
              disabled={managingUser.status === 'Active'}
              onClick={() => updateUserStatus(managingUser.id, 'Active')}
              className="rounded-md border border-blue-200 bg-blue-100 px-3 py-2.5 text-sm font-semibold text-blue-800 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Activate
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: AccountStatus }) {
  const styles: Record<AccountStatus, string> = {
    Active: 'bg-emerald-100 text-emerald-700',
    'Pending Approval': 'bg-amber-100 text-amber-800',
    Deactivated: 'bg-slate-100 text-slate-600',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

function UserSummary({ user }: { user: User }) {
  return (
    <div className="flex flex-col items-center px-5 py-5 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.1 0-7.5 2.1-7.5 4.7V21h15v-2.3c0-2.6-3.4-4.7-7.5-4.7Z" />
        </svg>
      </div>
      <h3 className="mt-2 text-xl font-bold text-[#173453]">{user.name}</h3>
      <p className="text-sm text-slate-500">{user.email}</p>
      <span className="mt-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        {user.role}
      </span>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-slate-100 pt-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="break-all text-right text-sm font-medium text-[#173453]">
        {value}
      </span>
    </div>
  )
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
        className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between bg-blue-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-blue-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 20v-1a5.5 5.5 0 0 1 11 0v1M17 8h4M19 6v4" />
              </svg>
            </span>
            <h2
              id="user-modal-title"
              className="text-sm font-bold text-[#173453]"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-1.5 text-slate-500 hover:bg-blue-100 hover:text-[#173453] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        {children}
      </section>
    </div>
  )
}