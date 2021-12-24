const { default: fetch, Headers } = require('node-fetch');
const { writeFileSync } = require('fs');

const tournamentId = '4468708049713692672';

async function request(route, range) {
    const headers = new Headers();
    headers.append('X-Api-Key', process.env['API_KEY']);
    headers.append('Authorization', process.env['TOKEN']);
    headers.append('Range', range);

    const res = await fetch('https://api.toornament.com/organizer/v2' + route, { headers });
    return res.json();
}

async function pullData(tournamentId) {
    const stages = await request(`/stages?tournament_ids=${tournamentId}`, 'stages=0-49');
    console.log(stages);

    const roundRobinStageIds = stages.filter(stage => stage.type === 'pools').map(stage => stage.id);
    const roundRobinMatches = await request(`/matches?stage_ids=${roundRobinStageIds.join(',')}`, 'matches=0-99');
    console.log(roundRobinMatches);

    const nodes = await request(`/bracket-nodes?tournament_ids=${tournamentId}`, 'nodes=0-127');
    console.log(nodes);

    const matchGames = [];

    for (const node of nodes) {
        const games = (await request(`/matches/${node.id}/games`, 'games=0-49')).map(game => ({
            parent_id: node.id,
            ...game,
        }));

        matchGames.push(...games);
        console.log(games);
    }

    const matches = [...roundRobinMatches, nodes].sort((a, b) => a.round_id - b.round_id);
    const match_games = matchGames.sort((a, b) => a.parent_id - b.parent_id);

    return {
        tournament_id: tournamentId,
        stages,
        matches,
        match_games,
    };
}

pullData(tournamentId).then(data => {
    writeFileSync('input/toornament.json', JSON.stringify(data, null, 4));
});