import React from 'react'
import DataTable from 'react-data-table-component';
import getConfig from 'next/config';
import { fetchWrapper } from 'helpers';
const { publicRuntimeConfig } = getConfig();


function standings({ data }) {
  const columns = [
    {
      name: 'Team',
      selector: row => row.name,
    },
    {
      name: 'W',
      selector: row => row.wins,
    },
    {
      name: 'L',
      selector: row => row.losses,
    },
  ];
  return (
    <DataTable
      columns={columns}
      data={data}
    />
  )
}

export default standings

export async function getServerSideProps() {
  const standings = await fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/stats/standings`)
  return {props:{ data: standings } }

}
