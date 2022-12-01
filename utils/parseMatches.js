import oldMatches from "../calendar/fake_result";
import newMatchResults from "../calendar/fake_result_new";
import newMatchesStock from "../calendar/new_calendar";
import matchMap from "../calendar/matchMap";
import teamMap from "../calendar/teamMap";
import teams from "../teams/teams";

function removeHours(numOfHours, date = new Date()) {
  date.setTime(date.getTime() - numOfHours * 60 * 60 * 1000);

  return date;
}

const updateOldMatch = (oldMatch, newMatch) => {
  // console.log("match", oldMatch, newMatch);
  let updatedMatch = { ...oldMatch };
  if (newMatch.status === "FINISHED") {
    updatedMatch.status = "finished";
    updatedMatch.stats.home_score = newMatch.score.fullTime.home;
    updatedMatch.stats.away_score = newMatch.score.fullTime.away;
  }
  if (oldMatch.away_team === null && newMatch.awayTeam !== null) {
    const awayTeamId = teamMap[newMatch.awayTeam.id];
    const homeTeamId = teamMap[newMatch.homeTeam.id];
    const away_team = teams.find((team) => team.team_id === awayTeamId);
    const home_team = teams.find((team) => team.team_id === homeTeamId);
    updatedMatch.away_team = away_team;
    updatedMatch.home_team = home_team;
  }


  return updatedMatch;
};

export const parseMatches = (newMatches) => {
  // console.log("newMatches", newMatches);
  const results = oldMatches.map((oldMatch) => {
    const newMatch = newMatches.matches.find((m) => m.id === matchMap[oldMatch.match_id]);
    return updateOldMatch(oldMatch, newMatch);
  });
  return results;
  // newMatches.matches.forEach((match) => {
  //   console.log("match", match.id, match.homeTeam?.name, match.awayTeam?.name, match.utcDate);
  // });
}