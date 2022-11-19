export const parsePlayers = (allPlayer, results) => {
  // stage_ids
  const GROUPS = 6;
  // round_ids
  const EIGHTS = 46854;
  const QUARTERS = 46850;
  const SEMIS = 46849;
  const THIRDS = 46848;
  const FINAL = 46852;
  // match id
  const WINNER = 429770;
  // id bomber
  const BOMBER = "bomber";

  const pointValues = {
    [GROUPS]: 1,
    [EIGHTS]: 2,
    [QUARTERS]: 2,
    [SEMIS]: 2,
    [THIRDS]: 6,
    [FINAL]: 8,
    [WINNER]: 12,
    [BOMBER]: 5,
  };

  let groupsCal = results.filter((el) => {
    return el.stage.stage_id === GROUPS;
  });

  let eightsCal = results.filter((el) => {
    return el.round.round_id === EIGHTS;
  });
  let quartersCal = results.filter((el) => {
    return el.round.round_id === QUARTERS;
  });
  let semisCal = results.filter((el) => {
    return el.round.round_id === SEMIS;
  });
  let thirdPlaceCal = results.filter((el) => {
    return el.round.round_id === THIRDS;
  });
  let finalCal = results.filter((el) => {
    return el.round.round_id === FINAL;
  });
  let groupsResults = {};
  groupsCal.forEach((el) => {
    let result = "0";
    if (el.status === "finished") {
      if (el.stats?.home_score > el.stats?.away_score) {
        result = "1";
      } else if (el.stats?.home_score < el.stats?.away_score) {
        result = "2";
      } else {
        result = "x";
      }
    }
    groupsResults[el.match_id] = result;
  });
  let poResults = {};
  poResults[EIGHTS] = [];
  eightsCal.forEach((el) => {
    if (el.away_team?.team_id && el.home_team?.team_id) {
      poResults[EIGHTS].push(el.home_team.team_id);
      poResults[EIGHTS].push(el.away_team.team_id);
    }
  });
  poResults[QUARTERS] = [];
  quartersCal.forEach((el) => {
    if (el.away_team?.team_id && el.home_team?.team_id) {
      poResults[QUARTERS].push(el.home_team.team_id);
      poResults[QUARTERS].push(el.away_team.team_id);
    }
  });
  poResults[SEMIS] = [];
  semisCal.forEach((el) => {
    if (el.away_team?.team_id && el.home_team?.team_id) {
      poResults[SEMIS].push(el.home_team.team_id);
      poResults[SEMIS].push(el.away_team.team_id);
    }
  });
  poResults[THIRDS] = [];
  thirdPlaceCal.forEach((el) => {
    if (el.away_team?.team_id && el.home_team?.team_id) {
      poResults[THIRDS].push(el.home_team.team_id);
      poResults[THIRDS].push(el.away_team.team_id);
    }
  });
  poResults[FINAL] = [];
  poResults[WINNER] = 0;
  finalCal.forEach((el) => {
    if (el.away_team?.team_id && el.home_team?.team_id) {
      poResults[FINAL].push(el.home_team.team_id);
      poResults[FINAL].push(el.away_team.team_id);
      if (el.status === "finished") {
        if (el.stats?.home_score > el.stats?.away_score) {
          poResults[WINNER] = el.home_team.team_id;
        } else if (el.stats?.home_score < el.stats?.away_score) {
          poResults[WINNER] = el.away_team.team_id;
        }
      }
    }
  });


  const players = allPlayer.map((player) => {
    const bets = JSON.parse(player?.customer_note);
    let groupsBets = {};
    bets?.myResult.forEach((b) => {
      groupsBets[b.match_id] = b.result;
    });

    let poBets = {};
    poBets[EIGHTS] = [
      bets?.myPlayOffResults?.gironeA1,
      bets?.myPlayOffResults?.gironeA2,
      bets?.myPlayOffResults?.gironeB1,
      bets?.myPlayOffResults?.gironeB2,
      bets?.myPlayOffResults?.gironeC1,
      bets?.myPlayOffResults?.gironeC2,
      bets?.myPlayOffResults?.gironeD1,
      bets?.myPlayOffResults?.gironeD2,
      bets?.myPlayOffResults?.gironeE1,
      bets?.myPlayOffResults?.gironeE2,
      bets?.myPlayOffResults?.gironeF1,
      bets?.myPlayOffResults?.gironeF2,
      bets?.myPlayOffResults?.gironeG1,
      bets?.myPlayOffResults?.gironeG2,
      bets?.myPlayOffResults?.gironeH1,
      bets?.myPlayOffResults?.gironeH2,
    ];
    poBets[QUARTERS] = [
      bets?.myPlayOffResults?.quarti1,
      bets?.myPlayOffResults?.quarti2,
      bets?.myPlayOffResults?.quarti3,
      bets?.myPlayOffResults?.quarti4,
      bets?.myPlayOffResults?.quarti5,
      bets?.myPlayOffResults?.quarti6,
      bets?.myPlayOffResults?.quarti7,
      bets?.myPlayOffResults?.quarti8,
    ];
    poBets[SEMIS] = [
      bets?.myPlayOffResults?.semi1,
      bets?.myPlayOffResults?.semi2,
      bets?.myPlayOffResults?.semi3,
      bets?.myPlayOffResults?.semi4,
    ];
    poBets[THIRDS] = [
      bets?.myPlayOffResults?.terzo1,
      bets?.myPlayOffResults?.terzo2,
    ];
    poBets[FINAL] = [
      bets?.myPlayOffResults?.finale1,
      bets?.myPlayOffResults?.finale2,
    ];
    poBets[WINNER] = bets?.myPlayOffResults?.vincitrice;
    poBets[BOMBER] = bets?.myPlayOffResults?.capocannoniere;

    let score = 0;
    let winningBets = 0;
    Object.keys(groupsBets).forEach((key) => {
      if (groupsBets[key] === groupsResults[key]) {
        score += pointValues[GROUPS];
        winningBets++;
      }
    });
    Object.keys(poBets).forEach((key) => {
      if (![""+WINNER, BOMBER].includes(key)) {
        poBets[key].forEach((b) => {
          if (poResults[key].includes(b)) {
            score += 1 * pointValues[key];
            winningBets++;
          }
        });
      }
    });
    if (poBets[WINNER] === poResults[WINNER]) {
      score += pointValues[WINNER];
      winningBets++;
    }
    if (poBets[BOMBER] === poResults[BOMBER]) {
      score += pointValues[BOMBER];
      winningBets++;
    }

    return {
      name: player.billing?.first_name,
      id: player.id,
      groupsBets,
      poBets,
      score,
      winningBets,
    };
  });
  return players;
}