import dotenv from 'dotenv';
dotenv.config();

const tag = process.env.tag;

/**
 * 将结果依据 mapPosition 排序，添加 mapIndex，并将部落放入 clan 对象
 */
function sortWart(war) {
  const { clan, opponent } = war;
  const clanMembersOrders = clan.members
    .sort((a, b) => a.mapPosition - b.mapPosition)
    .map((member, index) => ({
      ...member,
      mapIndex: index + 1,
    }));
  const opponentMembersOrders = opponent.members
    .sort((a, b) => a.mapPosition - b.mapPosition)
    .map((member, index) => ({
      ...member,
      mapIndex: index + 1,
    }));
  const _clan = {
    ...clan,
    members: clanMembersOrders,
  };
  const _opponent = {
    ...opponent,
    members: opponentMembersOrders,
  };
  const [resultClan, resultOpponent] =
    _clan.tag !== `#${tag}` ? [_opponent, _clan] : [_clan, _opponent];
  return {
    ...war,
    clan: resultClan,
    opponent: resultOpponent,
  };
}

export default sortWart;
