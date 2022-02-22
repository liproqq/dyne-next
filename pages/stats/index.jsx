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
  const [teams, setTeams] = useState([])

  useEffect(() => {
    const gmName = userService.userValue.name
    const init = async () => {
      const teamsBaseUrl = `${publicRuntimeConfig.apiUrl}/teams`
      const { teamId: ownTeamId } = await fetchWrapper.get(`${teamsBaseUrl}/gm/${gmName}`)
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

  function onSubmit(formState) {
    console.log(formState)
  }
  return (
    <FormProvider {...methods}>

      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="form-group">
          <select name="opponent" {...methods.register('opponent')}>
            <option value="" default>Opponent</option>
            {teams && teams.map(team =>
              (<option key={team.team_id} value={team.team_id}>{team.name}</option>)
            )}
          </select>
          <div className="invalid-feedback">{errors.opponent?.message}</div>
        </div>
        <div className="form-group">
          {teamstats.map(stat =>
          (<>
            <input style={{ width: "60px" }} type="number" key={stat} name={stat} placeholder={stat} {...methods.register(stat)}></input>
          </>
          )
          )}
        </div>

        <Playerstats players={ownRoster} />

        <button type="submit" className="btn btn-primary">Save</button>
      </form>

    </FormProvider>
  )
}
export default index;
