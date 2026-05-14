import React, { useState } from 'react';
import {
  IconBolt, IconBell, IconLayoutDashboard, IconUsers, IconBriefcase,
  IconStar, IconCoin, IconFileAnalytics, IconSettings, IconAlertTriangle,
  IconPlus, IconMessageCircle, IconMapPin, IconHeart, IconCalendar,
  IconFileInvoice, IconUser, IconChevronRight, IconCheck, IconX,
  IconHandStop, IconArrowUpRight, IconArrowDownRight, IconClock
} from '@tabler/icons-react';

// Demo Data
const ADMIN_STATS = [
  { label: 'Total users', value: '4,821', change: '+12% this month', positive: true },
  { label: 'Active jobs', value: '318', change: '+8% this week', positive: true },
  { label: 'Revenue', value: '$92k', change: '+5% vs last month', positive: true },
  { label: 'Disputes open', value: '14', change: '+3 new today', positive: false, alert: true },
];

const ADMIN_RECENT_JOBS = [
  { title: 'Plumbing repair', customer: 'Ali K.', status: 'Pending', statusType: 'warning' },
  { title: 'Electrical check', customer: 'Sara M.', status: 'Assigned', statusType: 'success' },
  { title: 'AC service', customer: 'Omar R.', status: 'In progress', statusType: 'info' },
  { title: 'Painting', customer: 'Hina B.', status: 'Completed', statusType: 'success' },
];

const ADMIN_TECH_PERF = [
  { name: 'Usman T.', rating: 4.9, jobs: 42, color: 'bg-[#7eb8f7]', width: '90%' },
  { name: 'Raza A.', rating: 4.7, jobs: 31, color: 'bg-[#4ade80]', width: '75%' },
  { name: 'Zainab K.', rating: 4.5, jobs: 27, color: 'bg-[#fbbf24]', width: '60%' },
];

const CUSTOMER_STATS = [
  { label: 'Total jobs posted', value: '24', change: '+3 this month', positive: true },
  { label: 'Active jobs', value: '2', subtitle: 'In progress', blueSubtitle: true },
  { label: 'Total spent', value: '$1,840', subtitle: 'Lifetime' },
  { label: 'Avg. rating given', value: '4.6', isRating: true, subtitle: 'Across 20 jobs' },
];

const CUSTOMER_ACTIVE_JOBS = [
  { title: 'AC service', tech: 'Usman T.', time: 'Today 2:00 PM', status: 'In progress', statusType: 'info' },
  { title: 'Plumbing leak', sub: 'Awaiting assignment', status: 'Pending', statusType: 'warning' },
  { title: 'Painting - bedroom', tech: 'Hina B.', time: 'Yesterday', status: 'Completed', statusType: 'success' },
];

