import DataTable from 'react-data-table-component';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';
const { publicRuntimeConfig } = getConfig();
import { Link } from '../../components/Link';

export default Roster;

function Roster({ roster, season, team }) {
  const { name, color1, color2, font1, font2 } = roster[0]
  const columns = [
    {
      name: 'First',
      selector: row => row.first,
      sortable: true
    },
    {
      name: 'Last',
      selector: row => row.last,
      sortable: true
    },
    {
      name: 'OVR',
      selector: row => row.ovr,
      sortable: true
    },
    {
      name: 'Position',
      selector: row => row.pos,
      sortFunction: (a, b, c) => {
        const posOrder = ["PG", "SG", "SF", "PF", "C"];
        return posOrder.indexOf(a.pos) - posOrder.indexOf(b.pos)
      },
      sortable: true
    },
    {
      name: 'Salary',
      selector: row => row.salary,
      format: ({ salary }) => (new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(salary * 1e6)),
      sortable: true
    },
    {
      name: 'Tenure',
      selector: row => row.yit,
      sortable: true
    },
    {
      name: 'Age',
      selector: row => (row.year - new Date(row.birthdate).getFullYear()),
      sortable: true
    },
  ];
  return (
    <div className="card mt-4">
      <h4 className="card-header" style={{ background: color1, color: font1 }}>
        {name} season {season} 
      <Link style={{ background: color1, color: font1 }} href={`/roster/${team}/${season - 1}`}>-</Link>
      <Link style={{ background: color1, color: font1 }} href={`/roster/${team}/${+season + 1}`}>+</Link>
      </h4>
      <div className="card-body">
        <DataTable
          columns={columns}
          data={roster}
        />

      </div>
    </div>

  )
}

export async function getServerSideProps(context) {
  const [team, season] = context.query.params
  let roster = await fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/roster/${team}/${season}`)
  roster= roster.sort((a,b) => (b.ovr - a.ovr))
  return { props: { roster, season, team } }
}
