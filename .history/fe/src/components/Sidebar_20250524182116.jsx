import Dashboard from '../assets/Dashboard.svg'
import Front_desk from '../assets/Front_desk.svg'
import Guest from '../assets/Guest.svg'
import Room from '../assets/Room.svg'
import Employee from '../assets/Deal.svg'
import Rate from '../assets/Rate.svg'

const NavItem = ({ icon, label, isActive = false }) => (
  <li>
    <a
      href={`#${label.toLowerCase()}`}
      className={`flex items-center gap-x-3 p-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer ${
        isActive ? 'text-blue-600' : ''
      }`}
      aria-label={`Navigate to ${label}`}
    >
      <img src={icon} alt={`${label} icon`} className="h-5 w-5" />
      <span>{label}</span>
    </a>
  </li>
);

function Sidebar() {
  const navItems = [
    { icon: Dashboard, label: 'Dashboard' },
    { icon: Front_desk, label: 'Front Desk' },
    { icon: Guest, label: 'Guest' },
    { icon: Room, label: 'Room', isActive: true },
    { icon: Employee, label: 'Employees' },
    { icon: Rate, label: 'Rate' },
  ];

  return (
    <nav 
      className="fixed left-0 top-16 bottom-0 bg-white w-64 z-20 pt-4 shadow-md"
      aria-label="Main navigation"
    >
      <ul className="space-y-2 px-4">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={item.isActive}
          />
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;