const CUSTOMER_FAV_TECHS = [
  { name: 'Usman T.', initials: 'UT', spec: 'AC & Refrigeration', rating: 4.9, color: 'text-blue-400', bg: 'bg-blue-900/30' },
  { name: 'Raza A.', initials: 'RA', spec: 'Electrician', rating: 4.7, color: 'text-green-400', bg: 'bg-green-900/30' },
  { name: 'Hina B.', initials: 'HB', spec: 'Painting', rating: 4.8, color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
];

const CUSTOMER_JOB_CATS = [
  { name: 'AC & Cooling', jobs: 9, color: 'bg-[#378ADD]', width: '80%' },
  { name: 'Plumbing', jobs: 7, color: 'bg-[#4ade80]', width: '60%' },
  { name: 'Electrical', jobs: 5, color: 'bg-[#fbbf24]', width: '40%' },
  { name: 'Painting', jobs: 3, color: 'bg-[#8b5cf6]', width: '25%' },
];

const CUSTOMER_ACTIVITY = [
  { icon: IconCheck, text: 'Painting job completed by Hina B.', time: '2h ago', color: 'text-[#4ade80]' },
  { icon: IconBolt, text: 'Usman T. accepted your AC service request', time: '5h ago', color: 'text-[#7eb8f7]' },
  { icon: IconCoin, text: 'Payment of $120 processed for painting job', time: 'Yesterday', color: 'text-[#fbbf24]' },
  { icon: IconStar, text: 'You rated Raza A. 5 stars for electrical work', time: '2 days ago', color: 'text-[#fbbf24]' },
];

const TECH_STATS = [
  { label: 'Jobs this month', value: '18', change: '+4 vs last month', positive: true },
  { label: 'Monthly earnings', value: '$1,240', change: '+11%', positive: true },
  { label: 'Avg. rating', value: '4.9', isRating: true, subtitle: '42 reviews' },
  { label: 'Completion rate', value: '97%', subtitle: 'Top 5%', positiveSubtitle: true },
];

const TECH_INCOMING = [
  { title: 'AC service', customer: 'Sara M.', time: 'Today 2:00 PM', loc: 'Rawalpindi', price: '$85' },
  { title: 'Refrigerator fix', customer: 'Omar R.', time: 'Tomorrow 10:00 AM', loc: 'Islamabad', price: '$110' },
];

const TECH_SCHEDULE = [
  { time: '9:00 AM', title: 'Electrical check', customer: 'Hina B.', loc: 'Block A, Rawalpindi', status: 'Done', statusType: 'success' },
  { time: '2:00 PM', title: 'AC service', customer: 'Sara M.', loc: 'G-11, Islamabad', status: 'Now', statusType: 'success', active: true },
  { time: '5:00 PM', title: 'Plumbing', customer: 'Ali K.', loc: 'F-8, Islamabad', status: 'Upcoming', statusType: 'info' },
];

const TECH_REVIEWS = [
  { initials: 'SM', customer: 'Sara M.', rating: 5, text: 'Very professional and fast service.', bg: 'bg-[#1e2d4a]', color: 'text-[#7eb8f7]' },
  { initials: 'OR', customer: 'Omar R.', rating: 4, text: 'Fixed the AC quickly, good work.', bg: 'bg-[#14301f]', color: 'text-[#4ade80]' },
];

const TECH_SKILLS = [
  { name: 'AC & Cooling', jobs: 38, rating: 4.9, width: '85%', color: 'bg-[#fbbf24]' },
  { name: 'Refrigerator repair', jobs: 12, rating: 4.8, width: '60%', color: 'bg-[#fbbf24]' },
  { name: 'Electrical basics', jobs: 6, rating: 4.6, width: '30%', color: 'bg-[#8b5cf6]' },
];

// Badge component
const Badge = ({ text, type }) => {
  const styles = {
    success: 'bg-[#14301f] text-[#4ade80]',
    warning: 'bg-[#2d2010] text-[#fbbf24]',
    info: 'bg-[#0e2040] text-[#7eb8f7]',
    danger: 'bg-[#2d1010] text-[#f87171]',
  };
  return (
    <span className={`px-2.5 py-1 rounded-sm text-[11px] uppercase tracking-wider font-semibold ${styles[type]}`}>
      {text}
    </span>
  );
};

// Sidebar Nav Item
const NavItem = ({ icon: Icon, label, active, role }) => {
  const activeStyles = {
    admin: 'bg-[#1e2d4a] text-[#7eb8f7]',
    customer: 'bg-[#1e2d4a] text-[#7eb8f7]',
    technician: 'bg-[#2d2010] text-[#fbbf24]',
  };

  return (
    <div className={`flex items-center gap-3 px-2.5 py-2 rounded-sm cursor-pointer mb-1 transition-colors ${active ? activeStyles[role] : 'text-[#8b90a8] hover:text-[#e8eaf2] hover:bg-[#1a1d27]'}`}>
      <Icon size={18} stroke={active ? 2 : 1.5} />
      <span className="text-[13px] font-medium">{label}</span>
    </div>
  );
};

export default function DemoPage() {
  const [role, setRole] = useState('admin');
  const [online, setOnline] = useState(true);

  const renderAdmin = () => (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {ADMIN_STATS.map((stat, i) => (
          <div key={i} className="card flex flex-col justify-between">
            <p className="text-[#8b90a8] text-[13px] mb-2">{stat.label}</p>
            <p className="text-[#e8eaf2] text-[22px] font-semibold leading-tight mb-3">{stat.value}</p>
            <div className={`flex items-center gap-1 text-[11px] font-medium ${stat.alert ? 'text-[#f87171]' : (stat.positive ? 'text-[#4ade80]' : 'text-[#8b90a8]')}`}>
              {stat.positive && <IconArrowUpRight size={14} />}
              {stat.alert && <IconArrowUpRight size={14} />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#e8eaf2] font-semibold text-[15px]">Recent job requests</h3>
          </div>
          <div className="flex flex-col gap-3">
            {ADMIN_RECENT_JOBS.map((job, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#2e3140] last:border-0 last:pb-0">
                <span className="text-[#e8eaf2] text-[13px]">{job.title} — <span className="text-[#8b90a8]">{job.customer}</span></span>
                <Badge text={job.status} type={job.statusType} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-[#e8eaf2] font-semibold text-[15px] mb-4">Technician performance</h3>
          <div className="flex flex-col gap-4">
            {ADMIN_TECH_PERF.map((tech, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#e8eaf2]">{tech.name}</span>
                  <div className="flex items-center gap-1 text-[#8b90a8]">
                    <span className="text-[#e8eaf2]">{tech.rating}</span>
                    <IconStar size={12} className="text-[#fbbf24] fill-[#fbbf24]" />
                    <span>· {tech.jobs} jobs</span>
                  </div>
                </div>
                <div className="h-1 bg-[#23263a] rounded-full overflow-hidden">
                  <div className={`h-full ${tech.color} rounded-full`} style={{ width: tech.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomer = () => (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <h2 className="text-[20px] font-semibold text-[#e8eaf2] flex items-center gap-2">
        Good afternoon, Sara <span className="text-[24px]">👋</span>
      </h2>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {CUSTOMER_STATS.map((stat, i) => (
          <div key={i} className="card flex flex-col justify-between">
            <p className="text-[#8b90a8] text-[13px] mb-2">{stat.label}</p>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[#e8eaf2] text-[22px] font-semibold leading-tight">{stat.value}</p>
              {stat.isRating && <IconStar size={18} className="text-[#fbbf24] fill-[#fbbf24]" />}
            </div>
            {stat.change && (
              <div className="flex items-center gap-1 text-[11px] font-medium text-[#4ade80]">
                <IconArrowUpRight size={14} /> {stat.change}
              </div>
            )}
            {stat.subtitle && (
              <p className={`text-[11px] font-medium ${stat.blueSubtitle ? 'text-[#7eb8f7]' : 'text-[#8b90a8]'}`}>
                {stat.subtitle}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Two Column Row 1 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#e8eaf2] font-semibold text-[15px]">Active jobs</h3>
            <button className="text-[13px] text-[#4a4f66] hover:text-[#8b90a8]">View all</button>
          </div>
          <div className="flex flex-col gap-4">
            {CUSTOMER_ACTIVE_JOBS.map((job, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#2e3140] last:border-0 last:pb-0">
                <div className="flex flex-col gap-1">
                  <span className="text-[#e8eaf2] text-[13px] font-medium">{job.title}</span>
                  <span className="text-[#8b90a8] text-[11px]">
                    {job.tech ? `${job.tech} · ${job.time}` : job.sub}
                  </span>
                </div>
                <Badge text={job.status} type={job.statusType} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-[#e8eaf2] font-semibold text-[15px] mb-4">Monthly spending</h3>
          <p className="text-[#8b90a8] text-[11px] mb-4">Last 6 months (USD)</p>
          <div className="flex items-end justify-between h-[120px] pt-4 border-b border-[#23263a] pb-2">
            {['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, i) => {
              const heights = ['40%', '30%', '60%', '45%', '80%', '65%'];
              const isCurrent = month === 'May';
              return (
                <div key={i} className="flex flex-col items-center gap-2 w-full">
                  <div 
                    className={`w-8 rounded-t-sm ${isCurrent ? 'bg-[#378ADD]' : 'bg-[#1e2d4a]'}`} 
                    style={{ height: heights[i] }}
                  ></div>
                  <span className={`text-[11px] ${isCurrent ? 'text-[#378ADD] font-semibold' : 'text-[#8b90a8]'}`}>{month}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Two Column Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-[#e8eaf2] font-semibold text-[15px] mb-4">Favourite technicians</h3>
          <div className="flex flex-col gap-3">
            {CUSTOMER_FAV_TECHS.map((tech, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#2e3140] last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${tech.bg} ${tech.color}`}>
                    {tech.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#e8eaf2] text-[13px] font-medium">{tech.name}</span>
                    <span className="text-[#8b90a8] text-[11px] flex items-center gap-1">
                      {tech.spec} · <IconStar size={10} className="text-[#fbbf24] fill-[#fbbf24]" /> {tech.rating}
                    </span>
                  </div>
                </div>
                <button className="text-[13px] text-[#4a4f66] hover:text-[#8b90a8] font-medium">Book</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-[#e8eaf2] font-semibold text-[15px] mb-4">Job categories used</h3>
          <div className="flex flex-col gap-4">
            {CUSTOMER_JOB_CATS.map((cat, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#e8eaf2]">{cat.name}</span>
                  <span className="text-[#8b90a8]">{cat.jobs} jobs</span>
                </div>
                <div className="h-1 bg-[#23263a] rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Width Activity */}
      <div className="card">
        <h3 className="text-[#e8eaf2] font-semibold text-[15px] mb-4">Recent activity</h3>
        <div className="flex flex-col gap-4">
          {CUSTOMER_ACTIVITY.map((act, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-[#2e3140] last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <act.icon size={16} className={act.color} />
                <span className="text-[#e8eaf2] text-[13px]">{act.text}</span>
              </div>
              <span className="text-[#4a4f66] text-[11px]">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTechnician = () => (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <h2 className="text-[20px] font-semibold text-[#e8eaf2] flex items-center gap-2">
        Hey Usman, you have <span className="text-[#fbbf24]">2 new requests</span> today
      </h2>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {TECH_STATS.map((stat, i) => (
          <div key={i} className="card flex flex-col justify-between">
            <p className="text-[#8b90a8] text-[13px] mb-2">{stat.label}</p>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[#e8eaf2] text-[22px] font-semibold leading-tight">{stat.value}</p>
              {stat.isRating && <IconStar size={18} className="text-[#fbbf24] fill-[#fbbf24]" />}
            </div>
            {stat.change && (
              <div className="flex items-center gap-1 text-[11px] font-medium text-[#4ade80]">
                <IconArrowUpRight size={14} /> {stat.change}
              </div>
            )}
            {stat.subtitle && (
              <p className={`text-[11px] font-medium ${stat.positiveSubtitle ? 'text-[#4ade80]' : 'text-[#8b90a8]'}`}>
                {stat.subtitle}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Two Column Row 1 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#e8eaf2] font-semibold text-[15px]">Incoming requests</h3>
            <Badge text="2 new" type="warning" />
          </div>
          <div className="flex flex-col gap-4">
            {TECH_INCOMING.map((req, i) => (
              <div key={i} className="flex flex-col py-3 border-b border-[#2e3140] last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#e8eaf2] text-[13px] font-medium">{req.title} <span className="text-[#8b90a8] font-normal">— {req.customer}</span></span>
                    <span className="text-[#8b90a8] text-[11px]">{req.time} · {req.loc} · <span className="text-[#e8eaf2]">{req.price}</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button className="flex-1 py-1.5 border border-[#14301f] text-[#4ade80] hover:bg-[#14301f] text-[12px] font-medium rounded-sm transition-colors">Accept</button>
                  <button className="flex-1 py-1.5 border border-[#2d1010] text-[#f87171] hover:bg-[#2d1010] text-[12px] font-medium rounded-sm transition-colors">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-[#e8eaf2] font-semibold text-[15px] mb-4">Earnings — last 6 months</h3>
          <p className="text-[#8b90a8] text-[11px] mb-4">USD · monthly total</p>
          <div className="flex items-end justify-between h-[120px] pt-4 border-b border-[#23263a] pb-2">
            {['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month, i) => {
              const heights = ['30%', '40%', '35%', '50%', '60%', '80%'];
              const isCurrent = month === 'May';
              return (
                <div key={i} className="flex flex-col items-center gap-2 w-full px-2">
                  <div 
                    className={`w-full rounded-t-sm ${isCurrent ? 'bg-[#BA7517]' : 'bg-[#2d2010]'}`} 
                    style={{ height: heights[i] }}
                  ></div>
                  <span className={`text-[11px] ${isCurrent ? 'text-[#fbbf24] font-semibold' : 'text-[#8b90a8]'}`}>{month}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Two Column Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-[#e8eaf2] font-semibold text-[15px] mb-4">Today's schedule</h3>
          <div className="flex flex-col gap-2">
            {TECH_SCHEDULE.map((sch, i) => (
              <div key={i} className={`flex items-start gap-4 py-3 pl-3 pr-4 rounded-sm bg-[#1a1d27] relative ${sch.active ? 'bg-[#23263a]' : ''}`}>
                {sch.active && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#fbbf24]"></div>}
                <div className="w-14 text-[11px] text-[#4a4f66] pt-0.5">{sch.time}</div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-[#e8eaf2] text-[13px] font-medium">{sch.title} <span className="text-[#8b90a8] font-normal">— {sch.customer}</span></span>
                  <span className="text-[#8b90a8] text-[11px]">{sch.loc}</span>
                </div>
                <Badge text={sch.status} type={sch.statusType} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-[#e8eaf2] font-semibold text-[15px] mb-4">Recent reviews</h3>
          <div className="flex flex-col gap-4">
            {TECH_REVIEWS.map((rev, i) => (
              <div key={i} className="flex flex-col gap-2 pb-4 border-b border-[#2e3140] last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${rev.bg} ${rev.color}`}>
                      {rev.initials}
                    </div>
                    <span className="text-[#e8eaf2] text-[13px] font-medium">{rev.customer}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <IconStar key={star} size={12} className={star <= rev.rating ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-[#2e3140] fill-[#2e3140]'} />
                    ))}
                  </div>
                </div>
                <p className="text-[#8b90a8] text-[12px] pl-11">{rev.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Width Skills */}
      <div className="card">
        <h3 className="text-[#e8eaf2] font-semibold text-[15px] mb-4">Skill performance</h3>
        <div className="flex flex-col gap-4">
          {TECH_SKILLS.map((skill, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#e8eaf2]">{skill.name}</span>
                <span className="text-[#8b90a8] flex items-center gap-1">{skill.jobs} jobs · {skill.rating} <IconStar size={10} className="text-[#fbbf24] fill-[#fbbf24]" /></span>
              </div>
              <div className="h-1 bg-[#23263a] rounded-full overflow-hidden">
                <div className={`h-full ${skill.color} rounded-full`} style={{ width: skill.width }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col font-sans text-[#e8eaf2]">
      {/* Role Switcher Demo Overlay */}
      <div className="fixed bottom-6 right-6 bg-[#1a1d27] border border-[#2e3140] rounded-md shadow-2xl p-4 z-50 flex flex-col gap-3">
        <p className="text-[11px] text-[#8b90a8] uppercase font-bold tracking-widest">Demo Switcher</p>
        <div className="flex gap-2">
          {['admin', 'customer', 'technician'].map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-sm capitalize border transition-colors ${
                role === r ? 'bg-[#1e2d4a] border-[#1e2d4a] text-[#7eb8f7]' : 'border-[#2e3140] text-[#8b90a8] hover:text-[#e8eaf2]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Topbar */}
      <header className="h-[60px] bg-[#0f1117] border-b border-[#2e3140] flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <IconBolt className={`w-6 h-6 ${role === 'technician' ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-[#7eb8f7] fill-[#7eb8f7]'}`} />
          <span className="font-bold text-[18px] tracking-wide">FixrPro</span>
        </div>
        <div className="flex items-center gap-5">
          {role === 'technician' && (
            <div className="flex items-center gap-2 border border-[#2e3140] rounded-full p-1 pl-3 bg-[#1a1d27]">
              <span className="text-[11px] font-semibold text-[#4ade80] uppercase tracking-wider">Online</span>
              <div 
                className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${online ? 'bg-[#14301f]' : 'bg-[#2d1010]'}`}
                onClick={() => setOnline(!online)}
              >
                <div className={`w-4 h-4 rounded-full bg-[#4ade80] transition-transform ${online ? 'translate-x-5' : 'translate-x-0 bg-[#f87171]'}`}></div>
              </div>
            </div>
          )}

          <div className="relative">
            <IconBell size={20} className="text-[#8b90a8] hover:text-[#e8eaf2] cursor-pointer" />
            {(role === 'customer' || role === 'admin') && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-[#f87171] rounded-full border-2 border-[#0f1117]"></div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[13px] font-medium leading-none">
                {role === 'admin' ? 'Admin' : role === 'customer' ? 'Sara Malik' : 'Usman T.'}
              </span>
              <span className="text-[11px] text-[#8b90a8] mt-1 leading-none capitalize">
                {role === 'technician' ? 'AC & Cooling' : role}
              </span>
            </div>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0
              ${role === 'admin' ? 'bg-[#1e2d4a] text-[#7eb8f7]' : role === 'customer' ? 'bg-[#14301f] text-[#4ade80]' : 'bg-[#2d2010] text-[#fbbf24]'}`}
            >
              {role === 'admin' ? 'AD' : role === 'customer' ? 'SM' : 'UT'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[170px] bg-[#0f1117] border-r border-[#2e3140] flex flex-col py-6 px-3 shrink-0 overflow-y-auto hidden md:flex">
          {role === 'admin' && (
            <>
              <div className="mb-6">
                <p className="text-[10px] uppercase text-[#4a4f66] font-bold tracking-widest mb-2 px-2.5">Overview</p>
                <NavItem icon={IconLayoutDashboard} label="Dashboard" active role={role} />
                <NavItem icon={IconUsers} label="Users" role={role} />
                <NavItem icon={IconBriefcase} label="Jobs" role={role} />
                <NavItem icon={IconStar} label="Reviews" role={role} />
              </div>
              <div className="mb-6">
                <p className="text-[10px] uppercase text-[#4a4f66] font-bold tracking-widest mb-2 px-2.5">Finance</p>
                <NavItem icon={IconCoin} label="Payments" role={role} />
                <NavItem icon={IconFileAnalytics} label="Reports" role={role} />
              </div>
              <div>
                <p className="text-[10px] uppercase text-[#4a4f66] font-bold tracking-widest mb-2 px-2.5">System</p>
                <NavItem icon={IconSettings} label="Settings" role={role} />
                <NavItem icon={IconAlertTriangle} label="Alerts" role={role} />
              </div>
            </>
          )}

          {role === 'customer' && (
            <>
              <div className="mb-6">
                <p className="text-[10px] uppercase text-[#4a4f66] font-bold tracking-widest mb-2 px-2.5">Menu</p>
                <NavItem icon={IconLayoutDashboard} label="Dashboard" active role={role} />
                <NavItem icon={IconPlus} label="Post a job" role={role} />
                <NavItem icon={IconBriefcase} label="My jobs" role={role} />
                <NavItem icon={IconMessageCircle} label="Messages" role={role} />
                <NavItem icon={IconMapPin} label="Track technician" role={role} />
              </div>
              <div>
                <p className="text-[10px] uppercase text-[#4a4f66] font-bold tracking-widest mb-2 px-2.5">Account</p>
                <NavItem icon={IconCoin} label="Payments" role={role} />
                <NavItem icon={IconStar} label="Reviews" role={role} />
                <NavItem icon={IconHeart} label="Saved techs" role={role} />
                <NavItem icon={IconSettings} label="Settings" role={role} />
              </div>
            </>
          )}

          {role === 'technician' && (
            <>
              <div className="mb-6">
                <p className="text-[10px] uppercase text-[#4a4f66] font-bold tracking-widest mb-2 px-2.5">Work</p>
                <NavItem icon={IconLayoutDashboard} label="Dashboard" active role={role} />
                <NavItem icon={IconBriefcase} label="Available jobs" role={role} />
                <NavItem icon={IconCalendar} label="My schedule" role={role} />
                <NavItem icon={IconMessageCircle} label="Messages" role={role} />
                <NavItem icon={IconMapPin} label="Navigate" role={role} />
              </div>
              <div className="mb-6">
                <p className="text-[10px] uppercase text-[#4a4f66] font-bold tracking-widest mb-2 px-2.5">Earnings</p>
                <NavItem icon={IconCoin} label="Earnings" role={role} />
                <NavItem icon={IconFileInvoice} label="Invoices" role={role} />
              </div>
              <div>
                <p className="text-[10px] uppercase text-[#4a4f66] font-bold tracking-widest mb-2 px-2.5">Profile</p>
                <NavItem icon={IconStar} label="My reviews" role={role} />
                <NavItem icon={IconUser} label="My profile" role={role} />
                <NavItem icon={IconSettings} label="Settings" role={role} />
              </div>
            </>
          )}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 max-w-[1200px] mx-auto w-full">
          {role === 'admin' && renderAdmin()}
          {role === 'customer' && renderCustomer()}
          {role === 'technician' && renderTechnician()}
        </main>
      </div>
    </div>
  );
}
