const { default: fetch, Headers } = require('node-fetch');
const { writeFileSync } = require('fs');

const tournamentId = '4468708049713692672';

async function request(route, range) {
    const headers = new Headers();
    headers.append('X-Api-Key', process.env['API_KEY']);
    headers.append('Authorization', process.env['TOKEN']);
    headers.append('Range', range);

    const res = await fetch('https://api.toornament.com/organizer/v2' + route, { headers });
    return res.json()
}

async function pullData(tournamentId) {
    const stages = await request(`/stages?tournament_ids=${tournamentId}`, 'stages=0-49');
    console.log(stages);

    const nodes = await request(`/bracket-nodes?tournament_ids=${tournamentId}`, 'nodes=0-127');
    console.log(nodes);

    const match_games = [];

    for (const node of nodes) {
        const games = (await request(`/matches/${node.id}/games`, 'games=0-49')).map(game => ({
            parent_id: node.id,
            ...game,
        }));

        match_games.push(...games);
        console.log(games);
    }

    return {
        tournament_id: tournamentId,
        stages,
        matches: nodes,
        match_games
    };
}

pullData(tournamentId).then(data => {
    writeFileSync('input/toornament.json', JSON.stringify(data, null, 4));
});