import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Playerstats from 'components/Playerstats';

const teams = ["ATL", "BKN"]
const players = [{ name: "Giannis", pkt: 0 }, { name: "Tobias", pkt: 3 }]
const teamstats = ["pip", "lead", "poss", "tf", "2nd", "bench", "fbp", "pipm", "pipa"]
const playerstats = ["pkt", "reb"]

const index = () => {

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
            {teams.map(team =>
              (<option key={team} value={team}>{team}</option>)
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

        <Playerstats players={players} />

        <button type="submit" className="btn btn-primary">Save</button>
      </form>

    </FormProvider>
  )
}
export default index; 
