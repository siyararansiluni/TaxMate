export interface Advisor {
  id: string
  initials: string
  name: string
  title: string
  specialization: string
  years: number
  location: string
  about: string
  phone: string
  email: string
  address: string
  hours: string
  services: string[]
}

const SERVICES = [
  'Individual Tax Consultation',
  'Tax Return Preparation',
  'Tax Planning and Advisory',
  'Income Tax Compliance',
  'Review of Tax Assessments',
]

const ABOUT =
  'Experienced tax advisor providing comprehensive tax consultation services for individuals and small to medium businesses. Specialises in income tax planning, return preparation and compliance with Sri Lankan tax regulations.'

// Sample data (as in the Figma). Replace with API data later.
export const ADVISORS: Advisor[] = [
  {
    id: 's-fernando', initials: 'SF', name: 'S. Fernando', title: 'Chartered Accountant',
    specialization: 'Individual tax planning', years: 6, location: 'Colombo',
    about: ABOUT, phone: '077 187 6453', email: 's.fernando@example.com',
    address: 'No. 45, Galle Road, Colombo 03', hours: 'Monday - Friday, 8:00 AM - 5:00 PM',
    services: SERVICES,
  },
  {
    id: 'n-perera', initials: 'NP', name: 'N. Perera', title: 'Tax Consultant',
    specialization: 'Business and self-employment', years: 8, location: 'Kandy',
    about: ABOUT, phone: '077 123 4567', email: 'n.perera@example.com',
    address: 'No. 12, Peradeniya Road, Kandy', hours: 'Monday - Friday, 8:30 AM - 5:00 PM',
    services: SERVICES,
  },
  {
    id: 'd-jayasinghe', initials: 'DJ', name: 'D. Jayasinghe', title: 'Tax Practitioner',
    specialization: 'Tax return preparation', years: 11, location: 'Galle',
    about: ABOUT, phone: '077 765 4321', email: 'd.jayasinghe@example.com',
    address: 'No. 8, Matara Road, Galle', hours: 'Monday - Saturday, 9:00 AM - 4:00 PM',
    services: SERVICES,
  },
]

export const getAdvisor = (id?: string) => ADVISORS.find((a) => a.id === id)