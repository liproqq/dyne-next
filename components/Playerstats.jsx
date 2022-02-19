import { useFormContext } from "react-hook-form";

export default ({ players, stat }) => {
  const { register } = useFormContext(); // retrieve all hook methods
  const playerstats = [`min`, `pkt`, `reb`, `ast`, `stl`, `blk`, `to`, `fgm`, `fga`, `3ptm`, `3pta`, `ftm`, `fta`, `oreb`, `pf`, `pls_mns`, `starter`, `pog`]

  return (
    <>
      {
        players.map((player, index) => {
          return (
            <div className="form-group" style={{ display: "flex" }}>
              <label >{player.name} </label>
              {playerstats.map(stat =>
                <input
                  placeholder={stat}
                  type="number"
                  style={{ width: "50px" }}
                  {...register(`players.${index}.${stat}`)}
                  value={players[index][stat]}
                />
              )}
            </div>
          )

        })
      }
    </>
  )
}
