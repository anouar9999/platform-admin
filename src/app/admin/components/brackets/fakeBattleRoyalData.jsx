// Fake data for Battle Royale tournament development and testing
export const FAKE_BATTLE_ROYALE_DATA = {
  success: true,
  tournament: {
    id: 2,
    name: "Apex Legends Championship",
    description: "Season 5 Battle Royale Tournament",
    start_date: "2023-09-15",
    end_date: "2023-10-30",
    status: "active",
    game: "Apex Legends",
    format: "battle_royale"
  },
  settings: {
    kill_points: 1,
    placement_points: {
      1: 12,
      2: 9,
      3: 7,
      4: 5,
      5: 4,
      6: 3,
      7: 2,
      8: 1
    },
    max_teams: 20,
    matches_per_round: 5
  },
  participants: [
    {
      participant_id: 1,
      participant_name: "Team Liquid",
      participant_image: "/uploads/teams/team_liquid.png",
      total_kills: 45,
      total_placement_points: 32,
      total_points: 77,
      matches_played: 5
    },
    {
      participant_id: 2,
      participant_name: "Cloud9",
      participant_image: "/uploads/teams/cloud9.png",
      total_kills: 38,
      total_placement_points: 27,
      total_points: 65,
      matches_played: 5
    },
    {
      participant_id: 3,
      participant_name: "TSM",
      participant_image: "/uploads/teams/tsm.png",
      total_kills: 36,
      total_placement_points: 25,
      total_points: 61,
      matches_played: 5
    },
    {
      participant_id: 4,
      participant_name: "100 Thieves",
      participant_image: "/uploads/teams/100thieves.png",
      total_kills: 32,
      total_placement_points: 24,
      total_points: 56,
      matches_played: 5
    },
    {
      participant_id: 5,
      participant_name: "NRG",
      participant_image: "/uploads/teams/nrg.png",
      total_kills: 29,
      total_placement_points: 22,
      total_points: 51,
      matches_played: 5
    },
    {
      participant_id: 6,
      participant_name: "Sentinels",
      participant_image: "/uploads/teams/sentinels.png",
      total_kills: 27,
      total_placement_points: 18,
      total_points: 45,
      matches_played: 5
    },
    {
      participant_id: 7,
      participant_name: "G2 Esports",
      participant_image: "/uploads/teams/g2.png",
      total_kills: 25,
      total_placement_points: 19,
      total_points: 44,
      matches_played: 5
    },
    {
      participant_id: 8,
      participant_name: "Fnatic",
      participant_image: "/uploads/teams/fnatic.png",
      total_kills: 24,
      total_placement_points: 16,
      total_points: 40,
      matches_played: 5
    },
    {
      participant_id: 9,
      participant_name: "FaZe Clan",
      participant_image: "/uploads/teams/faze.png",
      total_kills: 22,
      total_placement_points: 15,
      total_points: 37,
      matches_played: 5
    },
    {
      participant_id: 10,
      participant_name: "Team Envy",
      participant_image: "/uploads/teams/envy.png",
      total_kills: 20,
      total_placement_points: 14,
      total_points: 34,
      matches_played: 5
    },
    {
      participant_id: 11,
      participant_name: "Complexity",
      participant_image: "/uploads/teams/complexity.png",
      total_kills: 18,
      total_placement_points: 12,
      total_points: 30,
      matches_played: 5
    },
    {
      participant_id: 12,
      participant_name: "Rogue",
      participant_image: "/uploads/teams/rogue.png",
      total_kills: 17,
      total_placement_points: 11,
      total_points: 28,
      matches_played: 5
    },
    {
      participant_id: 13,
      participant_name: "Luminosity",
      participant_image: "/uploads/teams/luminosity.png",
      total_kills: 15,
      total_placement_points: 10,
      total_points: 25,
      matches_played: 5
    },
    {
      participant_id: 14,
      participant_name: "Spacestation",
      participant_image: "/uploads/teams/spacestation.png",
      total_kills: 14,
      total_placement_points: 9,
      total_points: 23,
      matches_played: 5
    },
    {
      participant_id: 15,
      participant_name: "Team SoloMid",
      participant_image: "/uploads/teams/tsm_alt.png",
      total_kills: 12,
      total_placement_points: 8,
      total_points: 20,
      matches_played: 5
    }
  ],
  matches: [
    {
      match_id: 1,
      match_name: "Match 1",
      match_date: "2023-09-15",
      results: [
        { participant_id: 1, position: 1, kills: 9 },
        { participant_id: 3, position: 2, kills: 8 },
        { participant_id: 2, position: 3, kills: 7 },
        { participant_id: 5, position: 4, kills: 6 },
        { participant_id: 4, position: 5, kills: 5 }
        // Other teams' results...
      ]
    },
    {
      match_id: 2,
      match_name: "Match 2",
      match_date: "2023-09-22",
      results: [
        { participant_id: 2, position: 1, kills: 10 },
        { participant_id: 1, position: 2, kills: 8 },
        { participant_id: 4, position: 3, kills: 7 },
        { participant_id: 6, position: 4, kills: 6 },
        { participant_id: 3, position: 5, kills: 5 }
        // Other teams' results...
      ]
    },
    {
      match_id: 3,
      match_name: "Match 3",
      match_date: "2023-09-29",
      results: [
        { participant_id: 3, position: 1, kills: 9 },
        { participant_id: 5, position: 2, kills: 8 },
        { participant_id: 1, position: 3, kills: 7 },
        { participant_id: 7, position: 4, kills: 6 },
        { participant_id: 2, position: 5, kills: 5 }
        // Other teams' results...
      ]
    },
    {
      match_id: 4,
      match_name: "Match 4",
      match_date: "2023-10-06",
      results: [
        { participant_id: 1, position: 1, kills: 11 },
        { participant_id: 4, position: 2, kills: 9 },
        { participant_id: 2, position: 3, kills: 8 },
        { participant_id: 8, position: 4, kills: 7 },
        { participant_id: 5, position: 5, kills: 6 }
        // Other teams' results...
      ]
    },
    {
      match_id: 5,
      match_name: "Match 5",
      match_date: "2023-10-13",
      results: [
        { participant_id: 1, position: 1, kills: 10 },
        { participant_id: 2, position: 2, kills: 8 },
        { participant_id: 3, position: 3, kills: 7 },
        { participant_id: 4, position: 4, kills: 5 },
        { participant_id: 5, position: 5, kills: 4 }
        // Other teams' results...
      ]
    }
  ]
};

// Function to simulate API response delay
export const getFakeBattleRoyaleData = (tournamentId = 2, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(FAKE_BATTLE_ROYALE_DATA);
    }, delay);
  });
};