import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import Playerstats from 'components/Playerstats';
import { fetchWrapper } from 'helpers';
import getConfig from 'next/config';
import { userService } from 'services';
import { takeUntil } from 'rxjs';
const { publicRuntimeConfig } = getConfig();


const teamstats = ["pip", "lead", "poss", "tf", "2nd", "bench", "fbp", "pipm", "pipa"]
const playerstats = ["pkt", "reb"]

const index = () => {
  const [ownRoster, setOwnRoster] = useState([])
  const [ownTeamId, setOwnTeamId] = useState()
  const [saved, setSaved] = useState(false)
  const [teams, setTeams] = useState([])

  useEffect(() => {
    const gmName = userService.userValue.name
    const init = async () => {
      const teamsBaseUrl = `${publicRuntimeConfig.apiUrl}/teams`
      const { teamId: ownTeamId } = await fetchWrapper.get(`${teamsBaseUrl}/gm/${gmName}`)
      setOwnTeamId(ownTeamId)
      const { roster: ownRoster } = await fetchWrapper.get(`${teamsBaseUrl}/roster/${ownTeamId}`)
      setOwnRoster(ownRoster)
      console.log(ownRoster)

      const { teams } = await fetchWrapper.get(`${teamsBaseUrl}`)
      setTeams(teams.filter(team => team.team_id != ownTeamId))

    }
    init();
  }, [])


  // const validationSchema = Yup.object().shape({
  //   opponent: Yup.string().oneOf(teams).required('Choose opponent'),
  //   pip: Yup.number()
  // });
  // const formOptions = { resolver: yupResolver(validationSchema) };

  // formOptions
  const methods = useForm();
  const { errors } = methods.formState;

  async function onSubmit(formState) {
    console.log(formState)
    const saved = await fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/stats/game`, formState)
    setSaved(saved)
  }
  return (
    <FormProvider {...methods}>
      {methods.setValue("ownTeamId", parseInt(ownTeamId))}
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="form-group" style={{ display: "flex" }}>
          <select style={{ flex: "1" }} name="opponent" {...methods.register('opponent', { valueAsNumber: true, onChange: () => { console.log("change") } })}>
            <option value="" default>Opponent</option>
            {teams && teams.map(team =>
              (<option key={team.team_id} value={team.team_id}>{team.name}</option>)
            )}
          </select>
          <div className="invalid-feedback">{errors.opponent?.message}</div>
          {teamstats.map(stat =>
          (<>
            <input style={{ width: "60px" }} type="number" key={stat} name={stat} placeholder={stat} {...methods.register(`team.${stat}`, { valueAsNumber: true })}></input>
          </>
          )
          )}
        </div>

        <Playerstats players={ownRoster} />

        <button type="submit" className="btn btn-primary" disabled={saved}>Save</button>
        {saved && <div>Saved!</div>}
      </form>

    </FormProvider>
  )
}
export default index;
