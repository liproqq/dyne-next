import { useFormContext } from "react-hook-form";

const Playerstats = ({ players, stat }) => {
  const { register, setValue } = useFormContext(); // retrieve all hook methods
  const playerstats = [`min`, `pkt`, `reb`, `ast`, `stl`, `blk`, `to`, `fgm`, `fga`, `3ptm`, `3pta`, `ftm`, `fta`, `oreb`, `pf`, `pls_mns`, `starter`, `pog`]

  return (
    <>
      <div style={{ display: "flex" }}>
        <label style={{ flex: "1" }} >Name </label>
        {playerstats.map(stat =>
          <div
            style={{ width: "50px" }}
          >
            {stat}
          </div>
        )}
      </div>
      <div>
        {
          players.map((player, index) => {
            return (
              <div className="form-group" key={player.player_id} style={{ display: "flex" }}>
                <label style={{ flex: "1" }} >{player.name} </label>
                {playerstats.map(stat =>
                  <input
                    key={player.player_id + stat}
                    placeholder={stat}
                    type={["starter", "pog"].includes(stat) ? "checkbox" : "number"}
                    style={{ width: "50px" }}
                    {...register(`players.${index}.${stat}`, { valueAsNumber: !["starter", "pog"].includes(stat) })}
                    value={players[index][stat]}
                  />
                )}
                {setValue(`players.${index}.id`, player.player_id)}
                {setValue(`players.${index}.name`, player.name)}
              </div>
            )

          })
        }
      </div>
    </>
  )
}
export default Playerstats