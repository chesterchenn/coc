type State = 'preparation' | 'inWar' | 'warEnded' | 'notInWar';

type Attack = {
  attackerTag: string;
  defenderTag: string;
  stars: number;
  destructionPercentage: number;
  order: number;
  duration: number;
};

type Member = {
  tag: string;
  name: string;
  townhallLevel: number;
  mapPosition: number;
  attacks: Array<Attack>;
  opponentAttacks: number;
  bestOpponentAttack: Attack;
  mapIndex: number;
};

type Clan = {
  tag: string;
  name: string;
  clanLevel: number;
  attacks: number;
  stars: number;
  destructionPercentage: number;
  members: Array<Member>;
};

export type QueryResult = {
  reason: string;
  state: State;
  preparationTime: string;
  startTime: string;
  endTime: string;
  clan: Clan;
  opponent: Clan;
};
