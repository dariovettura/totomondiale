import oldMatches from "../calendar/fake_result";
import newMatchesStock from "../calendar/new_calendar";
import matchMap from "../calendar/matchMap";

function removeHours(numOfHours, date = new Date()) {
  date.setTime(date.getTime() - numOfHours * 60 * 60 * 1000);

  return date;
}

const updateOldMatch = (oldMatch, newMatch) => {
  console.log("match", oldMatch, newMatch);
  let updatedMatch = { ...oldMatch };
  if (newMatch.status === "FINISHED") {
    updatedMatch.status = "finished";
    updatedMatch.stats.home_score = newMatch.score.fullTime.home;
    updatedMatch.stats.away_score = newMatch.score.fullTime.away;
  }


  return updatedMatch;
};

export const parseMatches = (newMatches) => {
  console.log("newMatches", newMatches);
  return oldMatches.map((oldMatch) => {
    const newMatch = newMatches.matches.find((m) => m.id === matchMap[oldMatch.match_id]);
    return updateOldMatch(oldMatch, newMatch);

  });
  // newMatches.matches.forEach((match) => {
  //   console.log("match", match.id, match.homeTeam?.name, match.awayTeam?.name, match.utcDate);
  // });
}